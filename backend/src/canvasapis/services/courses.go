package services

import (
	"fmt"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"net/http"
)

func GetCourses(rd *util.RequestDetails) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/courses",
		rd.Subdomain,
	)
	return makeAuthenticatedGetRequest(url, rd.Token)
}

func GetOutcomesByCourse(rd *util.RequestDetails, courseID string) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/courses/%s/outcome_groups",
		rd.Subdomain,
		courseID,
	)
	return makeAuthenticatedGetRequest(url, rd.Token)
}

func GetOutcomesByCourseAndOutcomeGroup(
	rd *util.RequestDetails,
	courseID string,
	outcomeGroupID string,
) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/courses/%s/outcome_groups/%s/outcomes",
		rd.Subdomain,
		courseID,
		outcomeGroupID,
	)
	return makeAuthenticatedGetRequest(url, rd.Token)
}

func GetOutcomeResultsByCourse(
	rd *util.RequestDetails,
	courseID string,
	userID string,
) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/courses/%s/outcome_results?user_ids[]=%s",
		rd.Subdomain,
		courseID,
		userID,
	)
	return makeAuthenticatedGetRequest(url, rd.Token)
}
