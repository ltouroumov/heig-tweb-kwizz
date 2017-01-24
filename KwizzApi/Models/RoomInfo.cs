using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace KwizzApi.Models
{
    public class RoomInfo
    {
        public long Id { get; set; } = 0;

        [Required]
        public string Name { get; set; }

        public string Key { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public RoomStatus Status { get; set; } = RoomStatus.Closed;

        public ApplicationUser Owner { get; set; }
    }
}