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
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int ProduceActivityId { get; set; }
        [IgnoreDataMember]
        public virtual ProduceActivityModel? ProduceActivity { get; set; }

        [ForeignKey("users")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public int UserId { get; set; }
        [IgnoreDataMember]
        public virtual UserModel? User { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? Description { get; set; }
        public bool? Status { get; set; }
        public DateTime? DateEvent { get; set; }
        
    }
}
