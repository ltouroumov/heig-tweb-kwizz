using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace KwizzApi.Models
{
    
    public class Room {

        public long Id { get; set; } = 0;

        public String Name { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public RoomStatus Status { get; set; } = RoomStatus.Closed;

    }

}
