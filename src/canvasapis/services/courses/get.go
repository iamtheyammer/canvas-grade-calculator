package courses

import (
	"fmt"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/canvasapis/services"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"net/http"
)

// Get gets all of a user's courses
func Get(rd *util.RequestDetails) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/courses",
		rd.Subdomain,
	)
	return services.MakeAuthenticatedGetRequest(url, rd.Token)
}

// GetOutcomesByCourse gets all outcomes for a specific course
func GetOutcomesByCourse(rd *util.RequestDetails, courseID string) (*http.Response, string, error) {
	url := fmt.Sprintf(
		"https://%s.instructure.com/api/v1/courses/%s/outcome_groups",
		rd.Subdomain,
		courseID,
	)
	return services.MakeAuthenticatedGetRequest(url, rd.Token)
}

// GetOutcomesByCourseAndOutcomeGroup gets all outcomes in a course's outcome group
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
	return services.MakeAuthenticatedGetRequest(url, rd.Token)
}

// GetOutcomeResultsByCourse gets outcome results for the specified course
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

	return services.MakeAuthenticatedGetRequest(url, rd.Token)
}

// GetOutcomeRollupsByCourse gets outcome rollups for a specific course
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

	return services.MakeAuthenticatedGetRequest(url, rd.Token)
}

// GetAssignmentsByCourse gets all assignments for a specified course
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

	return services.MakeAuthenticatedGetRequest(url, rd.Token)
}