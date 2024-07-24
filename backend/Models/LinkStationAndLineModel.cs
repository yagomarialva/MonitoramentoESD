using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("linkStationAndLine")]
    public class LinkStationAndLineModel
    {
        public int ID { get; set; }
        [ForeignKey("line")]
        public int LineID { get; set; }
        public virtual LineModel? Line { get; set; }
        [ForeignKey("station")]
        public int StationID { get; set; }
        public virtual StationModel? Station { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
