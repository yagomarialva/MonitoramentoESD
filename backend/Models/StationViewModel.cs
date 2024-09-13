using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Xml.Linq;

namespace BiometricFaceApi.Models
{

    public class StationViewModel
    {
        public int ID { get; set; }
        public int MonitorEsdId { get; set; }
        [IgnoreDataMember]
        public virtual MonitorEsdModel? MonitorEsd { get; set; }
        public int LinkStationAndLineId { get; set; }
        [IgnoreDataMember]
        public virtual LinkStationAndLineModel? LinkStationAndLine { get; set; }
        public int PositionSequence { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
