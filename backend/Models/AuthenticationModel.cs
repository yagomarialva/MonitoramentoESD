using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BiometricFaceApi.Models
{
    [Table("authentication")]
    [Index(nameof(Badge), IsUnique = true)]
    public class AuthenticationModel
    {
        public int ID { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(10, ErrorMessage = "O Username deve ter no máximo 10 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O Username deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? RolesName { get; set; }


        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$).+", ErrorMessage = "O Badge não pode ser vazio ou conter apenas espaços em branco")]
        public string? Badge { get; set; }


        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$", ErrorMessage = "O Password deve ter pelo menos 8 caracteres, incluindo pelo menos uma letra e um número, " +
            "e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Password { get; set; }
        

    }
}
