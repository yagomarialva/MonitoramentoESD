﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Xml.Linq;

namespace BiometricFaceApi.Models
{
    [Table("station")]
    [Index(nameof(Name), IsUnique = true)]
    public class StationModel
    {
        public int ID { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O Username deve ter no máximo 50 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O Name deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Name { get; set; }
        [Range(1.0,double.MaxValue,ErrorMessage = "O dimensional minimo valido é 1")]
        public int SizeX { get; set; }
        [Range(1.0, double.MaxValue, ErrorMessage = "O dimensional minimo valido é 1")]
        public int SizeY { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}
