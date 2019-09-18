package services

import (
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/env"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/util"
	"net/http"
)

func GetOAuth2AccessTokenFromRedirectResponse(
	code string,
) (*http.Response, string, error) {
	oauth2URL := util.GenerateCanvasURL("/login/oauth2/token", env.OAuth2Subdomain)

	q := oauth2URL.Query()
	q.Set("grant_type", "authorization_code")
	q.Set("client_id", env.OAuth2ClientID)
	q.Set("client_secret", env.OAuth2ClientSecret)
	q.Set("code", code)
	oauth2URL.RawQuery = q.Encode()

	return makePostRequest(oauth2URL.String())
}

func GetOAuth2AccessTokenFromRefreshToken(
	rt string,
) (*http.Response, string, error) {
	oauth2URL := util.GenerateCanvasURL("/login/oauth2/token", env.OAuth2Subdomain)

	q := oauth2URL.Query()
	q.Set("grant_type", "refresh_token")
	q.Set("client_id", env.OAuth2ClientID)
	q.Set("client_secret", env.OAuth2ClientSecret)
	q.Set("refresh_token", rt)
	oauth2URL.RawQuery = q.Encode()

	return makePostRequest(oauth2URL.String())
}

func DeleteOAuth2Token(
	rd *util.RequestDetails,
) (*http.Response, string, error) {
	deleteTokenURL := util.GenerateCanvasURL("/login/oauth2/token", env.OAuth2Subdomain)

	q := deleteTokenURL.Query()
	q.Set("access_token", rd.Token)
	deleteTokenURL.RawQuery = q.Encode()

	return makeDeleteRequest(deleteTokenURL.String())
}