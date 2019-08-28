package util

import (
	"fmt"
	"log"
	"net/http"
)

func GetRequestDetailsFromRequest(r *http.Request) (bool, *RequestDetails) {
	var token, subdomain string

	// token - header
	headerToken := r.Header.Get("x-canvas-token")
	if len(headerToken) > 0 {
		token = headerToken
	} else {
		// in query
		keys, ok := r.URL.Query()["token"]

		if ok && len(keys[0]) > 1 {
			// returns an array of results
			token = keys[0]
		}
	}

	if len(token) < 1 {
		return false, nil
	}

	// subdomain
	subdomain = r.Header.Get("x-canvas-subdomain")

	rd := NewRequestDetails(token, subdomain)

	// not specified
	return true, &rd
}

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

func HandleCanvasResponse(w http.ResponseWriter, resp *http.Response, body string) {
	sc := resp.StatusCode
	if sc < 200 || sc > 399 {
		SendCanvasError(w, resp, body)
		return
	}

	SendCanvasSuccess(w, resp, body)
}

func SendCanvasError(w http.ResponseWriter, resp *http.Response, efc string) {
	w.Header().Set("X-Canvas-Status-Code", fmt.Sprintf("%d", resp.StatusCode))
	w.Header().Set("X-Canvas-URL", resp.Request.URL.String())
	w.WriteHeader(http.StatusBadGateway)
	_, err := fmt.Fprint(w, efc)
	if err != nil {
		log.Fatal(err)
	}
	return
}

func SendCanvasSuccess(w http.ResponseWriter, resp *http.Response, body string) {
	w.Header().Set("X-Canvas-URL", resp.Request.URL.String())
	w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
	w.WriteHeader(http.StatusOK)
	_, err := fmt.Fprint(w, body)
	if err != nil {
		log.Fatal(err)
	}
	return
}
