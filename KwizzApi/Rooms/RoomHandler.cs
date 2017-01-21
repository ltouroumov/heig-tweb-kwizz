using System.Collections.Generic;
using System.Net.WebSockets;
using KwizzApi.Models;
using Microsoft.Extensions.Logging;

namespace KwizzApi.Rooms {

    public class RoomHandler
    {

        private ILogger<RoomHandler> _logger;

        public Room Room { get; private set; }

        private readonly IList<RoomClientSocket> _clients = new List<RoomClientSocket>();

        public RoomHandler(Room room, ILogger<RoomHandler> logger) {
            Room = room;
            _logger = logger;
        }

        public RoomClientSocket Connect(WebSocket socket) {
            var client = new RoomClientSocket(socket, this);
            client.OnClose += OnClientLeave;
            client.OnMessage += OnClientMessage;
            _clients.Add(client);
            return client;
        }

        private void OnClientMessage(RoomClientSocket client, string msg)
        {
            _logger.LogDebug("Received Message {0} from {1}");
        }

        private void OnClientLeave(RoomClientSocket client)
        {
            _clients.Remove(client);
        }
    }

}