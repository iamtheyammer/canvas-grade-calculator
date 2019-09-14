package util

import "strings"

var scopes = []string{
	"url:GET|/api/v1/outcomes/:id",
	"url:GET|/api/v1/users/:id",
	"url:GET|/api/v1/users/:user_id/profile",
	"url:GET|/api/v1/courses",
	"url:GET|/api/v1/courses/:course_id/assignments",
	"url:GET|/api/v1/courses/:course_id/outcome_groups",
	"url:GET|/api/v1/courses/:course_id/outcome_groups/:id/outcomes",
	"url:GET|/api/v1/courses/:course_id/outcome_results",
	"url:GET|/api/v1/courses/:course_id/outcome_rollups",
}

var stringScopes = strings.Join(scopes, " ")

// GetScopesList gets the static string list of scopes.
func GetScopesList() string {
	return stringScopes
}
