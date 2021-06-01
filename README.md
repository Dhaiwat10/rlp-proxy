# rlp-proxy

This is the source code for the proxy used in <a href='https://github.com/dhaiwat10/react-link-preview'>react-link-preview</a>.

Feel free to fork both the main package and this proxy and deploy your own copy of the project. :)

## What you'll need

• A Twitter v2 API Bearer Token. Get it <a href='https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api'>here</a>.

## Environment variables

1. `TW_BEARER_TOKEN`: Your Twitter v2 API Bearer Token

2. `SERVER_URL`: The URL where your server is runnning. For example, if you are running the server locally it will be `localhost:3000` and if your server is live at `abc.xyz`, the value for this variable will be `abc.xyz`. This variable is necessary to serve static files correctly.
