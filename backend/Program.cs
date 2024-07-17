using BiometricFaceApi.Data;
using Microsoft.EntityFrameworkCore;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Reflection;
using BiometricFaceApi.Security;
using Microsoft.AspNetCore.Identity;
using BiometricFaceApi.Middleware;
using BiometricFaceApi.SwaggerSettings;

namespace BiometricFaceApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var configuration = builder.Configuration;
            var secretKey = configuration["JWT_SECRET_KEY"] ?? "";
            var allowedOrigins = configuration["ALLOWED_ORIGINS"] ?? "http://localhost:3000";
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

            // Adicionar e configurar CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  policy =>
                                  {
                                      policy.WithOrigins(allowedOrigins.Split(","))
                                            .AllowAnyHeader()
                                            .AllowAnyMethod()
                                            .AllowCredentials();
                                  });
            });

            // Configuração do AutoMapper
            builder.Services.AddAutoMapper(typeof(Program));

            // Adicionar serviços ao container.
            builder.Services.AddControllers();
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters =
                        new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = configuration["JWT_ISSUER"],
                            ValidAudience = configuration["JWT_AUDIENCE"],
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
                        };
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Biometric.Backend", Version = "v1" });

                // Remove propriedades virtuais
                c.SchemaFilter<SwaggerSchemaFilter>();

                // Configurações de autenticação JWT
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below. \r\n\r\nExample: 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                });

                // Variável de documentação
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
                c.EnableAnnotations();
            });

            // Connection String
            var connectionString = builder.Configuration.GetConnectionString("MY_CONNECTION_STRING");
            var securityKeyA = builder.Configuration["SECURITY_KEY_A"];
            var securityKeyB = builder.Configuration["SECURITY_KEY_B"];

            if (connectionString is not null)
            {
                builder.Services.AddDbContext<BiometricFaceDBContex>(
                    options => options.UseMySQL(connectionString));

                // Repositórios
                builder.Services.AddScoped<IUsersRepository, UsersRepository>();
                builder.Services.AddScoped<IImageRepository, ImageRepository>();
                builder.Services.AddScoped<IRecordStatusRepository, RecordStatusRepository>();
                builder.Services.AddScoped<IMonitorEsdRepository, MonitorEsdRepository>();
                builder.Services.AddScoped<IProduceActivityRepository, ProduceActivityRepository>();
                builder.Services.AddScoped<IStationRepository, StationRepository>();
                builder.Services.AddScoped<IRolesRepository, RolesRepository>();
                builder.Services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();
                builder.Services.AddSingleton<JwtAuthentication>();
            }

            builder.Services.AddScoped<SecurityService>(ss => new SecurityService(securityKeyA, securityKeyB));

            var app = builder.Build();

            // Configure o pipeline de requisição HTTP.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Biometric.backend v1");
                });
            }

            app.UseMiddleware(typeof(GlobalErrorHandlingMiddleware));
            app.UseCors(MyAllowSpecificOrigins);
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
