﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("ProduceDetails")]
    public class ActivityDetailsModel
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey ("ProduceActivity")]
        public int ProduceActivityId { get; set; }
        public virtual ProduceActivityModel ProduceActivity { get; set; }
        public string? Description { get; set;}
    }
}
