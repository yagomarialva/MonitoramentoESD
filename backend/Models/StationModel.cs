using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table ("station")]
    public class StationModel
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        
    }
}
