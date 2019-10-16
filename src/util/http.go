package util

import (
	"fmt"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/env"
	"log"
	"net/http"
	"net/url"
	"strings"
)

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

	if reqURL := resp.Request.URL.String(); !strings.Contains(reqURL, env.OAuth2ClientSecret) {
		w.Header().Set("X-Canvas-URL", reqURL)
	} else {
		w.Header().Set("X-Canvas-URL", "omitted")
	}

	w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
	w.WriteHeader(http.StatusBadGateway)
	_, err := fmt.Fprint(w, efc)
	if err != nil {
		log.Fatal(err)
	}
	return
}

func SendCanvasSuccess(w http.ResponseWriter, resp *http.Response, body string) {
	w.Header().Set("X-Canvas-Status-Code", fmt.Sprintf("%d", resp.StatusCode))

	if reqURL := resp.Request.URL.String(); !strings.Contains(reqURL, env.OAuth2ClientSecret) {
		w.Header().Set("X-Canvas-URL", reqURL)
	} else {
		w.Header().Set("X-Canvas-URL", "omitted")
	}

	w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
	w.WriteHeader(http.StatusOK)
	_, err := fmt.Fprint(w, body)
	if err != nil {
		log.Fatal(err)
	}
	return
}

func HandleCanvasOAuth2Response(w http.ResponseWriter, resp *http.Response, body string) {
	redirectTo, err := url.Parse(env.OAuth2SuccessURI)
	if err != nil {
		log.Fatal(err)
	}

	q := redirectTo.Query()
	if sc := resp.StatusCode; sc < 200 || sc > 399 {
		q.Set("error", "proxy_canvas_error")
		q.Set("error_source", "canvas_proxy")
		q.Set("canvas_status_code", fmt.Sprintf("%d", resp.StatusCode))

		// attempting JSON detection as Canvas sends text/html typed JSON with errors
		if string(body[:2]) == "{\"" ||
			strings.Contains(resp.Header.Get("content-type"), "application/json") {
			q.Set("body", body)
		} else {
			q.Set("body", "html_omitted")
		}
	} else {
		q.Set("canvas_response", body)
		q.Set("subdomain", env.OAuth2Subdomain)
	}

	redirectToURLString := fmt.Sprintf("%s?%s", env.OAuth2SuccessURI, q.Encode())

	SendRedirect(
		w,
		redirectToURLString,
	)
	return
}
