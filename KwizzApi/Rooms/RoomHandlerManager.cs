using System.Collections.Generic;
using System.Linq;
using KwizzApi.Models;
using Microsoft.Extensions.Logging;

namespace KwizzApi.Rooms {

    public class RoomHandlerManager {

        private readonly ISet<RoomHandler> _roomHandlers = new HashSet<RoomHandler>();

        private ILoggerFactory _loggerFactory;

        public RoomHandlerManager(ILoggerFactory loggerFactory)
        {
            this._loggerFactory = loggerFactory;
        }

        public RoomHandler GetHandler(Room room) {
            var pool = _roomHandlers.FirstOrDefault(p => p.Room == room);

            if (pool != null)
                return pool;

            pool = new RoomHandler(room, _loggerFactory.CreateLogger<RoomHandler>());
            _roomHandlers.Add(pool);

            return pool;
        }

    }

}