using Org.BouncyCastle.Crypto.Digests;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BiometricFaceApi.Models
{
    public class BiometricModel
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? RolesName { get; set; }
        public string? Badge { get; set; }
        [NotMapped]
        public IFormFile? Image { get; set; }
    }

}
