NAME = globant0
COMPOSE_FILE = docker/docker-compose.yml

.PHONY: all build up down clean fclean re logs

all: up

build:
	@printf "  \033[33m⚙\033[0m  Building Docker images...\n"
	@docker compose -f $(COMPOSE_FILE) --project-name $(NAME) build
	@printf "  \033[32m✓\033[0m Images built → $(NAME)\n"

up: build
	@printf "  \033[33m⚙\033[0m  Starting containers...\n"
	@docker compose -f $(COMPOSE_FILE) --project-name $(NAME) up -d
	@printf "  \033[32m✓\033[0m Containers running → http://localhost:4243\n"

down:
	@printf "  \033[33m⚙\033[0m  Stopping containers...\n"
	@docker compose -f $(COMPOSE_FILE) --project-name $(NAME) down
	@printf "  \033[32m✓\033[0m Containers stopped → $(NAME)\n"

clean: down
	@printf "  \033[31m✗\033[0m  Removing containers...\n"
	@docker compose -f $(COMPOSE_FILE) --project-name $(NAME) rm -f
	@printf "  \033[32m✓\033[0m Containers removed → $(NAME)\n"

fclean: clean
	@printf "  \033[31m✗\033[0m  Removing images and volumes...\n"
	@docker compose -f $(COMPOSE_FILE) --project-name $(NAME) down -v --rmi local
	@printf "  \033[32m✓\033[0m Images and volumes removed → $(NAME)\n"

re: fclean all

logs:
	@docker compose -f $(COMPOSE_FILE) --project-name $(NAME) logs -f
