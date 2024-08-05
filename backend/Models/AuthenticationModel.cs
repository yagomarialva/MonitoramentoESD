using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("authentication")]
    [Index(nameof(Badge), IsUnique = true)]
    public class AuthenticationModel
    {
        public int ID { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(16, ErrorMessage = "O Username deve ter no máximo 16 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9_\\-\\s]+$", ErrorMessage = "O Username deve conter apenas letras, números, underscores (_), hífens (-) e espaços, e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? RolesName { get; set; }


        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^[a-zA-Z0-9]{1,255}$", ErrorMessage = "O Badge deve conter apenas letras e números.")]
        public string? Badge { get; set; }



        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,12}$", ErrorMessage = "A senha deve ter entre 6 e 12 caracteres, incluindo pelo menos uma letra e um número," +
            " e não pode ser vazia ou conter apenas espaços em branco")]
        public string? Password { get; set; }


    }
}
