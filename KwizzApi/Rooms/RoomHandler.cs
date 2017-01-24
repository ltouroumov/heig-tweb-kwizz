using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;
using KwizzApi.Models;
using KwizzApi.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace KwizzApi.Rooms {

    public class RoomHandler
    {
        private readonly ILogger<RoomHandler> _logger;

        private readonly MessageConverter _converter = new MessageConverter();

        private readonly IDispatcher _dispatcher;

        private readonly KwizzContext _context;

        public Room Room { get; }

        private readonly IList<RoomClientSocket> _clients = new List<RoomClientSocket>();
        private readonly IList<Task> _clientTasks = new List<Task>();
        private readonly IServiceProvider _serviceProvider;

        public RoomHandler(Room room, IServiceProvider serviceProvider, ILogger<RoomHandler> logger) {
            Room = room;
            _serviceProvider = serviceProvider;
            _logger = logger;
            _dispatcher =
                ConditionalDispatcher.Builder()
                .When(client => client.User == Room.Info.Owner, () =>
                    Dispatcher.Builder()
                    .On("ChangeStatus", DoChangeStatus)
                    .On("CreateQuestion", DoCreateQuestion)
                    .Build()
                )
                .Else(() =>
                    Dispatcher.Builder()
                    .On("AnswerQuestion", DoAnswerQuestion)
                    .Build()
                )
                .Build();
        }

        private async Task DoChangeStatus(RoomClientSocket client, ClientMessage message)
        {
            var context = _serviceProvider.GetService<KwizzContext>();

            string newStatus = message.Args;
            RoomStatus status;
            if (Enum.TryParse(newStatus, out status))
            {
                Room.Info.Status = status;

                switch (status)
                {
                    case RoomStatus.Open:
                        Room.Info.Key = DockerNameGenerator.GetRandomName((int) Room.Info.Id);
                        break;
                    case RoomStatus.Closed:
                        Room.Info.Key = null;
                        break;
                }

                context.RoomInfos.Update(Room.Info);
                context.SaveChanges();
                await Broadcast(new ClientMessage {
                    Command = "SyncInfo",
                    Args = new { Room.Info }
                });
            }
            else
            {
                await client.SendAsync(Error("Wrong status"));
            }
        }

        private async Task DoCreateQuestion(RoomClientSocket client, ClientMessage message)
        {
            var context = _serviceProvider.GetService<KwizzContext>();

            lock (context)
            {
                context.Update(Room);
            }

            _logger.LogDebug("Creating Question {0}", (object) message.Args);
            string typeName = message.Args.type;
            QuestionType questionType;
            if (!Enum.TryParse(typeName, out questionType))
            {
                _logger.LogError("Failed to decode question type");
                await client.SendAsync(Error("Wrong question type"));
                return;
            }

            var question = new Question
            {
                Title = message.Args.title,
                Description = message.Args.description,
                Room = Room,
                Type = questionType
            };
            lock (context)
            {
                context.Questions.Add(question);
            }

            _logger.LogDebug("Created Question {0}", question.Title);

            foreach (dynamic option in message.Args.options)
            {
                var opt = new Option
                {
                    Question = question,
                    Title = option.title
                };

                question.Options.Add(opt);
                lock (context)
                {
                    context.Options.Add(opt);
                }
                _logger.LogDebug("Created Option {0}", opt.Title);
            }

            lock (context)
            {
                context.SaveChanges();
            }
            _logger.LogDebug("Saved Changes");

            await Broadcast(new ClientMessage
            {
                Command = "NewQuestion",
                Args = question
            });
            _logger.LogDebug("Change Broadcast");
        }

        private async Task DoAnswerQuestion(RoomClientSocket client, ClientMessage message)
        {
            var context = _serviceProvider.GetService<KwizzContext>();
            _logger.LogDebug("Answer {0}", (object)message.Args);

            long? qid = message.Args.question;
            var question = Room.Questions.FirstOrDefault(q => q.Id == qid);

            if (question == null)
            {
                await client.SendAsync(Error("Question not found"));
                return;
            }

            if (question.Type == QuestionType.MultipleChoice)
            {
                long? oid = message.Args.option;
                var option = question.Options.FirstOrDefault(o => o.Id == oid);

                if (option != null)
                {
                    lock (context)
                    {
                        // Lazy loading is not implemented in EF core :(
                        context.Entry(option).Collection(t => t.Answers).Load();
                    }

                    var answer = option.Answers.FirstOrDefault(a => a.User == client.User);
                    if (answer != null)
                    {
                        await client.SendAsync(Error("Already voted on this question"));
                        return;
                    }

                    answer = new UserAnswer { Option = option, User = client.User };

                    option.Votes++;
                    option.Answers.Add(answer);
                    lock (context)
                    {
                        context.Add(answer);
                        context.Options.Update(option);
                    }
                }
                else
                {
                    await client.SendAsync(Error("Option not found"));
                    return;
                }
            }
            else if (question.Type == QuestionType.Free)
            {
                //TODO: Implement
            }

            lock (context)
            {
                context.SaveChanges();
            }
            await Broadcast(new ClientMessage {
                Command = "UpdateQuestion",
                Args = question
            });
        }

        public RoomClientSocket Connect(WebSocket socket, ApplicationUser user) {
            var client = new RoomClientSocket(socket, user, this);
            client.OnConnect += OnClientConnectAsync;
            client.OnClose += OnClientLeave;
            client.OnMessage += OnClientMessageAsync;
            _clients.Add(client);
            _logger.LogInformation("Added client for {0} (total {1} clients)", user.UserName, _clients.Count);
            return client;
        }

        public void Attach(Task clientTask)
        {
            _clientTasks.Add(clientTask);
        }

        private async Task OnClientConnectAsync(RoomClientSocket client)
        {
            await client.SendAsync(_converter.Encode(new ClientMessage
            {
                Command = "SyncState",
                Args = new
                {
                    Room,
                    Answers = GetAnswers(client)
                }
            }));
        }

        private IList<long> GetAnswers(RoomClientSocket client)
        {
            var context = _serviceProvider.GetService<KwizzContext>();

            lock (context)
            {
                context.Entry(client.User)
                    .Collection(t => t.Answers)
                    .Query()
                    .Include(ua => ua.Option)
                    .ThenInclude(opt => opt.Question)
                    .Where(ua => ua.Option.Question.Room.Id == Room.Id)
                    .Load();

                return client.User.Answers.Select(ua => ua.Option.Question.Id).ToList();
            }
        }

        private async Task OnClientMessageAsync(RoomClientSocket client, string msgJson)
        {
            _logger.LogDebug("Received Message {0} from {1}", msgJson, client.User.UserName);
            ClientMessage msg;
            if (!_converter.Decode(msgJson, out msg))
            {
                await client.SendAsync(@"{ 'Command': 'Error', 'Args': { 'Message': 'Cannot decode message' }}");
                return;
            }

            _logger.LogDebug("Dispatching message {0}", msg.Command);
            try
            {
                await _dispatcher.HandleAsync(client, msg);
            }
            catch (Exception ex)
            {
                _logger.LogError(0, ex, "Exception occured during message dispatch");
            }

        }

        private Task OnClientLeave(RoomClientSocket client)
        {
            _clients.Remove(client);
            _logger.LogDebug("Client {0} leaving (left {1} clients)", client.User.UserName, _clients.Count);
            return Task.CompletedTask;
        }

        private async Task Broadcast(ClientMessage message)
        {
            var messageStr = _converter.Encode(message);
            _logger.LogDebug("Broadcasting {0} to {1} clients", messageStr, _clients.Count);
            var tasks = _clients
                .Select(client => client.SendAsync(messageStr))
                .ToArray();

            await Task.WhenAll(tasks);
        }

        private string Error(string message)
        {
            return _converter.Encode(new ClientMessage
            {
                Command = "Error",
                Args = new
                {
                    Message = message
                }
            });
        }
    }
}