# Canvas Proxy API

Written in Golang for maximum speed over JS.

## Headers

### Request

There are two headers for each request to `/api/canvas/*`:

- `X-Canvas-Token`
    - Auth token for Canvas
- `X-Canvas-Subdomain`
    - Subdomain for Canvas-- so `hello` would make calls to `hello.instructure.com`.
    
### Response

`X-Canvas-Url` is returned from every request. It contains the URL that the proxy called. Helpful for debugging.

If an error occurred, a `502 BAD GATEWAY` status will be returned from the proxy. The body will contain the body
from Canvas, and `X-Canvas-Status-Code` will contain the status code from the request to Canvas.