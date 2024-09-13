using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{

    public class LineModel
    {
        public int ID { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O Name deve ter no máximo 50 caracteres")]
        [RegularExpression("^[a-zA-Z0-9_\\-\\sáéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ/]+$", ErrorMessage = "O campo deve conter apenas letras, números, underscores (_), hífens (-), barras (/), " +
            "espaços e caracteres especiais do português (acentos e cedilha), e não pode ser vazio.")]
        public string? Name { get; set; }


    }
}
