using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{

    public class ProduceActivityModel
    {

        public int ID { get; set; }

       
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O UserId deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public int UserId { get; set; }
        [IgnoreDataMember]
        public virtual UserModel? User { get; set; }

      
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O JigId deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public int JigId { get; set; }
        [IgnoreDataMember]
        public virtual JigModel? Jig { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O MonitorEsdId deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public int MonitorEsdId { get; set; }
        [IgnoreDataMember]
        public virtual MonitorEsdModel? MonitorEsd { get; set; }

        
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O StationId deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public int LinkStationAnLineID { get; set; }
        [IgnoreDataMember]
        public virtual LinkStationAndLineModel? LinkStationAndLine { get; set; }

        public bool IsLocked { get; set; }


        [StringLength(250, ErrorMessage = "O Description deve ter no máximo 250 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9_\\-\\sáéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ]+$", ErrorMessage = "O Name deve conter apenas letras, números, underscores (_), hífens (-), espaços e caracteres especiais do português (acentos e cedilha), e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Description { get; set; }
        public DateTime? DataTimeMonitorEsdEvent { get; set; }


    }
}
