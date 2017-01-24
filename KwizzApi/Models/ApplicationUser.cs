using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Newtonsoft.Json;

namespace KwizzApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        [JsonIgnore]
        public IList<UserAnswer> Answers { get; set; }
    }
}