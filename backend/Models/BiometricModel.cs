using Org.BouncyCastle.Crypto.Digests;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.ConstrainedExecution;
using System.Text.Json.Serialization;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;

namespace BiometricFaceApi.Models
{
    public class BiometricModel
    {
        public int? ID { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O Name deve ter no máximo 50 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9_\\-\\s]+$", ErrorMessage = "O UserId deve conter apenas letras, números, underscores (_), hífens (-) e espaços, e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Name { get; set; }


        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^[a-zA-Z0-9]{1,255}$", ErrorMessage = "O Badge deve conter apenas letras e números.")]
        public string? Badge { get; set; }

        [NotMapped]
        public IFormFile? Image { get; set; }
    }

}
