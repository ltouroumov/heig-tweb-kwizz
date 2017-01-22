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
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace KwizzApi.Controllers
{
    [Route("rooms")]
    public class RoomsController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly KwizzContext _context;
        private readonly RoomHandlerManager _roomHandlerManager;
        private readonly ILogger<RoomsController> _logger;

        public RoomsController(KwizzContext context, RoomHandlerManager roomHandlerManager, ILogger<RoomsController> logger, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _roomHandlerManager = roomHandlerManager;
            _logger = logger;
            _userManager = userManager;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<Room> Get()
        {
            return _context.Rooms.OrderBy(room => room.Id).ToList();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public Room Get(long id)
        {
            return _context.Rooms.First(room => room.Id == id);
        }

        // POST api/values
        [HttpPost]
        public Room Post([FromBody] CreateRoom body)
        {
            var room = new Room()
            {
                Name = body.Name
            };
            _context.Rooms.Add(room);
            _context.SaveChanges();

            return room;
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public Room Put(int id, [FromBody] UpdateRoom body)
        {
            var room = _context.Rooms.First(r => r.Id == id);
            room.Name = body.Name;
            room.Status = body.Status;

            _context.Rooms.Update(room);
            _context.SaveChanges();

            return room;
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var room = _context.Rooms.First(r => r.Id == id);
            _context.Rooms.Remove(room);
            _context.SaveChanges();
        }

        [HttpGet("{id}/connect")]
        public async Task Connect(int id)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            _logger.LogInformation("Attempting connection to room {0} with {1}", id, user.UserName);
            var room = _context.Rooms.FirstOrDefault(r => r.Id == id);
            if (room == null)
            {
                _logger.LogError("Room not found {0}", id);
            }
            else if (!HttpContext.WebSockets.IsWebSocketRequest)
            {
                _logger.LogError("Is not a websocket upgrade request");
            }
            else
            {
                _logger.LogInformation("Accepting Connection");
                var socket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                _logger.LogInformation("Creating Handler");
                var handler = _roomHandlerManager.GetHandler(room);
                _logger.LogInformation("Handling Connection");
                await handler.Connect(socket, user).Handle();
                _logger.LogInformation("Connection Terminated");
            }
        }
    }
}