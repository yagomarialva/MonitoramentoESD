using BiometricFaceApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace BiometricFaceApi.Auth
{
    public class JwtAuthentication
    {
        private readonly IConfiguration configuration;
        public JwtAuthentication(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public string GenerateJSONWebToken()
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["jwt:secretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(configuration["jwt:issuer"],
              configuration["jwt:audience"],
              null,
              expires: DateTime.Now.AddMinutes(120),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
