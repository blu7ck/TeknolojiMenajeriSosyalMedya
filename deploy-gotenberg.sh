#!/bin/bash

# Gotenberg PDF Service Deployment Script
# This script helps deploy Gotenberg to various platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Docker
check_docker() {
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are available"
}

# Function to deploy locally
deploy_local() {
    print_status "Deploying Gotenberg locally..."
    
    # Stop existing containers
    docker-compose -f docker-compose.yml down 2>/dev/null || true
    
    # Start new containers
    docker-compose -f docker-compose.yml up -d
    
    # Wait for service to be ready
    print_status "Waiting for Gotenberg to be ready..."
    sleep 10
    
    # Test health endpoint
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        print_success "Gotenberg is running locally at http://localhost:3000"
    else
        print_error "Failed to start Gotenberg. Check logs with: docker logs gotenberg-pdf-service"
        exit 1
    fi
}

# Function to deploy to production
deploy_production() {
    print_status "Deploying Gotenberg to production..."
    
    # Check if production compose file exists
    if [ ! -f "docker-compose.production.yml" ]; then
        print_error "docker-compose.production.yml not found!"
        exit 1
    fi
    
    # Stop existing containers
    docker-compose -f docker-compose.production.yml down 2>/dev/null || true
    
    # Start new containers
    docker-compose -f docker-compose.production.yml up -d
    
    # Wait for service to be ready
    print_status "Waiting for Gotenberg to be ready..."
    sleep 15
    
    # Test health endpoint
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        print_success "Gotenberg is running in production mode"
        print_status "Service URL: http://your-server-ip:3000"
        print_warning "Make sure to configure your firewall and domain name!"
    else
        print_error "Failed to start Gotenberg. Check logs with: docker logs gotenberg-pdf-service-prod"
        exit 1
    fi
}

# Function to test Gotenberg
test_gotenberg() {
    local url=${1:-"http://localhost:3000"}
    
    print_status "Testing Gotenberg at $url..."
    
    # Test health endpoint
    if curl -f "$url/health" >/dev/null 2>&1; then
        print_success "Health check passed"
    else
        print_error "Health check failed"
        return 1
    fi
    
    # Test PDF generation
    print_status "Testing PDF generation..."
    
    # Create a simple HTML file for testing
    cat > test.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Test PDF</title>
</head>
<body>
    <h1>Test PDF Generation</h1>
    <p>This is a test document for Gotenberg PDF generation.</p>
    <p>Generated at: $(date)</p>
</body>
</html>
EOF
    
    # Test PDF generation
    if curl -X POST "$url/forms/chromium/convert/html" \
        -F "files=@test.html" \
        -o test.pdf >/dev/null 2>&1; then
        print_success "PDF generation test passed"
        print_status "Generated test.pdf (size: $(stat -f%z test.pdf 2>/dev/null || stat -c%s test.pdf 2>/dev/null || echo 'unknown') bytes)"
        rm -f test.html test.pdf
    else
        print_error "PDF generation test failed"
        rm -f test.html
        return 1
    fi
}

# Function to show logs
show_logs() {
    local service=${1:-"gotenberg-pdf-service"}
    
    print_status "Showing logs for $service..."
    docker logs -f "$service"
}

# Function to show status
show_status() {
    print_status "Docker containers status:"
    docker ps --filter "name=gotenberg" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    print_status "Docker compose services:"
    docker-compose ps 2>/dev/null || true
}

# Function to update environment variables
update_env() {
    local gotenberg_url=$1
    
    if [ -z "$gotenberg_url" ]; then
        print_error "Please provide Gotenberg URL"
        echo "Usage: $0 update-env https://your-gotenberg-domain.com"
        exit 1
    fi
    
    print_status "Updating environment variables..."
    print_warning "Please update the following environment variable in your Supabase project:"
    echo ""
    echo "GOTENBERG_URL=$gotenberg_url"
    echo ""
    print_status "Go to your Supabase dashboard > Settings > Environment Variables"
    print_status "Add or update GOTENBERG_URL with the value above"
}

# Function to show help
show_help() {
    echo "Gotenberg PDF Service Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  local              Deploy locally (development)"
    echo "  production         Deploy to production"
    echo "  test [URL]         Test Gotenberg service"
    echo "  logs [SERVICE]      Show service logs"
    echo "  status             Show service status"
    echo "  update-env URL     Show environment variable to update"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 local                    # Deploy locally"
    echo "  $0 production               # Deploy to production"
    echo "  $0 test http://localhost:3000  # Test local service"
    echo "  $0 test https://your-domain.com # Test production service"
    echo "  $0 logs gotenberg-pdf-service  # Show logs"
    echo "  $0 update-env https://your-domain.com # Show env update instructions"
}

# Main script logic
case "${1:-help}" in
    "local")
        check_docker
        deploy_local
        test_gotenberg "http://localhost:3000"
        ;;
    "production")
        check_docker
        deploy_production
        test_gotenberg "http://localhost:3000"
        ;;
    "test")
        test_gotenberg "$2"
        ;;
    "logs")
        show_logs "$2"
        ;;
    "status")
        show_status
        ;;
    "update-env")
        update_env "$2"
        ;;
    "help"|*)
        show_help
        ;;
esac
