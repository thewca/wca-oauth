 // Load modules.
 var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError



/**
 * `Strategy` constructor.
 *
 * The WCA authentication strategy authenticates requests by delegating to
 * WCA using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your WCA application's Client ID
 *   - `clientSecret`  your WCA application's Client Secret
 *   - `callbackURL`   URL to which WCA will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request. Valid scopes include:
 *                     'email', 'public', 'dob', 'email', 'manage_competitions' or none.
 *   — `userAgent`     All API requests MUST include a valid User Agent string.
 *                     e.g: domain name of your application.
 *
 * Examples:
 *
 *     passport.use(new WCAStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         callbackURL: 'https://www.example.net/auth/wca/callback',
 *         userAgent: 'myapp.com'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.worldcubeassociation.org/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://www.worldcubeassociation.org/oauth/token';
  options.scopeSeparator = options.scopeSeparator || ' ';
  options.customHeaders = options.customHeaders || {};

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-wca';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'wca';
  this._userProfileURL = options.userProfileURL || 'https://www.worldcubeassociation.org/api/v0/me';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from WCA.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `wca`
 *   - `id`               the user's WCA ID
 *   - `username`         the user's WCA username
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on WCA
 *   - `emails`           the user's email addresses
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  var self = this;

  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json

    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      done(ex);
    }

    var profile = Profile.parse(json)
    profile.provider = 'wca';

    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;