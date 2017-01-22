using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using KwizzApi.Models;
using KwizzApi.Models.Views.Room;
using KwizzApi.Rooms;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace KwizzApi.Controllers
{
    [Route("rooms")]
    public class RoomsController : Controller
    {
        private KwizzContext Context;
        private RoomHandlerManager RoomHandlerManager;
        private ILogger<RoomsController> Logger;

        public RoomsController(KwizzContext context, RoomHandlerManager roomHandlerManager, ILogger<RoomsController> logger)
        {
            this.Context = context;
            this.RoomHandlerManager = roomHandlerManager;
            this.Logger = logger;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<Room> Get()
        {
            return Context.Rooms.OrderBy(room => room.Id).ToList();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public Room Get(long id)
        {
            return Context.Rooms.First(room => room.Id == id);
        }

        // POST api/values
        [HttpPost]
        public Room Post([FromBody] CreateRoom body)
        {
            var room = new Room()
            {
                Name = body.Name
            };
            Context.Rooms.Add(room);
            Context.SaveChanges();

            return room;
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public Room Put(int id, [FromBody] UpdateRoom body)
        {
            var room = Context.Rooms.First(r => r.Id == id);
            room.Name = body.Name;
            room.Status = body.Status;

            Context.Rooms.Update(room);
            Context.SaveChanges();

            return room;
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var room = Context.Rooms.First(r => r.Id == id);
            Context.Rooms.Remove(room);
            Context.SaveChanges();
        }

        [HttpGet("{id}/connect")]
        [AllowAnonymous]
        public async Task Connect(int id)
        {
            var user = HttpContext.User;
            Logger.LogInformation("Attempting connection to room {0} with {1}", id, user.FindFirst(JwtRegisteredClaimNames.Sub)?.Value);
            var room = Context.Rooms.FirstOrDefault(r => r.Id == id);
            if (room == null)
            {
                Logger.LogError("Room not found {0}", id);
            }
            else if (!HttpContext.WebSockets.IsWebSocketRequest)
            {
                Logger.LogError("Is not a websocket upgrade request");
            }
            else
            {
                Logger.LogInformation("Accepting Connection");
                var socket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                Logger.LogInformation("Creating Handler");
                var handler = RoomHandlerManager.GetHandler(room);
                Logger.LogInformation("Handling Connection");
                await handler.Connect(socket).Handle();
                Logger.LogInformation("Connection Terminated");
            }
        }
    }
}