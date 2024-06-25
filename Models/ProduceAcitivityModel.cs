using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("ProduceActivity")]
    public class ProduceActivityModel
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Users")]
        public int UserId { get; set; }
        public virtual UserModel? User { get; set; }
        [ForeignKey("Bracelets")]
        public int BraceletId{ get; set;}
        public virtual BraceletModel? Bracelet { get; set; }
        [ForeignKey("Station")]
        public int StationId { get; set; }
        public virtual StationModel? Station { get; set;}
        [ForeignKey("MonitorEsd")]
        public int MonitorEsdId { get; set; }
        public virtual MonitorEsdModel? Event { get; set; }   
        public DateTime DatatimeEvent { get; set; }

    }
}
