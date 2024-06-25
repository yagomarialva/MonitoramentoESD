using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("Bracelets")]
    public class BraceletModel
    {
        [Key]
        public int Id { get; set; }
        public string? Sn { get; set; }
       

    }
}
