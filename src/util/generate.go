package util

import (
	"fmt"
	"net/url"
)

func GenerateCanvasURL(path string, sd string) url.URL {
	return url.URL{
		Host:   fmt.Sprintf("%s.instructure.com", sd),
		Scheme: "https",
		Path:   path,
	}
}
