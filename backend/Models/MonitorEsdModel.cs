﻿using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{
    [Table("monitorEsd")]
    [Index(nameof(SerialNumber), IsUnique = true)]
    public class MonitorEsdModel
    {
       
        public int ID{ get; set; }
        public string? SerialNumber { get; set; }

       
      
        public string? Status { get; set; }
        public string? Description { get; set; }
        public DateTime DateHour { get; set; } 
        public DateTime LastDate { get; set; }
    }
}
