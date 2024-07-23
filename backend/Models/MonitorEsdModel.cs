using Microsoft.EntityFrameworkCore;
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
        [ForeignKey("users")]
        public int UserId { get; set; }
        [IgnoreDataMember]
        public virtual UserModel? User { get; set; }
        public string? SerialNumber { get; set; }

        [ForeignKey("position")]
        public int PositionId { get; set; }
        [IgnoreDataMember]
        public virtual PositionModel? Position { get; set; }
        public int PositionSequence { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }
        public DateTime DateHour { get; set; } 
        public DateTime LastDate { get; set; }
    }
}
