@echo off
title Sistema E-Commerce - Docker Setup
cls

echo ================================================
echo        SISTEMA E-COMMERCE - DOCKER SETUP
echo ================================================
echo.
echo Verificando se o Docker esta instalado...

docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao encontrado!
    echo.
    echo Instale o Docker Desktop em:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    echo Depois de instalar, execute este script novamente.
    pause
    exit /b 1
)

echo [OK] Docker encontrado!
echo.
echo Verificando se o Docker Compose esta disponivel...

docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker Compose nao encontrado!
    pause
    exit /b 1
)

echo [OK] Docker Compose disponivel!
echo.
echo ================================================
echo Iniciando todos os servicos...
echo ================================================
echo.

docker compose up -d

if %errorlevel% neq 0 (
    echo [ERRO] Falha ao iniciar os servicos.
    pause
    exit /b 1
)

echo.
echo [OK] Servicos iniciados com sucesso!
echo.
echo Aguardando os servicos ficarem prontos...
echo.

:wait_loop
set /a counter+=1
if %counter% gtr 30 (
    echo [AVISO] Tempo limite excedido. Verifique os logs com: docker compose logs
    goto :done
)

docker compose ps --format json 2>nul | findstr /C:"running" >nul 2>&1
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto :wait_loop
)

echo [OK] Todos os servicos estao rodando!
echo.
echo ================================================
echo            SERVICOS DISPONIVEIS
echo ================================================
echo.
echo   Frontend:     http://localhost
echo   Backend API:  http://localhost:3100
echo   PGAdmin:      http://localhost:5050
echo.
echo   PGAdmin Login: admin@admin.com / admin
echo   (ja configurado para conectar no PostgreSQL)
echo.
echo ================================================
echo.
echo Abrindo o sistema no navegador...
start http://localhost

echo.
echo Para parar os servicos, pressione qualquer tecla...
echo Ou feche esta janela e execute: docker compose down
echo.
pause

echo.
echo Parando servicos...
docker compose down
echo [OK] Servicos parados. Volte sempre!
timeout /t 2 /nobreak >nul
