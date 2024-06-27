using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("braceletsAtrribute")]
    [Index(nameof(Property), IsUnique = true)]
    public class BraceletAttributeModel
    {
        [Key]
        public int AttributeId { get; set; }
        [ForeignKey("bracelets")]
        public int BraceletId { get; set; }
        public virtual BraceletModel? Bracelet { get; set; }
        public string? Property { get; set; }
        public string? Value { get; set; }
    }
}
