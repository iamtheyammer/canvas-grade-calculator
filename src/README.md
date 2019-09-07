# Canvas Proxy API

Written in Golang for maximum speed.

## Headers

### Request

There are two headers for each request to `/api/canvas/*`:

- `X-Canvas-Token`
    - Auth token for Canvas. Required for all requests except for OAuth2.
- `X-Canvas-Subdomain` (optional-- see [env vars](#environment-variables) for more info)
    - Subdomain for Canvas-- so `hello` would make calls to `hello.instructure.com`.

### Response

Two headers are returned from every request:

- `X-Canvas-Url` is returned from every request. It contains the URL that the proxy called. Helpful for debugging. Note that this header is always `omitted` for OAuth2 calls.
- `X-Canvas-Status-Code` contains the status code returned from the proxied call to Canvas.

If an error occurred, a `502 BAD GATEWAY` status will be returned from the proxy, except for OAuth2 calls.

## Endpoints

No query string parameters from Canvas or otherwise, except otherwise noted, are supported.

### Outcomes

- `GET` `/api/canvas/outcomes/:outcomeID` - Mirror of [this](https://canvas.instructure.com/doc/api/outcomes.html#method.outcomes_api.show) Canvas endpoint.

### Users

- `GET` `/api/canvas/users/profile/self` - Mirror of [this](https://canvas.instructure.com/doc/api/users.html#method.users.api_show) Canvas endpoint, with `:id` replaced with `self`.

### Courses

- `GET` `/api/canvas/courses` - Mirror of [this](https://canvas.instructure.com/doc/api/courses.html#method.courses.index) Canvas endpoint.
- `GET` `/api/canvas/courses/:courseID/outcome_groups` - Mirror of [this](https://canvas.instructure.com/doc/api/outcome_groups.html#method.outcome_groups_api.index) Canvas endpoint.
- `GET` `/api/canvas/courses/:courseID/outcome_groups/:outcomeGroupID/outcomes` - Mirror of [this](https://canvas.instructure.com/doc/api/outcome_groups.html#method.outcome_groups_api.outcomes) Canvas endpoint.
- `GET` `/api/canvas/courses/:courseID/outcome_results` - Mirror of [this](https://canvas.instructure.com/doc/api/outcome_results.html#method.outcome_results.index) Canvas endpoint.
  - Requires the [`userId` param](#userId-param)
  - Supports the `includes[]` query param from Canvas
- `GET` `/api/canvas/courses/:courseID/outcome_rollups` - Mirror of [this](https://canvas.instructure.com/doc/api/outcome_results.html#method.outcome_results.rollups) Canvas endpoint.
  - Requires the [`userId` param](#userId-param)
  - Supports the `includes[]` query param from Canvas

### `userId` param

Sets the `user_ids[]` param to the value of the `userId` param. It should be equal to the ID of the user the token is for. This is required because students only have permission to list their own outcome results, and this endpoint defaults to listing results for all students. Ex: `userId=12345`

## OAuth2

The backend supports proxying OAuth2 requests and responses to the frontend.

### OAuth2 Endpoints

See the two below sections about Redirect URI Query String Params for handling the response data.

- `GET` `/api/canvas/oauth2/request` - Redirects the user to the Canvas OAuth2 grant page, injecting your client ID and other applicable query string params. A user would be redirected to this URL.
  - No params.
- `GET` `/api/canvas/oauth2/response` - Should be the OAuth2 response URI. Handles the error/success Canvas OAuth2 response. A user would be redirected to this URL by Canvas. You should **not** use this endpoint.
  - Params will include those from Canvas, so either `code` or `error`.
- `GET` `/api/canvas/oauth2/refresh_token` - Retrieves a new token based on a refresh token.
  - Params:
    - `refresh_token`: your refresh token


### Normal (successful) Redirect URI Query String Params

In the event of a successful grant from Canvas, two query string parameters will be in the URL to the Redirect URI.

- `canvas_response` - contains the JSON payload from the Canvas token grant (examples [here](https://canvas.instructure.com/doc/api/file.oauth_endpoints.html))
- `subdomain` - the subdomain from the OAuth2 token grant

### Error Redirect URI Query String Params

In the event of an OAuth2 error, the user will be redirected to the Redirect URI, however some special query params will be present.

Note that the `X-Canvas-Url` header will be present on errors, but it will just contain `omitted` as to not leak the client secret.

Those query params:

- `error` - either the error string from Canvas, or `proxy_canvas_error`
- `error_source` - `proxy`|`canvas`
- `canvas_status_code` - the status code from the proxied request to Canvas
- `body` - if Canvas returns a JSON body (currently not a possibility, but supported for future expansion on Canvas's side), this will contain the body, raw. Otherwise, this will contain `html_omitted`


## Environment Variables

Some environment variables are required to start the proxy server.

```sh
# Contains your Canvas OAuth2 Client ID
export CANVAS_OAUTH2_CLIENT_ID="canvasoauth2clientid"

# Contains your Canvas OAuth2 Client Secret
export CANVAS_OAUTH2_CLIENT_SECRET="canvasoauth2clientsecret"

# The subdomain that will be handling OAuth2
export CANVAS_OAUTH2_SUBDOMAIN="canvas"

# The Redirect URI. You should add your host here instead of localhost:8000, and replace http with https
export CANVAS_OAUTH2_REDIRECT_URI="http://localhost:8000/api/canvas/oauth2/response"

# Success URI-- where users will be redirected to-- see the normal query string section in the OAuth2 section.
export CANVAS_OAUTH2_SUCCESS_URI="http://localhost:3000/#/oauth2response"

# Allowed CORS origins-- should NEVER be * on a production server. Sites that are allowed to make proxied requests. Can be * to allow requests from everywhere, or be like "google.com, example.com" to allow requests from google.com and example.com.
export CANVAS_PROXY_ALLOWED_CORS_ORIGINS="*"

# Allowed Canvas subdomains-- should NEVER be * on a production server. Also probably should match your OAuth2 Subdomain. Comma separated. Ex: "canvas,myschool" to allow canvas.instructure.com and myschool.instructure.com. Also can be * to allow all, but that will throw a warning.
export CANVAS_PROXY_ALLOWED_SUBDOMAINS="*"

# Your default Canvas subdomain for non-OAuth2 requests. Should probably match your OAuth2 subdomain and MUST be in your allowed subdomains list.
export CANVAS_PROXY_DEFAULT_SUBDOMAIN="canvas"
```
