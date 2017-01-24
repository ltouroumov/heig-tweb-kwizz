using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace KwizzApi.Models
{
    public class Question
    {
        public long Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        [JsonConverter(typeof(StringEnumConverter))]
        public QuestionType Type { get; set; }

        public IList<Option> Options { get; set; } = new List<Option>();

        [JsonIgnore]
        public Room Room { get; set; }
    }

    public enum QuestionType
    {
        MultipleChoice = 0, Free = 1
    }
}