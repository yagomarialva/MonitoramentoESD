using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("BraceletsAtrribute")]
    [Index(nameof(Property), IsUnique = true)]
    public class BraceletAttributeModel
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Bracelets")]
        public int BraceletId { get; set; }
        public virtual BraceletModel? Bracelet { get; set; }
        public string? Property { get; set; }
        public string? Value { get; set; }
    }
}
