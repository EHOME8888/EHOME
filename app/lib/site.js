// app/lib/site.js
// Where the marketing site hands over to the client portal.
//
// One constant, because the hand-off now happens from the nav, the hero and
// the closing call to action, and a portal URL that is right in two of those
// three places is worse than one that is wrong in all of them.
//
// Non-www 308s to www; linking straight to the canonical host saves the
// redirect on the most important click on the site.
export const PORTAL_URL = "https://www.ehome-portal.com";
export const PORTAL_SIGNUP_URL = `${PORTAL_URL}/signup`;
export const PORTAL_LOGIN_URL = `${PORTAL_URL}/login`;
