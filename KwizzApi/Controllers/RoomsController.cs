using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using KwizzApi.Models;
using KwizzApi.Models.Views.Room;

namespace KwizzApi.Controllers
{
    [Route("rooms")]
    public class RoomsController : Controller
    {
        private KwizzContext Db;

        public RoomsController(KwizzContext db) {
            this.Db = db;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<Room> Get()
        {
            return Db.Rooms.OrderBy(room => room.Id).ToList();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public Room Get(long id)
        {
            return Db.Rooms.First(room => room.Id == id);
        }

        // POST api/values
        [HttpPost]
        public Room Post([FromBody]CreateRoom body)
        {
            var room = new Room() {
                Name = body.Name
            };
            Db.Rooms.Add(room);
            Db.SaveChanges();

            return room; 
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public Room Put(int id, [FromBody]UpdateRoom body)
        {
            var room = Db.Rooms.First(r => r.Id == id);
            room.Name = body.Name;
            room.Status = body.Status;

            Db.Rooms.Update(room);
            Db.SaveChanges();

            return room;
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var room = Db.Rooms.First(r => r.Id == id);
            Db.Rooms.Remove(room);
            Db.SaveChanges();
        }
    }
}
