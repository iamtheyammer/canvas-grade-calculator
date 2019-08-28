package main

import (
	"fmt"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/canvasapis"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
)

var router = getRouter()

func getRouter() *httprouter.Router {
	// init http server

	router := &httprouter.Router{
		RedirectTrailingSlash:  true,
		HandleMethodNotAllowed: true,
		HandleOPTIONS:          true,
	}

	router.GET("/", homeHandler)
	router.GET("/api/canvas/outcomes/:outcomeID", canvasapis.GetOutcomeByIDHandler)
	router.GET("/api/canvas/users/profile/self", canvasapis.GetOwnUserProfileHandler)
	router.GET("/api/canvas/courses", canvasapis.GetCoursesHandler)
	router.GET("/api/canvas/courses/:courseID/outcome_groups", canvasapis.GetOutcomesByCourseHandler)
	router.GET(
		"/api/canvas/courses/:courseID/outcome_groups/:outcomeGroupID/outcomes",
		canvasapis.GetOutcomesByCourseAndOutcomeGroupHandler,
	)
	router.GET("/api/canvas/courses/:courseID/outcome_results", canvasapis.GetOutcomeResultsByCourseHandler)

	return router
}

func homeHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	if r.URL.Path == "/" {
		_, err := fmt.Fprint(w, "Static files will be served here later...")
		if err != nil {
			fmt.Println("There was an error encoding")
		}
		return
	} else {
		util.SendNotFound(w)
		return
	}
}

type MiddlewareRouter map[string]string

func (_ MiddlewareRouter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// apply CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "X-Canvas-Token, X-Canvas-Subdomain")

	router.ServeHTTP(w, r)
}

func main() {
	mw := make(MiddlewareRouter)

	log.Fatal(http.ListenAndServe(":8000", mw))
}
