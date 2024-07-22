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
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int UserId { get; set; }
        [IgnoreDataMember]
        public virtual UserModel? User { get; set; }

        [ForeignKey("jig")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int JigId { get; set; }
        [IgnoreDataMember]
        public virtual JigModel? Jig { get; set; }
        
        [ForeignKey("monitorEsd")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int MonitorEsdId { get; set; }
        [IgnoreDataMember]
        public virtual MonitorEsdModel? MonitorEsd { get; set; }

        [ForeignKey("station")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int StationId { get; set; }
        [IgnoreDataMember]
        public virtual StationModel? Station { get; set; }

        public bool IsLocked { get; set; }
        public string? Description { get; set; }
        public DateTime? DataTimeMonitorEsdEvent { get; set; }

    }
}
