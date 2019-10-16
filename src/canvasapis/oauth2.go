package canvasapis

import (
	"fmt"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/canvasapis/services/oauth2"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/env"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"net/url"
)

var OAuth2AuthURI = getOAuth2AuthURI()

func getOAuth2AuthURI() string {
	redirectURL := url.URL{
		Host:   fmt.Sprintf("%s.instructure.com", env.OAuth2Subdomain),
		Path:   "/login/oauth2/auth",
		Scheme: "https",
	}

	q := redirectURL.Query()
	q.Set("client_id", env.OAuth2ClientID)
	q.Set("response_type", "code")
	q.Set("purpose", "Canvas CBL Grades Calculator")
	q.Set("redirect_uri", env.OAuth2RedirectURI)
	q.Set("scope", util.GetScopesList())
	redirectURL.RawQuery = q.Encode()

	return redirectURL.String()
}

/*
OAuth2RequestHandler handles the beginning of the OAuth2 flow with Canvas.
Specifically, it redirects the user to Canvas for permission.
*/
func OAuth2RequestHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	util.SendRedirect(w, OAuth2AuthURI)
}

func OAuth2ResponseHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	code := r.URL.Query().Get("code")

	if len(code) < 1 {
		// an error occurred, just redirect
		r.URL.Query().Set("error_source", "canvas")
		util.SendRedirect(
			w,
			fmt.Sprintf(
				"%s?%s",
				env.OAuth2SuccessURI,
				r.URL.Query().Encode(),
			),
		)
		return
	}

	resp, body, err := oauth2.GetAccessFromRedirectResponse(code)
	if err != nil {
		util.SendInternalServerError(w)
		return
	}

	util.HandleCanvasOAuth2Response(w, resp, body)
	return
}

func OAuth2RefreshTokenHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	refreshToken := r.URL.Query().Get("refresh_token")
	if len(refreshToken) < 1 {
		util.SendBadRequest(w, "no refresh_token specified")
		return
	}

	resp, body, err := oauth2.GetAccessFromRefresh(refreshToken)
	if err != nil {
		util.SendInternalServerError(w)
		return
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}

func DeleteOAuth2TokenHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	ok, rd := util.GetRequestDetailsFromRequest(r)

	if !ok {
		util.SendUnauthorized(w, util.RequestDetailsFailedValidationMessage)
		return
	}

	resp, body, err := oauth2.Delete(rd)
	if err != nil {
		util.SendInternalServerError(w)
		return
	}

	util.HandleCanvasResponse(w, resp, body)
	return
}