using System;
using Newtonsoft.Json;

namespace KwizzApi.Models
{
    public class UserAnswer
    {

        public long OptionId { get; set; }

        public string UserId { get; set; }

        [JsonIgnore]
        public Option Option { get; set; }

        [JsonIgnore]
        public ApplicationUser User { get; set; }

    }
}