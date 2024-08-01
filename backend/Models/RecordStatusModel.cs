using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{
    [Table("recordStatusProduce")]
    public class RecordStatusProduceModel
    {

        public int ID { get; set; }

        [ForeignKey("produceActivity")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O ProduceActivityId deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public int ProduceActivityId { get; set; }
        [IgnoreDataMember]
        public virtual ProduceActivityModel? ProduceActivity { get; set; }

        [ForeignKey("users")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O UserId deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public int UserId { get; set; }
        [IgnoreDataMember]
        public virtual UserModel? User { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(250, ErrorMessage = "O Description deve ter no máximo 250 caracteres")]
        [RegularExpression("^(?!\\s*$).+", ErrorMessage = "O Description deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Description { get; set; }
        public bool? Status { get; set; }
        public DateTime? DateEvent { get; set; }

    }
}
