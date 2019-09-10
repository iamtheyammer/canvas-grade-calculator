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
	include string,
) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/courses/%s/outcome_results?user_ids[]=%s",
		rd.Subdomain,
		courseID,
		userID,
	)

	if len(include) > 1 {
		url = fmt.Sprintf("%s&include[]=%s", url, include)
	}

	return makeAuthenticatedGetRequest(url, rd.Token)
}


func GetOutcomeRollupsByCourse(
	rd *util.RequestDetails,
	courseID string,
	userID string,
	include string,
) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/courses/%s/outcome_rollups?user_ids[]=%s",
		rd.Subdomain,
		courseID,
		userID,
	)

	if len(include) > 1 {
		url = fmt.Sprintf("%s&include[]=%s", url, include)
	}

	return makeAuthenticatedGetRequest(url, rd.Token)
}

func GetAssignmentsByCourse(
	rd *util.RequestDetails,
	courseID string,
	include string,
) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/courses/%s/assignments",
		rd.Subdomain,
		courseID,
	)

	if len(include) > 1 {
		url = fmt.Sprintf("%s?include[]=%s", url, include)
	}

	return makeAuthenticatedGetRequest(url, rd.Token)
}