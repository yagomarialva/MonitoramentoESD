using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{
    [Table("produceActivity")]
    public class ProduceActivityModel
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("users")]
        public int UserId { get; set; }
        //[ForeignKey("users")]
        //public string? UserName { get; set; }
        [IgnoreDataMember]
        public virtual UserModel? User { get; set; }
        
        [ForeignKey("jig")] 
        public int JigId { get; set; }
        [IgnoreDataMember]
        public virtual JigModel? Jig { get; set; }

        [ForeignKey("monitorEsd")]
        public int MonitorEsdId { get; set; }
        [IgnoreDataMember]
        public virtual MonitorEsdModel? MonitorEsd { get; set; }
        
        public bool IsLocked { get; set; }
        public string? Description { get; set; }
        public DateTime? DataTimeMonitorEsdEvent { get; set; }

    }
}
