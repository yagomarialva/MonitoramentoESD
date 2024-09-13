using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BiometricFaceApi.Models
{

    public class ImageModel
    {
        public int ID { get; set; }

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

