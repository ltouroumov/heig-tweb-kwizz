using System;
using Newtonsoft.Json;

namespace KwizzApi.Rooms
{
    public class MessageConverter
    {
        public bool Decode(string msgJson, out ClientMessage msg)
        {
            try
            {
                msg = JsonConvert.DeserializeObject<ClientMessage>(msgJson);
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
            return JsonConvert.SerializeObject(msg);
        }
    }
}