package canvasapis

import (
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/canvasapis/services"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func GetOwnUserProfileHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	ok, rd := util.GetRequestDetailsFromRequest(r)
	if !ok {
		util.SendUnauthorized(w, "no canvas token or invalid subdomain")
		return
	}

	resp, body, err := services.GetOwnUserProfile(rd)
	if err != nil {
		util.SendInternalServerError(w)
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}
