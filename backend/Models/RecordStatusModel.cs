using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{
    [Table("recordStatusProduce")]
    public class RecordStatusProduceModel
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("produceActivity")]
        public int ProduceActivityId { get; set; }
        [IgnoreDataMember]
        public virtual ProduceActivityModel? ProduceActivity { get; set; }

        [ForeignKey("users")]
        public int UserId { get; set; }
        [IgnoreDataMember]
        public virtual UserModel? User { get; set; }
        public string? Description { get; set; }
        public DateTime? DateEvent { get; set; }
    }
}
