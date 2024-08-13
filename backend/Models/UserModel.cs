using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Net.Mail;
using System.Xml.Linq;

namespace BiometricFaceApi.Models
{
    [Table("users")]
    [Index(nameof(Badge), IsUnique = true)]
    public class UserModel
    {
        [Key]
        public int ID { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O Username deve ter no máximo 50 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9_\\-\\s]+$", ErrorMessage = "O Name deve conter apenas letras, números, underscores (_), hífens (-) e espaços, e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^[a-zA-Z0-9]{1,255}$", ErrorMessage = "O Badge deve conter apenas letras e números.")]
        public string? Badge { get; set; }
        public DateTime Created { get; set; }


    }
}
