using System;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace KwizzApi.Rooms
{
    public class MessageConverter
    {
        private static readonly JsonSerializerSettings Settings = new JsonSerializerSettings()
        {
            ContractResolver = new LowercaseContractResolver()
        };

        public bool Decode(string msgJson, out ClientMessage msg)
        {
            try
            {
                msg = JsonConvert.DeserializeObject<ClientMessage>(msgJson, Settings);
                return true;
            }
            catch (Exception ex)
            {
                msg = null;
                return false;
            }
        }

        public string Encode(ClientMessage msg)
        {
            return JsonConvert.SerializeObject(msg, Formatting.Indented, Settings);
        }

        public string Encode(string command, object args)
        {
            return Encode(new ClientMessage { Command = command, Args = args });
        }
    }

    internal class LowercaseContractResolver : DefaultContractResolver
    {
        protected override string ResolvePropertyName(string propertyName)
        {
            var sb = new StringBuilder();
            sb.Append(Char.ToLowerInvariant(propertyName[0]));
            sb.Append(propertyName.Substring(1));
            return sb.ToString();
        }
    }
}