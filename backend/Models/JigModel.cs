﻿using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{
    [Table ("jig")]
    [Index(nameof(Name), IsUnique = true)]
    public class JigModel
    {
        
        public int ID { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(50, ErrorMessage = "O Name deve ter no máximo 50 caracteres")]
        [RegularExpression("^(?!\\s*$)[a-zA-Z0-9]+$", ErrorMessage = "O Name deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Name { get; set; }


        [StringLength(250, ErrorMessage = "O Description deve ter no máximo 250 caracteres")]
        [RegularExpression("^(?!\\s*$).+", ErrorMessage = "O Description deve conter apenas letras e números e não pode ser vazio ou conter apenas espaços em branco")]
        public string? Description { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
        
    }
}
