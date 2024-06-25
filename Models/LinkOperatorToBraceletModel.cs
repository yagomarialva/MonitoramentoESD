using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("LinkOperatorToBracelet")]
    public class LinkOperatorToBraceletModel
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Users")]
        public int UserId { get; set; }
        public virtual UserModel? User { get; set; }
        [ForeignKey("Bracelets")]
        public int BraceletId { get; set; }
        public virtual BraceletModel? Bracelet { get; set; }
        public DateTime DatatimeEvent { get; set; }

    }
}
