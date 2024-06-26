using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("monitorEsd")]
    public class MonitorEsdModel
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Descrition { get; set; }
       

    }
}
