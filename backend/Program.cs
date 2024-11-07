using BiometricFaceApi.Auth;
using BiometricFaceApi.Data;
using BiometricFaceApi.Hubs;
using BiometricFaceApi.Middleware;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Security;
using BiometricFaceApi.Services;
using BiometricFaceApi.SqlInterceptor;
using BiometricFaceApi.SwaggerSettings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;



namespace BiometricFaceApi
{
    public class Program
    {

        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var configuration = builder.Configuration;
            var secretKey = configuration["jwt:secretKey"] ?? "";


            var root = Directory.GetCurrentDirectory();
            var dotenv = Path.Combine(root, ".env");
            DotEnv.Load(dotenv);

            // Carrega o valor de DB_HOST
            var oracleHost = Environment.GetEnvironmentVariable("DB_HOST");

            var config =
            new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .Build();

            // Carrega as vari�veis de ambiente do arquivo .env
            DotEnv.Load(dotenv);  // Certifique-se de que este m�todo est� dispon�vel

            // Pega o valor das vari�veis de ambiente e exibe no console
            // var oraclePort = Environment.GetEnvironmentVariable("ORACLE_PORT");
            // var oracleService = Environment.GetEnvironmentVariable("ORACLE_SERVICE");

            Console.WriteLine($"ORACLE_HOST: {oracleHost}");
            // Console.WriteLine($"ORACLE_PORT: {oraclePort}");
            // Console.WriteLine($"ORACLE_SERVICE: {oracleService}");
            // Configura??o do AutoMapper
            builder.Services.AddAutoMapper(typeof(Program));

            // Add services to the container.
            builder.Services.AddControllers();

            // Adicionar e configurar CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigins", policy =>
                     policy
                         .WithOrigins("http://localhost:3000", "http://${oracleHost}:3000", "http://*:3000") // adicione quantas origens precisar
                         .AllowAnyHeader()
                         .AllowAnyMethod()
                         .AllowCredentials());
            });

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

                // Jwt Authorization settings
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

                // Documentation variable
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
                c.EnableAnnotations();
            });

            // Connection String
            var connectionString = builder.Configuration.GetConnectionString("ora");
            var securityKeyA = builder.Configuration["security:key"];
            var securityKeyB = builder.Configuration["security:iv"];
            if (connectionString is not null)
            {
                // Repositores
                builder.Services.AddDbContext<BiometricFaceDBContex>(opt => opt.UseOracle(connectionString, oraOptions => oraOptions.UseOracleSQLCompatibility("11")).
                AddInterceptors(new QueryCommandInterceptor()));
                builder.Services.AddSingleton<IOracleDataAccessRepository, OracleDataAccessRepository>(ora => new OracleDataAccessRepository(connectionString));
                builder.Services.AddScoped<IUsersRepository, UsersRepository>();
                builder.Services.AddScoped<IImageRepository, ImageRepository>();
                builder.Services.AddScoped<IRecordStatusRepository, RecordStatusRepository>();
                builder.Services.AddScoped<IMonitorEsdRepository, MonitorEsdRepository>();
                builder.Services.AddScoped<IProduceActivityRepository, ProduceActivityRepository>();
                builder.Services.AddScoped<IJigRepository, JigRepository>();
                builder.Services.AddScoped<IRolesRepository, RolesRepository>();
                builder.Services.AddScoped<IStationRepository, StationRepository>();
                builder.Services.AddScoped<IStationViewRepository, StationViewRepository>();
                builder.Services.AddScoped<ILineRepository, LineRepository>();
                builder.Services.AddScoped<ILinkStationAndLineRepository, LinkStationAndLineRepository>();
                builder.Services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();
                builder.Services.AddScoped<ILogMonitorEsdRepository, LogMonitorEsdRepository>();
                builder.Services.AddSingleton<JwtAuthentication>();
                builder.Services.AddScoped<UserService>();
                builder.Services.AddScoped<ImageService>();
                builder.Services.AddScoped<BiometricService>();
                builder.Services.AddScoped<RecordStatusService>();
                builder.Services.AddScoped<AuthenticationService>();
                builder.Services.AddScoped<JigService>();
                builder.Services.AddScoped<LineService>();
                builder.Services.AddScoped<LinkStationAndLineService>();
                builder.Services.AddScoped<StationService>();
                builder.Services.AddScoped<IDbInitializerRepository>(provider =>
                {
                    var oracleRepo = provider.GetRequiredService<IOracleDataAccessRepository>();
                    var securityService = provider.GetRequiredService<SecurityService>();
                    var dbContex = provider.GetService<BiometricFaceDBContex>();

                    return new DbInitializerRepository(oracleRepo, securityService, dbContex, builder.Configuration);
                });
                builder.Services.AddSignalR();

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
            app.UseCors("AllowSpecificOrigins");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            // Mapeie o hub
            app.MapHub<CommunicationHub>("/loghub");

            // Cria??o do usu?rio administrador padr?o
            using (var scope = app.Services.CreateScope()) // Cria um escopo
            {
                var scopedServices = scope.ServiceProvider;
                var dbInitializer = scopedServices.GetRequiredService<IDbInitializerRepository>();
                await dbInitializer.InitializeAsync();


            }

            await app.RunAsync();
        }
    }
}