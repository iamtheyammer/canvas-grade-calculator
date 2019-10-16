package util

import (
	"fmt"
	"log"
	"net/http"
)

func SendUnauthorized(w http.ResponseWriter, reason string) {
	w.WriteHeader(http.StatusUnauthorized)
	_, err := fmt.Fprintf(w, "Unauthorized request: %s", reason)
	if err != nil {
		log.Fatal(err)
	}
	return
}

func SendBadRequest(w http.ResponseWriter, reason string) {
	w.WriteHeader(http.StatusBadRequest)
	_, err := fmt.Fprintf(w, "Bad request: %s", reason)
	if err != nil {
		log.Fatal(err)
	}
	return
}

func SendInternalServerError(w http.ResponseWriter) {
	w.WriteHeader(http.StatusInternalServerError)
	_, err := fmt.Fprint(w, "Internal Server Error")
	if err != nil {
		log.Fatal(err)
	}
	return
}

func SendMethodNotAllowed(w http.ResponseWriter) {
	w.WriteHeader(http.StatusMethodNotAllowed)
	_, err := fmt.Fprint(w, "Method not allowed")
	if err != nil {
		log.Fatal(err)
	}
	return
}

func SendNotFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	_, err := fmt.Fprint(w, "Not found")
	if err != nil {
		log.Fatal(err)
	}
	return
}

func SendRedirect(w http.ResponseWriter, to string) {
	w.Header().Set("Location", to)
	w.WriteHeader(http.StatusFound)

	_, err := fmt.Fprint(w, to)
	if err != nil {
		log.Fatal(err)
	}
	return
}
