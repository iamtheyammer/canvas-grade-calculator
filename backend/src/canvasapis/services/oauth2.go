package services

import (
	"fmt"
	"github.com/iamtheyammer/canvas-grade-calculator/backend/src/env"
	"net/http"
	"net/url"
)

func GetOAuth2AccessTokenFromRedirectResponse(
	code string,
) (*http.Response, string, error) {
	oauth2URL := url.URL{
		Host:   fmt.Sprintf("%s.instructure.com", env.OAuth2Subdomain),
		Path:   "/login/oauth2/token",
		Scheme: "https",
	}

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
	oauth2URL := url.URL{
		Host:   fmt.Sprintf("%s.instructure.com", env.OAuth2Subdomain),
		Path:   "/login/oauth2/token",
		Scheme: "https",
	}

	q := oauth2URL.Query()
	q.Set("grant_type", "refresh_token")
	q.Set("client_id", env.OAuth2ClientID)
	q.Set("client_secret", env.OAuth2ClientSecret)
	q.Set("refresh_token", rt)
	oauth2URL.RawQuery = q.Encode()

	return makePostRequest(oauth2URL.String())
}
