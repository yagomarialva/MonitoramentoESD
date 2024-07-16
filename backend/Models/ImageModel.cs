using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BiometricFaceApi.Models
{
    [Table("images")]
    public class ImageModel
    {
        [Key]
        public int IdImage { get; set; }
        [ForeignKey("users")]
        public int UserId { get; set; }
        public virtual UserModel? User { get; set; }
        [IgnoreDataMember, NotMapped]
        public IFormFile ImageFile
        {
            get
            {
                return this.ObservableImageFile;
            }
            set
            {
                this.ObservableImageFile = value;
                if (this.ObservableImageFile is not null && this.ObservableImageFile.Length > 0)
                {
                    using (var filestream = new MemoryStream())
                    {
                        this.ImageFile.OpenReadStream().CopyTo(filestream);
                        this.PictureStream = filestream.ToArray();

                    }
                }
            }
        }
        [IgnoreDataMember, NotMapped]
        private IFormFile? ObservableImageFile { get; set; }

        public byte[]? PictureStream { get; set; }
       
        //converte imagem pra string
        public string GetPictureToBase()
        {
            try
            {
                return Convert.ToBase64String(PictureStream);
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}

