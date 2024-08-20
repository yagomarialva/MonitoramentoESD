using System.Diagnostics;
using System.Diagnostics.Eventing.Reader;
using System.Net;
using System.Text.Json;

namespace BiometricFaceApi.Middleware
{
    public class GlobalErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {

                await HandleExceptionAsync(context, exception);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            HttpStatusCode status;
            string stackTrace = String.Empty;
            string mensagem;

            var exceptionType = exception.GetType();

            if (exceptionType == typeof(Exception))
            {
                mensagem = exception.Message;
                status = HttpStatusCode.BadRequest;
                stackTrace = (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIROMMENT") == "Development" ||
                    Environment.GetEnvironmentVariable("ASPNETCORE_ENVIROMMENT") == "Production") ? exception.StackTrace : exception.Message;
            }

            else
            {
                mensagem = exception.Message;
                status = HttpStatusCode.InternalServerError;
                stackTrace = exception.StackTrace;
            }

            var result = JsonSerializer.Serialize(new { status, mensagem, stackTrace });

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)status;
            return context.Response.WriteAsync(result);
        }

    }
}
