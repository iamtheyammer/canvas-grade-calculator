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
		util.SendUnauthorized(w, util.RequestDetailsFailedValidationMessage)
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

	if !util.ValidateIntegerString(courseID) {
		util.SendBadRequest(w, "invalid courseID")
		return
	}

	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, util.RequestDetailsFailedValidationMessage)
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

	if !util.ValidateIntegerString(courseID) {
		util.SendBadRequest(w, "invalid courseID")
		return
	}

	outcomeGroupID := ps.ByName("outcomeGroupID")
	if len(outcomeGroupID) < 1 {
		util.SendBadRequest(w, "missing outcomeGroupID as url param")
		return
	}

	if !util.ValidateIntegerString(outcomeGroupID) {
		util.SendBadRequest(w, "invalid outcomeGroupID")
		return
	}

	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, util.RequestDetailsFailedValidationMessage)
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

	if !util.ValidateIntegerString(courseID) {
		util.SendBadRequest(w, "invalid courseID")
		return
	}

	userID := r.URL.Query().Get("userId")
	if len(userID) < 1 {
		util.SendBadRequest(w, "missing userId as param userId")
		return
	}

	if !util.ValidateIntegerString(userID) {
		util.SendBadRequest(w, "invalid userID")
		return
	}

	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, util.RequestDetailsFailedValidationMessage)
		return
	}

	includes := r.URL.Query().Get("include[]")

	if len(includes) > 1 {
		if !util.ValidateIncludes(includes) {
			util.SendBadRequest(w, "invalid includes")
			return
		}
	}

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

	if !util.ValidateIntegerString(courseID) {
		util.SendBadRequest(w, "invalid courseID")
		return
	}

	userID := r.URL.Query().Get("userId")
	if len(userID) < 1 {
		util.SendBadRequest(w, "missing userId as param userId")
		return
	}

	if !util.ValidateIntegerString(userID) {
		util.SendBadRequest(w, "invalid userId")
		return
	}

	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, util.RequestDetailsFailedValidationMessage)
		return
	}

	includes := r.URL.Query().Get("include[]")

	if len(includes) > 1 {
		if !util.ValidateIncludes(includes) {
			util.SendBadRequest(w, "invalid includes")
			return
		}
	}

	resp, body, err := services.GetOutcomeRollupsByCourse(rd, courseID, userID, includes)
	if err != nil {
		util.SendInternalServerError(w)
		return
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}

func GetAssignmentsByCourseHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	courseID := ps.ByName("courseID")
	if len(courseID) < 1 {
		util.SendBadRequest(w, "missing courseID as url param")
		return
	}

	if !util.ValidateIntegerString(courseID) {
		util.SendBadRequest(w, "invalid courseID")
		return
	}

	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, util.RequestDetailsFailedValidationMessage)
		return
	}

	includes := r.URL.Query().Get("include[]")

	if len(includes) > 1 {
		if !util.ValidateIncludes(includes) {
			util.SendBadRequest(w, "invalid includes")
			return
		}
	}

	resp, body, err := services.GetAssignmentsByCourse(rd, courseID, includes)
	if err != nil {
		util.SendInternalServerError(w)
		return
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}
