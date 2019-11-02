# canvas-grade-calculator

Calculates Grades for CBL courses on [Instructure Canvas](https://github.com/instructure/canvas-lms). Note that this repository no longer powers [canvascbl.com](https://canvascbl.com).

[![Build Status](https://travis-ci.com/iamtheyammer/canvas-grade-calculator.svg?branch=master)](https://travis-ci.com/iamtheyammer/canvas-grade-calculator)

To do so, it contains a Golang proxy to add CORS headers to Canvas's API and handle the OAuth2 flow, along with a React/Redux frontend using [antd (Ant Design)](https://ant.design). Still very, very much in an alpha state.

See the [Backend README](backend/README.md) and [Frontend README](frontend/README.md) for more information.

You can also check out [img/](img/) for some screenshots.

# Running on Heroku

Ready to run! Clone the repo and follow Heroku's instructions.

## Heroku Build Process

1. Heroku builds the go executable to `bin/src` (where `src` is the actual executable)
2. Heroku runs the build step in `/package.json` - runs `make herokunode` (installs frontend packages, builds frontend, copies static files to `bin/build`)
3. Heroku runs `web`, declared in the Procfile.
