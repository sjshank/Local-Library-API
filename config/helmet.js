//Protect from 3rd party lib vulnerabilities. Set CSP header
const helmet = require("helmet");
// Add helmet to the middleware chain.
// Set CSP headers to allow any 3rd party libraries to be served
helmet({
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"], //sets custom options for the Content-Security-Policy
    },
  },
  crossOriginResourcePolicy: false, //disable the Cross-Origin-Resource-Policy
  xFrameOptions: { action: "sameorigin" }, // Sets "X-Frame-Options: SAMEORIGIN"
});

module.exports = helmet;
