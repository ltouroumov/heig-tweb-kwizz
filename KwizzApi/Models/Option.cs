using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace KwizzApi.Models
{
    public class Option
    {
        public long Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public int Votes { get; set; } = 0;

        [JsonIgnore]
        public Question Question { get; set; }

        [JsonIgnore]
        public IList<UserAnswer> Answers { get; set; }
    }
}