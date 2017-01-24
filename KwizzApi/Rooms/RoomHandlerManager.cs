using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KwizzApi.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;

namespace KwizzApi.Rooms {

    public class RoomHandlerManager {

        private readonly ISet<RoomHandler> _roomHandlers = new HashSet<RoomHandler>();

        private readonly ILoggerFactory _loggerFactory;
        private readonly IServiceProvider _serviceProvider;

        public RoomHandlerManager(IServiceProvider serviceProvider, ILoggerFactory loggerFactory)
        {
            _loggerFactory = loggerFactory;
            _serviceProvider = serviceProvider;
        }

        public RoomHandler GetHandler(Room room) {
            var pool = _roomHandlers.FirstOrDefault(p => p.Room == room);

            if (pool != null)
                return pool;

            pool = new RoomHandler(room, _serviceProvider, _loggerFactory.CreateLogger<RoomHandler>());
            _roomHandlers.Add(pool);

            return pool;
        }

        public static async Task Acceptor(HttpContext hc, Func<Task> n, IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();
            var logger = serviceProvider.GetService<ILogger<RoomHandlerManager>>();
            var context = serviceProvider.GetService<KwizzContext>();
            var roomHandlerManager = serviceProvider.GetService<RoomHandlerManager>();

            var idValues = hc.Request.Query.Where(pair => pair.Key == "id").Select(pair => pair.Value).FirstOrDefault();
            if (idValues == StringValues.Empty)
            {
                hc.Response.StatusCode = 400;
                return;
            }
            var id = long.Parse(idValues[0]);

            var user = await userManager.GetUserAsync(hc.User);
            logger.LogInformation("Attempting connection to room {0} with {1}", id, user.UserName);

            var room = context.Rooms
                .Include("Info")
                .Include("Info.Owner")
                .Include("Questions.Options")
                .FirstOrDefault(r => r.Info.Id == id);

            if (room == null)
            {
                logger.LogError("Room not found {0}", id);
                hc.Response.StatusCode = 404;
                return;
            }

            if (!hc.WebSockets.IsWebSocketRequest)
            {
                logger.LogError("Is not a websocket upgrade request");
                hc.Response.StatusCode = 400;
                return;
            }

            logger.LogInformation("Accepting Upgrade Request");
            var socket = await hc.WebSockets.AcceptWebSocketAsync();
            var handler = roomHandlerManager.GetHandler(room);
            logger.LogInformation("Connecting to room {0} ({1})", room.Id, room.Info);
            try
            {
                await handler.Connect(socket, user).HandleAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(0, ex, "Error during socket handling");
            }
        }

        public static void Map(IApplicationBuilder builder)
        {
            builder.UseWebSockets();
            builder.Use((ctx, next) => Acceptor(ctx, next, builder.ApplicationServices));
        }

    }

}