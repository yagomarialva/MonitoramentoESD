# Use the SDK image for building the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the backend code
COPY . ./

# Publish the project to the /publish directory
RUN dotnet publish -c Release -o out

# Use the runtime image for the final output
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "BiometricFaceApi.dll"]
