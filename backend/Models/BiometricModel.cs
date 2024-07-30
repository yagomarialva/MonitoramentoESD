using Org.BouncyCastle.Crypto.Digests;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BiometricFaceApi.Models
{
    public class BiometricModel
    {
        public int? ID { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O Name deve ter no máximo 50 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O Name deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$).+", ErrorMessage = "O Badge não pode ser vazio ou conter apenas espaços em branco")]
        public string? Badge { get; set; }
        [NotMapped]
        public IFormFile? Image { get; set; }
    }

}
