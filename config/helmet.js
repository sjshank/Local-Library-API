//Protect from 3rd party lib vulnerabilities. Set CSP header
const helmet = require("helmet");
// Add helmet to the middleware chain.
// Set CSP headers to allow any 3rd party libraries to be served
helmet({
  contentSecurityPolicy: {
    // directives: {
    //   "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"], //sets custom options for the Content-Security-Policy
    // },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "blob:", "data:"],
        connectSrc: ["'self'", "'http://localhost:3000/'"],
        fontSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
  },
  xDnsPrefetchControl: { allow: true }, // DNS prefetching allowed
  xPoweredBy: false, //disable powered by framework info
  crossOriginResourcePolicy: false, //disable the Cross-Origin-Resource-Policy
  xFrameOptions: { action: "sameorigin" }, // Sets "X-Frame-Options: SAMEORIGIN"
  strictTransportSecurity: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: {
    policy: "no-referrer",
  },
});

module.exports = helmet;
