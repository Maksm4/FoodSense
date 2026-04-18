FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS restore
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Services/Auth.API/Auth.API.csproj", "Services/Auth.API/"]
COPY ["Common/Common.csproj", "Common/"]
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore "Services/Auth.API/Auth.API.csproj"

FROM restore AS build
ARG BUILD_CONFIGURATION=Release
COPY . .
WORKDIR "/src/Services/Auth.API"
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet build "./Auth.API.csproj" \
    -c $BUILD_CONFIGURATION \
    --no-restore -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Auth.API.csproj" \
    -c $BUILD_CONFIGURATION --no-build \
    --no-restore -o /app/publish \
    /p:UseAppHost=false

FROM base AS final
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Auth.API.dll"]