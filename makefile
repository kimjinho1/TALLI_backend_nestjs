all:
	npx prisma migrate dev --name init
	npm run seed
	npm run start:dev

docker:
	docker-compose up --build

nest:
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
	docker network prune --force
	docker volume prune --force

fclean:	clean
	sudo rm -rf db