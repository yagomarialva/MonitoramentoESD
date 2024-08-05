using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BiometricFaceApi.Models
{
    [Table("linkStationAndLine")]
    public class LinkStationAndLineModel
    {
        public int ID { get; set; }
        public int Order {  get; set; }
        [ForeignKey("line")]
        public int LineID { get; set; }
        [IgnoreDataMember]
        public virtual LineModel? Line { get; set; }
        [ForeignKey("station")]
        public int StationID { get; set; }
        [IgnoreDataMember]
        public virtual StationModel? Station { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
