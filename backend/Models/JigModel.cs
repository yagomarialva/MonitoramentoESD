using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table ("jig")]
    [Index(nameof(Name), IsUnique = true)]
    public class JigModel
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
        
    }
}
