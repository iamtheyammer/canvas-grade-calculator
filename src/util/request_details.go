package util

import (
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/env"
	"net/http"
	"strings"
)

const RequestDetailsFailedValidationMessage = "no canvas token or subdomain not allowed"

// RequestDetails contains details needed by functions to perform requests.
// While this type is exported, you shouldn't use it-- use NewRequestDetails to write to it.
type RequestDetails struct {
	Token     string
	Subdomain string
}

// NewRequestDetails is the way to create a RequestDetails object for use with other
// canvasapi functions.
func NewRequestDetails(
	token string,
	subdomain string,
) RequestDetails {
	subdomain = strings.ToLower(subdomain)

	rd := RequestDetails{
		Token:     token,
		Subdomain: subdomain,
	}

	if len(rd.Subdomain) < 1 {
		rd.Subdomain = env.DefaultSubdomain
	}

	return rd
}

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

	if len(subdomain) < 1 {
		subdomain = env.DefaultSubdomain
	}

	if !ValidateSubdomain(subdomain) {
		return false, nil
	}

	rd := NewRequestDetails(token, subdomain)

	// not specified
	return true, &rd
}
