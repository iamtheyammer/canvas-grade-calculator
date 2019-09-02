package util

import (
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/env"
	"strings"
)

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
