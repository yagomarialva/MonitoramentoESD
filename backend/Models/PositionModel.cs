using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table ("position")]
    public class PositionModel
    {
        public int ID  { get; set; }
        public int SizeX { get; set; }
        public int SizeY { get; set; }
    }
}
