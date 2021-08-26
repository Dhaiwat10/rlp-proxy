# rlp-proxy

This is the source code for the proxy used in <a href='https://github.com/dhaiwat10/react-link-preview'>react-link-preview</a>.

Feel free to fork both the main package and this proxy and deploy your own copy of the project.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Dhaiwat10/rlp-proxy/tree/no-redis-caching)

## Environment variables & pre-requisites

1. `SERVER_URL`: The URL where your server is runnning (used for serving static files). For example, if you are running the server locally it will be `localhost:3000` and if your server is live at `abc.xyz`, the value for this variable will be `abc.xyz`. This variable is necessary to serve static files correctly.
