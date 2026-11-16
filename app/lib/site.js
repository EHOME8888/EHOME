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

// The three doors on the home page (components/AudienceCards.js), keyed by
// each card's `id` in the dictionary.
//
// Every one of these is a route the portal already serves; none is invented
// here. Sign-up carries the role in its path. Sign-in carries it as ?as=,
// which the portal's /login reads for a landlord and for a partner. A
// student is the portal's default door, so that link takes no parameter:
// /login ignores a value it does not know, and a made-up ?as=student would
// only look as though it did something.
export const PORTAL_ROUTES = {
  student:  { start: PORTAL_SIGNUP_URL,               signIn: PORTAL_LOGIN_URL },
  landlord: { start: `${PORTAL_URL}/signup/landlord`, signIn: `${PORTAL_LOGIN_URL}?as=landlord` },
  partner:  { start: `${PORTAL_URL}/signup/partner`,  signIn: `${PORTAL_LOGIN_URL}?as=partner` },
};
