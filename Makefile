heroku:
	rm -rf bin/;
	mkdir bin;
	make build;
	if [ ! -d "frontend/node_modules" ]; then cd frontend && npm ci; fi;
	cd frontend && npm run build;
	mv ./frontend/build ./bin;
	./bin/canvasProxy;

build:
	go build -o bin/canvasProxy src/main.go

devrunbuilt: build;
	source .env && ./bin/canvasProxy

devrun:
	source .env && go run src/main.go
