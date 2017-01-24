using System;
using System.Threading.Tasks;

namespace KwizzApi.Rooms
{
    using DispatchCondition = Func<RoomClientSocket, bool>;
    using DispatchHandler = Func<RoomClientSocket, ClientMessage, Task>;

    public class DispatcherBuilder
    {
        private readonly Dispatcher _dispatcher;

        public DispatcherBuilder()
        {
            _dispatcher = new Dispatcher();
        }

        public DispatcherBuilder On(string command, DispatchHandler handler)
        {
            _dispatcher.AddHandler(command, handler);
            return this;
        }

        public DispatcherBuilder Else(DispatchHandler handler)
        {
            _dispatcher.AddDefault(handler);
            return this;
        }

        public Dispatcher Build()
        {
            return _dispatcher;
        }
    }

    public class ConditionalDispatcherBuilder
    {
        private readonly ConditionalDispatcher _dispatcher;

        public ConditionalDispatcherBuilder()
        {
            _dispatcher = new ConditionalDispatcher();
        }

        public ConditionalDispatcherBuilder When(Func<RoomClientSocket, bool> cond, Func<IDispatcher> builder)
        {
            _dispatcher.AddDispatcher(cond, builder.Invoke());
            return this;
        }

        public ConditionalDispatcherBuilder Else(Func<IDispatcher> builder)
        {
            _dispatcher.AddDefault(builder.Invoke());
            return this;
        }

        public ConditionalDispatcher Build()
        {
            return _dispatcher;
        }
    }
}