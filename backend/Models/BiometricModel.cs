using Org.BouncyCastle.Crypto.Digests;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BiometricFaceApi.Models
{
    public class BiometricModel
    {
        public int? Id { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? Name { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? Badge { get; set; }
        [NotMapped]
        public IFormFile? Image { get; set; }
    }

}
