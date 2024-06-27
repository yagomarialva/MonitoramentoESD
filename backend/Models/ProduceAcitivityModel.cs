using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("produceActivity")]
    public class ProduceActivityModel
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("users")]
        public int UserId { get; set; }
        public virtual UserModel? User { get; set; }
        [ForeignKey("bracelets")]
        public int BraceletId{ get; set;}
        public virtual BraceletModel? Bracelet { get; set; }
        [ForeignKey("station")]
        public int StationId { get; set; }
                     
        public virtual StationModel? Station { get; set;}
        [ForeignKey("monitorEsd")]
        public int MonitorEsdId { get; set; }
        public virtual MonitorEsdModel? MonitorEsdEvent { get; set; }   
        public DateTime DatatimeMonitorEsdEvent { get; set; }

    }
}
