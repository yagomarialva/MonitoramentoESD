using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{
    [Table("produceActivity")]
    public class ProduceActivityModel
    {
        [Key]
        public int ID { get; set; }
       
        [ForeignKey("users")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O UserId deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public int UserId { get; set; }
        [IgnoreDataMember]
        public virtual UserModel? User { get; set; }

        [ForeignKey("jig")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O JigId deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public int JigId { get; set; }
        [IgnoreDataMember]
        public virtual JigModel? Jig { get; set; }
        
        [ForeignKey("monitorEsd")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O MonitorEsdId deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public int MonitorEsdId { get; set; }
        [IgnoreDataMember]
        public virtual MonitorEsdModel? MonitorEsd { get; set; }

        [ForeignKey("station")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O StationId deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public int StationId { get; set; }
        [IgnoreDataMember]
        public virtual StationModel? Station { get; set; }

        public bool IsLocked { get; set; }

       
        [StringLength(250, ErrorMessage = "O Description deve ter no máximo 250 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9_\\-\\s]+$", ErrorMessage = "O Description deve conter apenas letras, números, underscores (_), hífens (-) e espaços, e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Description { get; set; }
        public DateTime? DataTimeMonitorEsdEvent { get; set; }

    }
}
