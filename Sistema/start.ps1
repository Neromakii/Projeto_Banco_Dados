# Requer Docker Desktop rodando
$ErrorActionPreference = "Stop"

$composeFile = Join-Path $PSScriptRoot "docker-compose.yml"

Write-Host ""
Write-Host "Buildando e subindo containers..." -ForegroundColor Cyan

docker compose -f $composeFile up --build -d

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Erro ao subir os containers. Verifique o Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Aguardando frontend ficar saudavel..." -ForegroundColor Yellow

$timeout = 60
$elapsed  = 0
$ready    = $false

while ($elapsed -lt $timeout) {
    $status = docker inspect --format "{{.State.Health.Status}}" sistema-frontend 2>$null
    # frontend usa nginx, sem healthcheck — checa se esta running
    $running = docker inspect --format "{{.State.Running}}" sistema-frontend 2>$null
    if ($running -eq "true") {
        $ready = $true
        break
    }
    Start-Sleep -Seconds 2
    $elapsed += 2
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "  Sistema rodando!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend   ->  http://localhost" -ForegroundColor White
Write-Host "  Backend    ->  http://localhost:3100" -ForegroundColor Gray
Write-Host "  pgAdmin    ->  http://localhost:5050" -ForegroundColor Gray
Write-Host "              (admin@admin.com / admin)" -ForegroundColor DarkGray
Write-Host ""

# Abre o frontend no navegador padrao
Start-Process "http://localhost"
