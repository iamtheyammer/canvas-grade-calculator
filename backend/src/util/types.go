package util

import (
	"regexp"
	"strings"
)

// RequestDetails contains details needed by functions to perform requests.
// While this type is exported, you shouldn't use it-- use NewRequestDetails to write to it.
type RequestDetails struct {
	Token string
	Subdomain string
}

var subdomainRegex = regexp.MustCompile("[a-z]{1,64}")

func validateSubdomain(subdomain string) bool {
	// the subdomain must 1-64 lowercase letters
	return subdomainRegex.FindString(subdomain) == subdomain
}

// NewRequestDetails is the way to create a RequestDetails object for use with other
// canvasapi functions.
func NewRequestDetails (
	token string,
	subdomain string,
) RequestDetails {
	subdomain = strings.ToLower(subdomain)

	rd := RequestDetails{
		Token:     token,
		Subdomain: subdomain,
	}

	if len(rd.Subdomain) < 1 {
		rd.Subdomain = "canvas"
	}

	return rd
}

