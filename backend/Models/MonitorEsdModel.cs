using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("monitorEsd")]
    [Index(nameof(SerialNumber), IsUnique = true)]
    public class MonitorEsdModel
    {
        [Key]
        public int Id { get; set; }
        public string? SerialNumber { get; set; }
        public string? Description { get; set; }
       

    }
}
