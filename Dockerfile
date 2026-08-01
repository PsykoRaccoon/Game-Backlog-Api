FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY GameBacklogApi.csproj .
RUN dotnet restore GameBacklogApi.csproj

COPY . .
RUN dotnet publish GameBacklogApi.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec dotnet GameBacklogApi.dll --urls http://+:${PORT:-8080}"]
