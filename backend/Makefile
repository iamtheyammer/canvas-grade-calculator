build:
	go build -o bin/canvasProxy src/main.go

runbuilt:
	go build -o bin/canvasProxy src/main.go && source .env && ./bin/canvasProxy

br: buildrun

run:
	source .env && go run src/main.go