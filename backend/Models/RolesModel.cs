﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("roles")]

    public class RolesModel
    {
        
        public int ID { get; set; }
        [Required]
        public string? RolesName { get; set; }
    }
}
