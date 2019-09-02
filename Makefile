heroku:
	rm -rf bin/;
	mkdir bin;
	cd backend && make build;
	mv backend/bin/canvasProxy ./bin/canvasProxy;
	cd frontend && npm run build;
	mv ./frontend/build ./bin;
	./bin/canvasProxy;
