using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace KwizzApi.Models.Views.Room {

    public class CreateRoom {

        public string Name { get; set; }

    }

    public class UpdateRoom : CreateRoom {

        [JsonConverter(typeof(StringEnumConverter))]
        public RoomStatus Status { get; set; }

    }

}