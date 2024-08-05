using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Xml.Linq;

namespace BiometricFaceApi.Models
{
    [Table("stationView")]
    [Index(nameof(MonitorEsdId), IsUnique = true)]
    public class StationViewModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid ID { get; set; }
        [ForeignKey("MonitorEsd")]
        public int MonitorEsdId { get; set; }
        [IgnoreDataMember]
        public virtual MonitorEsdModel? MonitorEsd { get; set; }

        [ForeignKey("LinkStationAndLine")]
        public int LinkStationAndLineId { get; set; }
        [IgnoreDataMember]
        public virtual LinkStationAndLineModel? LinkStationAndLine { get; set; }

        [IgnoreDataMember]
        public int PositionSequence { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
