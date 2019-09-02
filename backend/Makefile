build:
	go build -o bin/canvasProxy src/main.go

devrunbuilt: build;
	source .env && ./bin/canvasProxy

devrun:
	source .env && go run src/main.go