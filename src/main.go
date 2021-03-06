package main

import (
	"fmt"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/canvasapis"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/env"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"strings"
)

var router = getRouter()
var staticRouter = getStaticRouter()

func getRouter() *httprouter.Router {
	// init http server

	router := &httprouter.Router{
		RedirectTrailingSlash:  true,
		HandleMethodNotAllowed: true,
		HandleOPTIONS:          true,
	}

	router.GET("/api/canvas/outcomes/:outcomeID", canvasapis.GetOutcomeByIDHandler)
	router.GET("/api/canvas/users/profile/self", canvasapis.GetOwnUserProfileHandler)
	router.GET("/api/canvas/courses", canvasapis.GetCoursesHandler)
	router.GET("/api/canvas/courses/:courseID/assignments", canvasapis.GetAssignmentsByCourseHandler)
	router.GET("/api/canvas/courses/:courseID/outcome_groups", canvasapis.GetOutcomesByCourseHandler)
	router.GET(
		"/api/canvas/courses/:courseID/outcome_groups/:outcomeGroupID/outcomes",
		canvasapis.GetOutcomesByCourseAndOutcomeGroupHandler,
	)
	router.GET("/api/canvas/courses/:courseID/outcome_results", canvasapis.GetOutcomeResultsByCourseHandler)
	router.GET("/api/canvas/courses/:courseID/outcome_rollups", canvasapis.GetOutcomeRollupsByCourseHandler)

	router.GET("/api/canvas/oauth2/request", canvasapis.OAuth2RequestHandler)
	router.GET("/api/canvas/oauth2/response", canvasapis.OAuth2ResponseHandler)
	router.GET("/api/canvas/oauth2/refresh_token", canvasapis.OAuth2RefreshTokenHandler)
	router.DELETE("/api/canvas/oauth2/token", canvasapis.DeleteOAuth2TokenHandler)

	return router
}

func getStaticRouter() *httprouter.Router {
	router := httprouter.New()

	router.ServeFiles("/*filepath", http.Dir("./build"))

	return router
}

type MiddlewareRouter map[string]string

func (_ MiddlewareRouter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// handle serving react static, if enabled
	if env.ShouldServeStatic == "true" {
		if !strings.HasPrefix(r.URL.Path, "/api/") {
			staticRouter.ServeHTTP(w, r)
			return
		}
	}

	// apply CORS headers
	w.Header().Set("Access-Control-Allow-Origin", env.ProxyAllowedCORSOrigins)
	w.Header().Set("Access-Control-Allow-Methods", "GET, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "X-Canvas-Token, X-Canvas-Subdomain")
	w.Header().Set("Access-Control-Expose-Headers", "X-Canvas-Url, X-Canvas-Status-Code")

	router.ServeHTTP(w, r)
}

func main() {
	mw := make(MiddlewareRouter)

	if env.ProxyAllowedSubdomains[0] == "*" {
		fmt.Println("WARN: Your CANVAS_PROXY_ALLOW_SUBDOMAINS env var is currently set to \"*\", " +
			"which will allow anyone to use this server as a proxy server.")
	}

	if env.ProxyAllowedCORSOrigins == "*" {
		fmt.Println("WARN: Your CANVAS_PROXY_ALLOWED_CORS_ORIGINS env var is currently set to \"*\", " +
			"which will allow any site to make requests to this server.")
	}

	fmt.Println(fmt.Sprintf("Canvas proxy running on %s", env.HTTPPort))

	log.Fatal(http.ListenAndServe(env.HTTPPort, mw))
}
