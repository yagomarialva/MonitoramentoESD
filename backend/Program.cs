using BiometricFaceApi.Data;
using Microsoft.EntityFrameworkCore;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Auth;
using System.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Reflection;
using BiometricFaceApi.Security;
using static Org.BouncyCastle.Math.EC.ECCurve;
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
            var secretKey = configuration["jwt:secretKey"] ?? "";

            // Configuração do AutoMapper
            builder.Services.AddAutoMapper(typeof(Program));
            // Add services to the container.
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
                    ValidIssuer = configuration["jwt:issuer"],
                    ValidAudience = configuration["jwt:audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(secretKey))
                };
                });
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {

                c.SwaggerDoc("v1",
                    new OpenApiInfo
                    {
                        Title = "Biometric.Backend",
                        Version = "v1"
                    });

                //remove virtual properties
                c.SchemaFilter<SwaggerSchemaFilter>();
                // Jwt Autorization settings 
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description =
                      @"JWT Authorization header using the Bearer scheme. \r\n\r\n  Enter 'Bearer'
                        [space] and then your token in the text input below.
                        \r\n\r\nExample : 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {new OpenApiSecurityScheme
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

                // Documetation variable

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
                c.EnableAnnotations();
            });

            // Connection String
            var connectionString = builder.Configuration.GetConnectionString("my");
            var securityKeyA = builder.Configuration["security:key"];
            var securityKeyB = builder.Configuration["security:iv"];
            if (connectionString is not null)
            {
                builder.Services.AddDbContext<BiometricFaceDBContex>(
                    options => { options.UseMySQL(connectionString); });

                // Repositores
                builder.Services.AddScoped<IUsersRepository, UsersRepository>();
                builder.Services.AddScoped<IImageRepository, ImageRepository>();
                builder.Services.AddScoped<IRecordStatusRepository, RecordStatusRepository>();
                builder.Services.AddScoped<IMonitorEsdRepository, MonitorEsdRepository>();
                builder.Services.AddScoped<IProduceActivityRepository, ProduceActivityRepository>();
                builder.Services.AddScoped<IJigRepository, JigRepository>();
                builder.Services.AddScoped<IRolesRepository, RolesRepository>();
                builder.Services.AddScoped<ILineProductionRepository, LineProductionRepository>();
                builder.Services.AddScoped<ILineViewRepository, LineViewRepository>();


                builder.Services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();
                builder.Services.AddSingleton<JwtAuthentication>();
            }
            builder.Services.AddScoped<SecurityService>(ss => new SecurityService(securityKeyA, securityKeyB));
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json",
                        "Biometric.backend v1");
                });
            }

            app.UseMiddleware(typeof(GlobalErrorHandlingMiddleware));
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
