using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using System.Text;

namespace KwizzApi.Rooms
{
    public delegate void MessageHandler(RoomClientSocket client, string msg);

    public delegate void CloseHandler(RoomClientSocket client);

    public class RoomClientSocket
    {

        private int BufferSize;

        private WebSocket Socket;

        private RoomHandler Handler;

        public event MessageHandler OnMessage;

        public event CloseHandler OnClose;

        public RoomClientSocket(WebSocket socket, RoomHandler handler, int bufferSize = 4096) {
            Socket = socket;
            Handler = handler;
            BufferSize = bufferSize;
        }

        public async Task Handle() {
            var buffer = new byte[BufferSize];
            var seg = new ArraySegment<byte>(buffer);

            while (Socket.State == WebSocketState.Open)
            {
                var incoming = await Socket.ReceiveAsync(seg, CancellationToken.None);
                var messageContent = Encoding.UTF8.GetString(buffer, 0, incoming.Count);
                OnMessage?.Invoke(this, messageContent);
            }

            OnClose?.Invoke(this);
        }

        public async Task SendAsync(string message)
        {
            var bytes = Encoding.UTF8.GetBytes(message);
            var seg = new ArraySegment<byte>(bytes);
            await Socket.SendAsync(seg, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}