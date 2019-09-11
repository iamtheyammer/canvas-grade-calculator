herokunode:
	if [ ! -d "frontend/node_modules" ]; then cd frontend && npm i; fi;
	cd frontend && npm run build;
	mv ./frontend/build ./bin;

build:
	go build -o bin/canvasProxy src/main.go

devrunbuilt: build;
	source .env && ./bin/canvasProxy

devrun:
	source .env && go run src/main.go

ci_before_install:
	cd frontend && nvm install `cat .nvmrc` && nvm use

ci:
	make build;
	make herokunode;
