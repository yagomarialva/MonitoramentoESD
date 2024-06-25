using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("StationAtttrib")]
    public class StationAttributeModel
    {
        [Key]
        public int Id {  get; set; }
        [ForeignKey("Station")]
        public int StationId { get; set; }
        public string? Property { get; set; }
        public string? Value { get; set; }
    }
}
