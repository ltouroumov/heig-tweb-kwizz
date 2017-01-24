using System.Collections.Generic;
using Newtonsoft.Json;

namespace KwizzApi.Models
{
    public class Room
    {
        [JsonIgnore]
        public long Id { get; set; } = 0;

        public RoomInfo Info { get; set; }

        public ICollection<Question> Questions { get; set; }
    }
}