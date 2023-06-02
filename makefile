all:
	docker-compose up

nest:
	npm run start:dev

migrate:
	npx prisma migrate dev --name init

studio:
	npx prisma studio

clean:
	sudo docker-compose down
	docker network prune --force
	docker volume prune --force

fclean:	clean
	sudo rm -rf db