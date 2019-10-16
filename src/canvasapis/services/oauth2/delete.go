package oauth2

import (
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/canvasapis/services"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/env"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"net/http"
)

// Delete deletes an access token (for logging out)
func Delete(
	rd *util.RequestDetails,
) (*http.Response, string, error) {
	deleteTokenURL := util.GenerateCanvasURL("/login/oauth2/token", env.OAuth2Subdomain)

	q := deleteTokenURL.Query()
	q.Set("access_token", rd.Token)
	deleteTokenURL.RawQuery = q.Encode()

	return services.MakeDeleteRequest(deleteTokenURL.String())
}
