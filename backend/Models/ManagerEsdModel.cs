using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    public class ManagerEsdModel
    {
        public int? Id { get; set; }
        public string? NameUser { get; set; }
        public string? Badge { get; set; }
        public string? Property { get; set; }
        public string? Value { get; set; }
        public string? Sn { get; set; }
        public string? NameMonitor { get; set; }
        public string? Descrition { get; set; }
        public string? NameStation { get; set; }
        public string? Produce { get; set; }

    }
}
