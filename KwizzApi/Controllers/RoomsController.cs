using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using KwizzApi.Models;
using KwizzApi.Models.Views.Room;
using KwizzApi.Rooms;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
        public async Task<IList<RoomInfo>> Get()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            return _context.RoomInfos
                .Include(r => r.Owner)
                .Where(r => r.Owner == user)
                .OrderBy(r => r.Id)
                .ToList();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(long id)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var room = _context.RoomInfos
                .Include(r => r.Owner)
                .FirstOrDefault(r => r.Id == id);

            if (room == null)
                return NotFound();

            return Ok(room);
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateRoom body)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var room = new Room
            {
                Info = new RoomInfo
                {
                    Name = body.Name,
                    Owner = user
                }
            };
            _context.Rooms.Add(room);
            _context.RoomInfos.Add(room.Info);
            _context.SaveChanges();

            return Ok(room);
        }

        // PUT api/values/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateRoom body)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var room = _context.RoomInfos.FirstOrDefault(r => r.Owner == user && r.Id == id);

            if (room == null)
                return NotFound();

            room.Name = body.Name;
            room.Status = body.Status;

            _context.RoomInfos.Update(room);
            _context.SaveChanges();

            return Ok(room);
        }

        // DELETE api/values/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var room = _context.Rooms
                .Include(r => r.Info)
                .Include("Questions.Options.Answers")
                .FirstOrDefault(r => r.Info.Owner == user && r.Id == id);

            if (room == null)
                return NotFound();

            _context.RoomInfos.Remove(room.Info);
            _context.Rooms.Remove(room);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("join")]
        public async Task<IActionResult> Join([FromBody] JoinView body)
        {
            var room = _context.RoomInfos
                .Include(r => r.Owner)
                .FirstOrDefault(r => r.Key == body.Name);

            if (room == null)
                return NotFound();

            return Ok(room);
        }

        [HttpGet("{id:int}/connect")]
        public async Task Connect(int id)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            _logger.LogInformation("Attempting connection to room {0} with {1}", id, user.UserName);
            var room = _context.Rooms
                .Include(r => r.Info)
                .Include("Questions.Options")
                .FirstOrDefault(r => r.Info.Id == id);

            if (room == null)
            {
                _logger.LogError("Room not found {0}", id);
                return;
            }

            if (!HttpContext.WebSockets.IsWebSocketRequest)
            {
                _logger.LogError("Is not a websocket upgrade request");

                return;
            }

            var socket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            var handler = _roomHandlerManager.GetHandler(room);
            _logger.LogInformation("Connecting to room {0} ({1})", room.Id, room.Info);
            try
            {
                await handler.Connect(socket, user).HandleAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(0, ex, "Error during socket handling");
            }
        }
    }

    public class JoinView
    {
        public string Name { get; set; }
    }
}