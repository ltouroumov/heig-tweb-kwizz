using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using System.Text;
using KwizzApi.Models;

namespace KwizzApi.Rooms
{
    public delegate void ConnectHandler(RoomClientSocket client);

    public delegate void MessageHandler(RoomClientSocket client, string msg);

    public delegate void CloseHandler(RoomClientSocket client);

    public class RoomClientSocket
    {

        private readonly int _bufferSize;

        private readonly WebSocket _socket;

        private RoomHandler _handler;

        public readonly ApplicationUser User;

        public event ConnectHandler OnConnect;

        public event MessageHandler OnMessage;

        public event CloseHandler OnClose;

        public RoomClientSocket(WebSocket socket, ApplicationUser user, RoomHandler handler, int bufferSize = 4096) {
            _socket = socket;
            User = user;
            _handler = handler;
            _bufferSize = bufferSize;
        }

        public async Task Handle() {
            var buffer = new byte[_bufferSize];
            var seg = new ArraySegment<byte>(buffer);


            OnConnect?.Invoke(this);

            while (_socket.State == WebSocketState.Open)
            {
                var incoming = await _socket.ReceiveAsync(seg, CancellationToken.None);
                var messageContent = Encoding.UTF8.GetString(buffer, 0, incoming.Count);
                OnMessage?.Invoke(this, messageContent);
            }

            OnClose?.Invoke(this);
        }

        public async Task SendAsync(string message)
        {
            var bytes = Encoding.UTF8.GetBytes(message);
            var seg = new ArraySegment<byte>(bytes);
            await _socket.SendAsync(seg, WebSocketMessageType.Text, true, CancellationToken.None);
        }

        public async Task Close()
        {
            await _socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
        }
    }
}