using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{
    [Table("monitorEsd")]
    [Index(nameof(SerialNumber), IsUnique = true)]
    public class MonitorEsdModel
    {
       
        public int ID{ get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(100, ErrorMessage = "O SerialNumber deve ter no máximo 100 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9_\\-\\s]+$", ErrorMessage = "O SerialNumber deve conter apenas letras, números, underscores (_), hífens (-) e espaços, e não pode ser vazio ou conter apenas espaços em branco")]
        public string? SerialNumber { get; set; }


        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? Status { get; set; }

        [StringLength(250, ErrorMessage = "O Description deve ter no máximo 250 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9_\\-\\s]+$", ErrorMessage = "O Description deve conter apenas letras, números, underscores (_), hífens (-) e espaços, e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Description { get; set; }
        public DateTime DateHour { get; set; } 
        public DateTime LastDate { get; set; }
    }
}
