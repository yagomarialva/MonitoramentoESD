using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("linkOperatorToBracelet")]
    public class LinkOperatorToBraceletModel
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("users")]
        public int UserId { get; set; }
        public virtual UserModel? User { get; set; }
        [ForeignKey("bracelets")]
        public int BraceletId { get; set; }
        public virtual BraceletModel? Bracelet { get; set; }
        public DateTime DatatimeEvent { get; set; }

    }
}
