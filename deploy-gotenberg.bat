@echo off
REM Gotenberg PDF Service Deployment Script for Windows
REM This script helps deploy Gotenberg to various platforms

setlocal enabledelayedexpansion

REM Function to print colored output (Windows compatible)
:print_status
echo [INFO] %~1
goto :eof

:print_success
echo [SUCCESS] %~1
goto :eof

:print_warning
echo [WARNING] %~1
goto :eof

:print_error
echo [ERROR] %~1
goto :eof

REM Function to check if command exists
:command_exists
where %1 >nul 2>&1
if %errorlevel% equ 0 (
    exit /b 0
) else (
    exit /b 1
)
goto :eof

REM Function to check Docker
:check_docker
call :command_exists docker
if %errorlevel% neq 0 (
    call :print_error "Docker is not installed. Please install Docker Desktop first."
    exit /b 1
)

call :command_exists docker-compose
if %errorlevel% neq 0 (
    call :print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit /b 1
)

call :print_success "Docker and Docker Compose are available"
goto :eof

REM Function to deploy locally
:deploy_local
call :print_status "Deploying Gotenberg locally..."

REM Stop existing containers
docker-compose -f docker-compose.yml down 2>nul

REM Start new containers
docker-compose -f docker-compose.yml up -d

REM Wait for service to be ready
call :print_status "Waiting for Gotenberg to be ready..."
timeout /t 10 /nobreak >nul

REM Test health endpoint
curl -f http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    call :print_success "Gotenberg is running locally at http://localhost:3000"
) else (
    call :print_error "Failed to start Gotenberg. Check logs with: docker logs gotenberg-pdf-service"
    exit /b 1
)
goto :eof

REM Function to deploy to production
:deploy_production
call :print_status "Deploying Gotenberg to production..."

REM Check if production compose file exists
if not exist "docker-compose.production.yml" (
    call :print_error "docker-compose.production.yml not found!"
    exit /b 1
)

REM Stop existing containers
docker-compose -f docker-compose.production.yml down 2>nul

REM Start new containers
docker-compose -f docker-compose.production.yml up -d

REM Wait for service to be ready
call :print_status "Waiting for Gotenberg to be ready..."
timeout /t 15 /nobreak >nul

REM Test health endpoint
curl -f http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    call :print_success "Gotenberg is running in production mode"
    call :print_status "Service URL: http://your-server-ip:3000"
    call :print_warning "Make sure to configure your firewall and domain name!"
) else (
    call :print_error "Failed to start Gotenberg. Check logs with: docker logs gotenberg-pdf-service-prod"
    exit /b 1
)
goto :eof

REM Function to test Gotenberg
:test_gotenberg
set url=%~1
if "%url%"=="" set url=http://localhost:3000

call :print_status "Testing Gotenberg at %url%..."

REM Test health endpoint
curl -f "%url%/health" >nul 2>&1
if %errorlevel% equ 0 (
    call :print_success "Health check passed"
) else (
    call :print_error "Health check failed"
    exit /b 1
)

REM Test PDF generation
call :print_status "Testing PDF generation..."

REM Create a simple HTML file for testing
echo ^<!DOCTYPE html^> > test.html
echo ^<html^> >> test.html
echo ^<head^> >> test.html
echo     ^<title^>Test PDF^</title^> >> test.html
echo ^</head^> >> test.html
echo ^<body^> >> test.html
echo     ^<h1^>Test PDF Generation^</h1^> >> test.html
echo     ^<p^>This is a test document for Gotenberg PDF generation.^</p^> >> test.html
echo     ^<p^>Generated at: %date% %time%^</p^> >> test.html
echo ^</body^> >> test.html
echo ^</html^> >> test.html

REM Test PDF generation
curl -X POST "%url%/forms/chromium/convert/html" -F "files=@test.html" -o test.pdf >nul 2>&1
if %errorlevel% equ 0 (
    call :print_success "PDF generation test passed"
    call :print_status "Generated test.pdf"
    del test.html test.pdf
) else (
    call :print_error "PDF generation test failed"
    del test.html
    exit /b 1
)
goto :eof

REM Function to show logs
:show_logs
set service=%~1
if "%service%"=="" set service=gotenberg-pdf-service

call :print_status "Showing logs for %service%..."
docker logs -f %service%
goto :eof

REM Function to show status
:show_status
call :print_status "Docker containers status:"
docker ps --filter "name=gotenberg" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

call :print_status "Docker compose services:"
docker-compose ps 2>nul
goto :eof

REM Function to update environment variables
:update_env
set gotenberg_url=%~1

if "%gotenberg_url%"=="" (
    call :print_error "Please provide Gotenberg URL"
    echo Usage: %0 update-env https://your-gotenberg-domain.com
    exit /b 1
)

call :print_status "Updating environment variables..."
call :print_warning "Please update the following environment variable in your Supabase project:"
echo.
echo GOTENBERG_URL=%gotenberg_url%
echo.
call :print_status "Go to your Supabase dashboard ^> Settings ^> Environment Variables"
call :print_status "Add or update GOTENBERG_URL with the value above"
goto :eof

REM Function to show help
:show_help
echo Gotenberg PDF Service Deployment Script
echo.
echo Usage: %0 [COMMAND] [OPTIONS]
echo.
echo Commands:
echo   local              Deploy locally (development)
echo   production         Deploy to production
echo   test [URL]         Test Gotenberg service
echo   logs [SERVICE]      Show service logs
echo   status             Show service status
echo   update-env URL     Show environment variable to update
echo   help               Show this help message
echo.
echo Examples:
echo   %0 local                    # Deploy locally
echo   %0 production               # Deploy to production
echo   %0 test http://localhost:3000  # Test local service
echo   %0 test https://your-domain.com # Test production service
echo   %0 logs gotenberg-pdf-service  # Show logs
echo   %0 update-env https://your-domain.com # Show env update instructions
goto :eof

REM Main script logic
if "%1"=="local" (
    call :check_docker
    call :deploy_local
    call :test_gotenberg "http://localhost:3000"
) else if "%1"=="production" (
    call :check_docker
    call :deploy_production
    call :test_gotenberg "http://localhost:3000"
) else if "%1"=="test" (
    call :test_gotenberg "%2"
) else if "%1"=="logs" (
    call :show_logs "%2"
) else if "%1"=="status" (
    call :show_status
) else if "%1"=="update-env" (
    call :update_env "%2"
) else (
    call :show_help
)

endlocal
