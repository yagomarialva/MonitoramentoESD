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
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? Badge { get; set; }
        public DateTime Born { get; set; }


    }
}
