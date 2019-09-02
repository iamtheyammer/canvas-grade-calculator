package services

import (
	"fmt"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"net/http"
)

func GetOutcomeByID(rd *util.RequestDetails, id string) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/outcomes/%s",
		rd.Subdomain,
		id,
	)

	return makeAuthenticatedGetRequest(url, rd.Token)
}
