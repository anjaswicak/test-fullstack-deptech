#!/bin/bash

# Stock Management Docker Scripts
# Usage: ./docker.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_info() {
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

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Generate Laravel app key
generate_app_key() {
    print_info "Generating Laravel application key..."
    docker-compose exec api php artisan key:generate --force
    print_success "Application key generated!"
}

# Run database migrations
run_migrations() {
    print_info "Running database migrations..."
    docker-compose exec api php artisan migrate --force
    print_success "Database migrations completed!"
}

# Run database seeders
run_seeders() {
    print_info "Running database seeders..."
    docker-compose exec api php artisan db:seed --force
    print_success "Database seeders completed!"
}

# Main commands
case $1 in
    "build")
        check_docker
        print_info "Building Docker containers..."
        docker-compose build --no-cache
        print_success "Build completed!"
        ;;
    
    "up")
        check_docker
        print_info "Starting Stock Management System..."
        docker-compose up -d
        print_success "System started!"
        print_info "Frontend: http://localhost:3000"
        print_info "Backend: http://localhost:8000"
        print_info "Database: localhost:3306"
        ;;
    
    "down")
        check_docker
        print_info "Stopping Stock Management System..."
        docker-compose down
        print_success "System stopped!"
        ;;
    
    "dev")
        check_docker
        print_info "Starting development environment..."
        docker-compose -f docker-compose.dev.yml up -d
        print_success "Development environment started!"
        print_info "Frontend: http://localhost:3000 (with hot reload)"
        print_info "Backend: http://localhost:8000 (with debug mode)"
        ;;
    
    "dev-down")
        check_docker
        print_info "Stopping development environment..."
        docker-compose -f docker-compose.dev.yml down
        print_success "Development environment stopped!"
        ;;
    
    "setup")
        check_docker
        print_info "Setting up the application..."
        
        # Copy environment files
        if [ ! -f ./api/.env ]; then
            cp ./api/.env.docker ./api/.env
            print_info "Copied API environment file"
        fi
        
        if [ ! -f ./apps/.env.local ]; then
            cp ./apps/.env.docker ./apps/.env.local
            print_info "Copied APP environment file"
        fi
        
        # Build and start containers
        docker-compose build
        docker-compose up -d
        
        print_info "Containers are starting up..."
        print_info "Laravel is initializing (this may take a moment)..."
        print_info "Database migrations and seeding will run automatically"
        
        print_success "Setup completed!"
        print_info "Frontend: http://localhost:3000"
        print_info "Backend: http://localhost:8000"
        print_info "Use 'docker-compose logs -f' to monitor startup progress"
        ;;
    
    "logs")
        check_docker
        if [ -z "$2" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f $2
        fi
        ;;
    
    "restart")
        check_docker
        print_info "Restarting containers..."
        docker-compose restart
        print_success "Containers restarted!"
        ;;
    
    "clean")
        check_docker
        print_warning "This will remove all containers, volumes, and images!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v --rmi all
            docker system prune -f
            print_success "Cleanup completed!"
        else
            print_info "Cleanup cancelled."
        fi
        ;;
    
    "status")
        check_docker
        docker-compose ps
        ;;
    
    "shell-api")
        check_docker
        print_info "Opening shell in API container..."
        docker-compose exec api bash
        ;;
    
    "shell-app")
        check_docker
        print_info "Opening shell in APP container..."
        docker-compose exec apps sh
        ;;
    
    "db")
        check_docker
        print_info "Connecting to database..."
        docker-compose exec mysql mysql -u stock_user -p stock_management
        ;;
    
    *)
        echo "Stock Management Docker Manager"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  setup      - Initial setup (copy env files, build, migrate, seed)"
        echo "  build      - Build all containers"
        echo "  up         - Start production environment"
        echo "  down       - Stop production environment"
        echo "  dev        - Start development environment"
        echo "  dev-down   - Stop development environment"
        echo "  restart    - Restart all containers"
        echo "  logs       - Show logs (add service name for specific service)"
        echo "  status     - Show container status"
        echo "  shell-api  - Open shell in API container"
        echo "  shell-app  - Open shell in APP container"
        echo "  db         - Connect to database"
        echo "  clean      - Remove all containers, volumes, and images"
        echo ""
        echo "Examples:"
        echo "  $0 setup           # Initial setup"
        echo "  $0 up              # Start production"
        echo "  $0 dev             # Start development"
        echo "  $0 logs api        # Show API logs"
        echo "  $0 shell-api       # Open API shell"
        ;;
esac