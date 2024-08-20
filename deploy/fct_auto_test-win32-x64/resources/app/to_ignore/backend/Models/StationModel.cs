using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Xml.Linq;

namespace BiometricFaceApi.Models
{
    [Table("station")]
    public class StationModel
    {
        public int ID { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? Name { get; set; }
        [ForeignKey("line")]
        public int LineID { get; set; }
        [IgnoreDataMember]
        public virtual LineModel? Line { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}
