using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Xml.Linq;

namespace BiometricFaceApi.Models
{
    [Table("stationView")]
    public class StationViewModel
    {
        public int Id { get; set; }
        [ForeignKey("jig")]
        public int JigId { get; set; }
        [IgnoreDataMember]
        public virtual JigModel? Jig { get; set; }
        [ForeignKey("station")]
        public int StationId { get; set; }
        [IgnoreDataMember]
        public virtual StationModel? Station { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
