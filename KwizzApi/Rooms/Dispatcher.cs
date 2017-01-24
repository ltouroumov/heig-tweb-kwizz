using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KwizzApi.Rooms
{
    using DispatchCondition = Func<RoomClientSocket, bool>;
    using DispatchHandler = Func<RoomClientSocket, ClientMessage, Task>;

    public interface IDispatcher
    {
        Task HandleAsync(RoomClientSocket client, ClientMessage message);
    }

    public class Dispatcher : IDispatcher
    {

        private readonly Dictionary<string, DispatchHandler> _handlers;

        private DispatchHandler _default;

        public Dispatcher()
        {
            _handlers = new Dictionary<string, DispatchHandler>();
        }

        public void AddHandler(string command, DispatchHandler handler)
        {
            _handlers.Add(command, handler);
        }

        public void AddDefault(DispatchHandler handler)
        {
            _default = handler;
        }

        public async Task HandleAsync(RoomClientSocket client, ClientMessage message)
        {
            var command = message.Command;
            DispatchHandler handler;
            if (!_handlers.TryGetValue(command, out handler))
                handler = _default;

            if (handler != null)
            {
                await handler.Invoke(client, message);
            }
        }

        public static DispatcherBuilder Builder()
        {
            return new DispatcherBuilder();
        }
    }

    public class ConditionalDispatcher : IDispatcher
    {

        private readonly List<Tuple<DispatchCondition, IDispatcher>> _conditions;

        private IDispatcher _default;

        public ConditionalDispatcher()
        {
            _conditions = new List<Tuple<DispatchCondition, IDispatcher>>();
        }

        public void AddDispatcher(DispatchCondition cond, IDispatcher dispatcher)
        {
            _conditions.Add(new Tuple<DispatchCondition, IDispatcher>(cond, dispatcher));
        }

        public void AddDefault(IDispatcher dispatcher)
        {
            _default = dispatcher;
        }

        public async Task HandleAsync(RoomClientSocket client, ClientMessage message)
        {
            IDispatcher handler = null;
            foreach (var tuple in _conditions)
            {
                try
                {
                    if (!tuple.Item1.Invoke(client))
                        continue;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("What the fuck {0}", ex.Message);
                }

                handler = tuple.Item2;
                break;
            }

            handler = handler ?? _default;

            if (handler != null)
            {
                await handler.HandleAsync(client, message);
            }
        }

        public static ConditionalDispatcherBuilder Builder()
        {
            return new ConditionalDispatcherBuilder();
        }
    }
}