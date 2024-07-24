using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{
    [Table ("jig")]
    [Index(nameof(Name), IsUnique = true)]
    public class JigModel
    {
        
        public int ID { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        [ForeignKey("position")]
        public int PositionID { get; set; }
        [IgnoreDataMember]
        public virtual PositionModel? Position { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
        
    }
}
