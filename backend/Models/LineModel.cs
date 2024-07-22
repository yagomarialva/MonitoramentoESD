using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiometricFaceApi.Models
{
    [Table("line")]
    public class LineModel
    {
        public int ID { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? Name { get; set; }
       

    }
}
