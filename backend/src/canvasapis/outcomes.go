package canvasapis

import (
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/canvasapis/services"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

/*
GetOutcomeByIDHandler handles getting outcomes by ID.
*/
func GetOutcomeByIDHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	outcomeID := ps.ByName("outcomeID")
	if len(outcomeID) < 1 {
		util.SendBadRequest(w, "missing outcome id as param id")
		return
	}

	if !util.ValidateIntegerString(outcomeID) {
		util.SendBadRequest(w, "invalid outcomeID")
		return
	}

	ok, rd := util.GetRequestDetailsFromRequest(r)

	if !ok {
		util.SendUnauthorized(w, "no canvas token")
		return
	}

	resp, body, err := services.GetOutcomeByID(rd, outcomeID)
	if err != nil {
		util.SendInternalServerError(w)
		return
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}
