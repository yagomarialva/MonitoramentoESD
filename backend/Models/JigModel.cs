using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{

    public class JigModel
    {

        public int ID { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression("^[a-zA-Z0-9_\\-\\sáéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ/]+$", ErrorMessage = "O campo deve conter apenas letras, números, underscores (_), hífens (-), barras (/), " +
            "espaços e caracteres especiais do português (acentos e cedilha), e não pode ser vazio.")]
        public string? Name { get; set; }

        [StringLength(250, ErrorMessage = "O Description deve ter no máximo 250 caracteres")]
        [RegularExpression("^[a-zA-Z0-9_\\-\\sáéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ/]+$", ErrorMessage = "O campo deve conter apenas letras, números, underscores (_), hífens (-), barras (/), " +
            "espaços e caracteres especiais do português (acentos e cedilha), e não pode ser vazio.")]
        public string? Description { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}
