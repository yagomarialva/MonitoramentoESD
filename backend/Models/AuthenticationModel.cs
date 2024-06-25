using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BiometricFaceApi.Models
{
    [Table("Auths")]
    [Index(nameof(Badge), IsUnique = true)]
    public class AuthenticationModel
    {
        [Key]
        public int Id { get; set; }
        public string? Login { get; set; }
        public string? Badge { get; set; }
        public string? Password { get; set; }

    }
}
