using BiometricFaceApi.Models;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using System.Text.Json;

namespace BiometricFaceApi.Services
{
    public class BiometricService
    {
        private readonly UserService _userService;
        private readonly ImageService _imageService;
        private readonly JigService _jigService;
        public BiometricService(UserService userService, ImageService imageService, JigService jigService)
        {
            _userService = userService;
            _imageService = imageService;
            _jigService = jigService;
        }
        // Gerenciar operadores (atualizar ou inserir)
        public async Task<(object?, int)> ManageOperatorAsync(BiometricModel biometric)
        {
            try
            {
                var user = new UserModel { ID = biometric.ID, Badge = biometric.Badge, Name = biometric.Name };
                var image = new ImageModel { ImageFile = biometric.Image };

                var existingUser = await _userService.GetUserByBadgeAsync(user.Badge);

                if (existingUser != null)
                {
                    return await UpdateExistingOperatorAsync(existingUser, user, image, biometric);
                }
                else
                {
                    return await InsertNewOperatorAsync(user, image, biometric);
                }
            }
            catch (Exception ex)
            {
                // Lidar com exceções, logar se necessário
                return (ex.Message, StatusCodes.Status400BadRequest);
            }
        }
        private async Task<(object?, int)> UpdateExistingOperatorAsync(UserModel existingUser, UserModel user, ImageModel image, BiometricModel biometric)
        {
            image.UserId = existingUser.ID;

            var existingImage = await _imageService.GetImageByUserIdAsync(existingUser.ID);

            // Atualizar usuário e imagem existente
            await _userService.UpdateUserAsync(user, existingUser.ID);
            if (existingImage == null)
            {
                await _imageService.AddImageAsync(image);
            }
            else if (image.PictureStream != null)
            {
                await _imageService.UpdateImageAsync(image);
            }

            var updatedBiometric = new BiometricModel
            {
                ID = existingUser.ID,
                Badge = biometric.Badge,
                Name = biometric.Name,
                Stream = image.PictureStream
            };

            return (updatedBiometric, StatusCodes.Status200OK);
        }
        private async Task<(object?, int)> InsertNewOperatorAsync(UserModel user, ImageModel image, BiometricModel biometric)
        {
            var newUser = await _userService.AddUserAsync(user);
            if (newUser != null)
            {
                image.UserId = newUser.ID;
                await _imageService.AddImageAsync(image);

                var newBiometric = new BiometricModel
                {
                    ID = newUser.ID,
                    Badge = biometric.Badge,
                    Name = biometric.Name,
                    Stream = image.PictureStream
                };

                return (newBiometric, StatusCodes.Status201Created);
            }
            else
            {
                return ("Dados incorretos ou inválidos.", StatusCodes.Status404NotFound);
            }
        }
        // Operador de pesquisa por ID
        public async Task<BiometricModel> GetUserByIdAsync(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException("Usuário não encontrado");

            var image = await _imageService.GetImageByUserIdAsync(user.ID);
            return new BiometricModel
            {
                ID = user.ID,
                Name = user.Name,
                Badge = user.Badge,
                Stream = image?.PictureStream
            };
        }
        public async Task<(object?, int)> GetUsersPaginatedAsync(int page, int pageSize)
        {
            var users = await _userService.GetListUsersAsync(page, pageSize); // Obtenha os usuários paginados
            var userBiometrics = new List<BiometricModel>();

            foreach (var user in users)
            {
                var image = await _imageService.GetImageByUserIdAsync(user.ID);
                var biometricModel = new BiometricModel
                {
                    ID = user.ID,
                    Name = user.Name,
                    Badge = user.Badge,
                    Stream = image?.PictureStream
                };

                userBiometrics.Add(biometricModel);
            }

            var totalRecords = await _userService.GetTotalUsers(); // Total de registros para a paginação
            return (new
            {
                Users = userBiometrics,
                TotalRecords = totalRecords,
                Page = page,
                PageSize = pageSize
            }
            , StatusCodes.Status200OK);
        }
        // Buscar todos os operadores com imagem
        public async Task<(object?, int)> GetAllUsersImageAsync(int page, int pageSize)
        {
            try
            {
                var users = await _userService.GetListUsersAsync(page, pageSize);
                var images = await _imageService.GetListImagesAsync(page, pageSize); // Paginação separada para ambos

                var biometrics = users.Select(user =>
                {
                    var image = images.Find(img => img.UserId == user.ID);
                    return new BiometricModel
                    {
                        ID = user.ID,
                        Badge = user.Badge,
                        Name = user.Name,
                        Stream = image?.PictureStream
                    };
                }).ToList();

                if (!biometrics.Any())
                {
                    return ("Nenhum usuário cadastrado!", StatusCodes.Status404NotFound);
                }

                var totalRecords = await _userService.GetTotalUsers(); // Total de registros para a paginação
                return (new
                {
                    Users = biometrics,
                    TotalRecords = totalRecords,
                    Page = page,
                    PageSize = pageSize
                }
                , StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                return ($"Erro ao buscar dados: {ex.Message}", StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> GetAllUsersNoImageAsync(int page, int pageSize)
        {
            try
            {
                var users = await _userService.GetListUsersAsync(page, pageSize);

                var biometrics = users.Select(user => new BiometricModel
                {
                    ID = user.ID,
                    Badge = user.Badge,
                    Name = user.Name
                }).ToList();

                if (!biometrics.Any())
                {
                    return ("Nenhum usuário cadastrado!", StatusCodes.Status404NotFound);
                }

                var totalRecords = await _userService.GetTotalUsers(); // Total de registros para a paginação
                return (new
                {
                    Users = biometrics,
                    TotalRecords = totalRecords,
                    Page = page,
                    PageSize = pageSize
                }
                , StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                return ($"Erro ao buscar dados: {ex.Message}", StatusCodes.Status400BadRequest);
            }
        }
        // Buscar operador pela matrícula
        public async Task<BiometricModel> GetUserByBadgeAsync(string badge)
        {
            var user = await _userService.GetUserByBadgeAsync(badge);
            if (user == null)
                throw new KeyNotFoundException("Usuário não encontrado.");

            var image = await _imageService.GetImageByUserIdAsync(user.ID);
            return new BiometricModel
            {
                ID = user.ID,
                Name = user.Name,
                Badge = user.Badge,
                Stream = image?.PictureStream
            };
        }
        // Deletar operador por ID
        public async Task<(object?, int)> DeleteUserByIdAsync(int userId)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                    return ("Usuário não encontrado.", StatusCodes.Status404NotFound);

                var image = await _imageService.GetImageByUserIdAsync(userId);
                if (image != null)
                    await _imageService.DeleteImageAsync(image.ID);

                await _userService.DeleteUserAsync(user.ID);

                return (new { ID = user.ID, Name = user.Name, Badge = user.Badge }, StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                return ($"Erro ao excluir o usuário: {ex.Message}", StatusCodes.Status400BadRequest);
            }
        }

        public async Task<(object? photo, int personId, JigModel? jig)> Verify(IFormFile imageFile, string serial)
        {
            // Verifica se o Jig existe no banco de dados
            var jig = await _jigService.GetSerialNumberAsync(serial);

            if (jig == null)
            {
                return (null, 0, null); // Se não encontrar o jig, retorna nulo e 0
            }

            // Converte o arquivo da imagem para stream
            byte[] imageData;
            using (var memoryStream = new MemoryStream())
            {
                await imageFile.CopyToAsync(memoryStream);
                imageData = memoryStream.ToArray();
            }

            HttpClient client = new HttpClient();
            var url = "http://example.com/ffdfffd/fdf"; // Altere para a URL correta

            using (var content = new MultipartFormDataContent())
            {
                // Cria o ByteArrayContent a partir da imagem
                var fotoContent = new ByteArrayContent(imageData);
                fotoContent.Headers.ContentType = MediaTypeHeaderValue.Parse("image/jpeg"); // Altere o tipo de mídia conforme necessário

                // Adiciona o conteúdo da foto ao formulário
                content.Add(fotoContent, "foto", imageFile.FileName); // O terceiro parâmetro é o nome do arquivo
                content.Add(new StringContent(serial), "serial");

                // Envia a requisição POST
                var response = await client.PostAsync(url, content);

                // Verifica a resposta
                if (response.IsSuccessStatusCode)
                {
                    var responseData = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Resposta: " + responseData);

                    // Aqui você pode fazer o processamento da resposta da API de reconhecimento facial
                    // Exemplo (ajuste conforme a estrutura da resposta):
                    var personId = ExtractPersonId(responseData); // Método fictício para extrair ID da pessoa da resposta
                    var photo = ExtractPhoto(responseData);       // Método fictício para extrair a foto processada

                    // Retorna a foto e o ID da pessoa reconhecida
                    return (photo, personId, jig);
                }
                else
                {
                    Console.WriteLine($"Erro ao enviar a foto: {response.StatusCode}");
                }
            }

            return (null, 0, jig); // Retorne nulo e 0 se não houver foto ou se não encontrar a pessoa
        }

        // Método fictício para extrair o ID da pessoa da resposta da API
        private int ExtractPersonId(string responseData)
        {
            try
            {
                // Converte a string JSON para um objeto JsonDocument
                using (JsonDocument doc = JsonDocument.Parse(responseData))
                {
                    // Navega até o valor de "personId"
                    var root = doc.RootElement;
                    var personId = root.GetProperty("data").GetProperty("personId").GetInt32();
                    return personId;
                }
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Erro ao processar JSON: {ex.Message}");
                return 0; // Retorna 0 caso não consiga extrair o personId
            }
        }

        // Método fictício para extrair a foto da resposta da API
        private object ExtractPhoto(string responseData)
        {
            try
            {
                // Converte a string JSON para um objeto JObject
                JObject jsonResponse = JObject.Parse(responseData);

                // Acessa o valor da propriedade "photo" dentro de "data"
                string photoBase64 = (string)jsonResponse["data"]["photo"];

                // Decodifica a string base64 em um array de bytes
                byte[] photoBytes = Convert.FromBase64String(photoBase64);

                // Retorna os bytes da foto
                return photoBytes; // Retorna os bytes da foto
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Erro ao processar JSON: {ex.Message}");
                return null; // Retorna null caso não consiga extrair a foto
            }
        }
    }
}
