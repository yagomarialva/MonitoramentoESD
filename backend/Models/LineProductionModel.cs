using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Xml.Linq;

namespace BiometricFaceApi.Models
{
    [Table("lineProduction")]
    [Index(nameof(Name), IsUnique = true)]
    public class LineProductionModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int ProduceActivityId { get; set; }
        [IgnoreDataMember]
        public virtual ProduceActivityModel? ProduceActivity { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}
