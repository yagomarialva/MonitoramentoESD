using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Xml.Linq;

namespace BiometricFaceApi.Models
{

    public class StationModel
    {
        public int ID { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O Username deve ter no máximo 50 caracteres")]
        [RegularExpression("^[a-zA-Z0-9_\\-\\sáéíóúãõâêîôûçÁÉÍÓÚÃÕÂÊÎÔÛÇ/]+$", ErrorMessage = "O campo deve conter apenas letras, números, underscores (_), hífens (-), barras (/), " +
            "espaços e caracteres especiais do português (acentos e cedilha), e não pode ser vazio.")]
        public string? Name { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "O dimensional minimo valido é 1")]
        public int SizeX { get; set; }
        [Range(1,int.MaxValue, ErrorMessage = "O dimensional minimo valido é 1")]
        public int SizeY { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}
