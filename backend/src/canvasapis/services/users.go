package services

import (
	"fmt"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"net/http"
)

func GetOwnUserProfile(rd *util.RequestDetails) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/users/self/profile",
		rd.Subdomain,
	)
	return makeAuthenticatedGetRequest(url, rd.Token)
}
