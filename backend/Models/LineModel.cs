using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("line")]
    [Index(nameof(Name), IsUnique = true)]
    public class LineModel
    {
        public int ID { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O Name deve ter no máximo 50 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9_\\-\\s]+$", ErrorMessage = "O Name deve conter apenas letras, números, underscores (_), hífens (-) e espaços, e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Name { get; set; }
       

    }
}
