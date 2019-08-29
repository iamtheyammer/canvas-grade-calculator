package canvasapis

import (
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/canvasapis/services"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
)

func GetCoursesHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, "no canvas token")
		return
	}

	resp, body, err := services.GetCourses(rd)
	if err != nil {
		util.SendInternalServerError(w)
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}

func GetOutcomesByCourseHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	courseID := ps.ByName("courseID")
	if len(courseID) < 1 {
		util.SendBadRequest(w, "missing courseID as url param")
		return
	}

	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, "no canvas token")
		return
	}

	resp, body, err := services.GetOutcomesByCourse(rd, courseID)
	if err != nil {
		util.SendInternalServerError(w)
		log.Fatal(err)
		return
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}

func GetOutcomesByCourseAndOutcomeGroupHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	courseID := ps.ByName("courseID")
	if len(courseID) < 1 {
		util.SendBadRequest(w, "missing courseID as url param")
		return
	}

	outcomeGroupID := ps.ByName("outcomeGroupID")
	if len(outcomeGroupID) < 1 {
		util.SendBadRequest(w, "missing outcomeGroupID as url param")
		return
	}

	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, "no canvas token")
		return
	}

	resp, body, err := services.GetOutcomesByCourseAndOutcomeGroup(rd, courseID, outcomeGroupID)
	if err != nil {
		util.SendInternalServerError(w)
		return
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}

func GetOutcomeResultsByCourseHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	courseID := ps.ByName("courseID")
	if len(courseID) < 1 {
		util.SendBadRequest(w, "missing courseID as url param")
		return
	}

	userID := r.URL.Query().Get("userId")
	if len(userID) < 1 {
		util.SendBadRequest(w, "missing userId as param userId")
		return
	}

	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, "no canvas token")
		return
	}

	includes := r.URL.Query().Get("include[]")

	resp, body, err := services.GetOutcomeResultsByCourse(rd, courseID, userID, includes)
	if err != nil {
		util.SendInternalServerError(w)
		return
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}

func GetOutcomeRollupsByCourseHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	courseID := ps.ByName("courseID")
	if len(courseID) < 1 {
		util.SendBadRequest(w, "missing courseID as url param")
		return
	}

	userID := r.URL.Query().Get("userId")
	if len(userID) < 1 {
		util.SendBadRequest(w, "missing userId as param userId")
		return
	}

	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, "no canvas token")
		return
	}

	includes := r.URL.Query().Get("include[]")

	resp, body, err := services.GetOutcomeRollupsByCourse(rd, courseID, userID, includes)
	if err != nil {
		util.SendInternalServerError(w)
		return
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}
