using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Xml.Linq;

namespace BiometricFaceApi.Models
{
    [Table("lineView")]
    public class LineViewModel
    {
        public int Id { get; set; }
        [ForeignKey("lineProduction")]
        public int LineId { get; set; }
        [IgnoreDataMember]
        public virtual LineProductionModel? LineProduction { get; set; }
        [ForeignKey("jig")]
        public int JigId { get; set; }
        [IgnoreDataMember]
        public virtual JigModel? JigsModel { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
