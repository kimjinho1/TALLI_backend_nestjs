all:
	npm run start

docker:
	docker-compose up --build

dev:
	npm run start:dev

migrate:
	npx prisma migrate dev --name init

seed:
	npm run seed

studio:
	npx prisma studio

format:
	npx prisma-case-format --field-case camel --map-field-case snake --file prisma/schema.prisma
	npx prisma format

clean:
	sudo docker-compose down

fclean:
	sudo docker-compose down -v --rmi all
	docker network prune --force
	docker volume prune --force