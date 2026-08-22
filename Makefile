.PHONY: up down build restart logs clean help

# Comando por defecto
all: up

# Levantar el proyecto
up:
	@echo "🚀 Levantando el proyecto..."
	docker-compose up -d --build

# Levantar con logs visibles
dev:
	@echo "🚀 Levantando el proyecto en modo desarrollo..."
	docker-compose up --build

# Bajar el proyecto
down:
	@echo "🛑 Bajando el proyecto..."
	docker-compose down

# Reconstruir desde cero
build:
	@echo "🔨 Reconstruyendo el proyecto..."
	docker-compose build --no-cache

# Reiniciar el proyecto
restart: down
	@docker-compose up -d --build
	@echo "🔄 Proyecto reiniciado"

# Ver logs
logs:
	@echo "📋 Mostrando logs..."
	docker-compose logs -f

# Limpiar contenedores, volúmenes e imágenes
clean:
	@echo "🧹 Limpiando contenedores, volúmenes e imágenes..."
	docker-compose down -v --rmi all

# Ayuda
help:
	@echo "📖 Comandos disponibles:"
	@echo "  make up       - Levantar el proyecto en segundo plano"
	@echo "  make dev      - Levantar el proyecto con logs visibles"
	@echo "  make down     - Bajar el proyecto"
	@echo "  make build    - Reconstruir el proyecto desde cero"
	@echo "  make restart  - Reiniciar el proyecto"
	@echo "  make logs     - Ver logs del proyecto"
	@echo "  make clean    - Limpiar contenedores, volúmenes e imágenes"
	@echo "  make help     - Mostrar esta ayuda"
