FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["BiometricFaceApi.csproj", "./"]
RUN dotnet restore "./BiometricFaceApi.csproj"
COPY . .
# WORKDIR "/src/."
RUN dotnet build "BiometricFaceApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BiometricFaceApi.csproj" -c Release -o /app/publish
# RUN dotnet run "Program.cs"
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BiometricFaceApi.dll"]
# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
# WORKDIR /backend

# # Copy everything
# COPY . ./
# # Restore as distinct layers
# RUN dotnet restore
# # Build and publish a release
# RUN dotnet publish -c Release -o out

# # Build runtime image
# FROM mcr.microsoft.com/dotnet/aspnet:8.0
# WORKDIR /app
# COPY --from=build-env /App/out .
# ENTRYPOINT ["dotnet", "BiometricFaceApi.dll"]