using System.Collections.Generic;
using System.Data;
using System.Net.WebSockets;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using KwizzApi.Models;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using KwizzApi.Utils;

namespace KwizzApi.Rooms {

    public class RoomHandler
    {
        private readonly ILogger<RoomHandler> _logger;

        private readonly MessageConverter _converter = new MessageConverter();

        public Room Room { get; private set; }

        private readonly IList<RoomClientSocket> _clients = new List<RoomClientSocket>();

        public RoomHandler(Room room, ILogger<RoomHandler> logger) {
            Room = room;
            _logger = logger;
        }

        public RoomClientSocket Connect(WebSocket socket, ApplicationUser user) {
            var client = new RoomClientSocket(socket, user, this);
            client.OnConnect += OnClientConnectAsync;
            client.OnClose += OnClientLeave;
            client.OnMessage += OnClientMessageAsync;
            _clients.Add(client);
            return client;
        }

        private async void OnClientConnectAsync(RoomClientSocket client)
        {
            await client.SendAsync(_converter.Encode(new ClientMessage
            {
                Command = "SyncState",
                Args = Room
            }));
        }

        private async void OnClientMessageAsync(RoomClientSocket client, string msgJson)
        {
            _logger.LogDebug("Received Message {0} from {1}", msgJson, client);
            ClientMessage msg;
            if (!_converter.Decode(msgJson, out msg))
            {
                await client.SendAsync(@"{ 'Command': 'Error', 'Args': { 'Message': 'Cannot decode message' }}");
                return;
            }

            _logger.LogDebug("Dispatching message {0}", msg.Command);
        }

        private void OnClientLeave(RoomClientSocket client)
        {
            _clients.Remove(client);
        }

        private string Error(string message)
        {
            return JsonConvert.SerializeObject(new
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