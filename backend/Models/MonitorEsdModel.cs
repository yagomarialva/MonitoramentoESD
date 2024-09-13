using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Security.Policy;

namespace BiometricFaceApi.Models
{

    public class MonitorEsdModel
    {

        public int ID { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(100, ErrorMessage = "O SerialNumber deve ter no máximo 100 caracteres")]
        [RegularExpression("^[a-zA-Z0-9_\\-\\sáéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ/]+$", ErrorMessage = "O campo deve conter apenas letras, números, underscores (_), hífens (-), barras (/), " +
            "espaços e caracteres especiais do português (acentos e cedilha), e não pode ser vazio.")]
        public string? SerialNumber { get; set; }

        [StringLength(20, ErrorMessage = "O Status deve ter no máximo 20 caracteres")]
        [RegularExpression("^[a-zA-Z]+$", ErrorMessage = "O Status deve conter apenas letras")]
        public string? Status { get; set; }


        [StringLength(20, ErrorMessage = "O Status Operador deve ter no máximo 20 caracteres")]
        [RegularExpression("^[a-zA-Z]+$", ErrorMessage = "O Status Operador deve conter apenas letras")]
        public string? StatusOperador { get; set; }

        [StringLength(20, ErrorMessage = "O Status Jig deve ter no máximo 20 caracteres")]
        [RegularExpression("^[a-zA-Z]+$", ErrorMessage = "O Status Operador deve conter apenas letras")]
        public string? StatusJig { get; set; }

        [StringLength(250, ErrorMessage = "O Description deve ter no máximo 250 caracteres")]
        [RegularExpression("^[a-zA-Z0-9_\\-\\sáéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ/]+$", ErrorMessage = "O campo deve conter apenas letras, números, underscores (_), hífens (-), barras (/), " +
            "espaços e caracteres especiais do português (acentos e cedilha), e não pode ser vazio.")]
        public string? Description { get; set; }
        public DateTime DateHour { get; set; }
        public DateTime LastDate { get; set; }
    }
}
