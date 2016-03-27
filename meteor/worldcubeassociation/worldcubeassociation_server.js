WorldCubeAssociation = {};

// As of 2015-08-09, this list of fields the /api/v0/me route provides is
// currently undocumented. This list came from the worldcubeassociation.org
// source code, available here:
// https://github.com/cubing/worldcubeassociation.org/blob/master/WcaOnRails/app/controllers/api/v0/api_controller.rb#L15
WorldCubeAssociation.whitelistedFields = [
  'id',
  'name',
  'email',
  'wca_id',
  'dob',
  'gender',
  'country_iso2',
  'created_at',
  'updated_at',
  'avatar',
];

var querystring = Npm.require('querystring');


OAuth.registerService('worldcubeassociation', 2, null, function(query) {

  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  var identity = getIdentity(accessToken);

  var serviceData = {
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn)
  };

  var fields = _.pick(identity, WorldCubeAssociation.whitelistedFields);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {profile: {email: identity.email}},
  };
});

// Attempt to parse str as JSON, return null if it fails.
var tryParseJson = function (str) {
  try {
    return JSON.parse(str);
    return true;
  } catch (e) {
    return null;
  }
};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'worldcubeassociation'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var responseContent;
  try {
    // Request an access token
    responseContent = HTTP.post(
      "https://www.worldcubeassociation.org/oauth/token", {
        params: {
          grant_type: "authorization_code",
          client_id: config.appId,
          redirect_uri: OAuth._redirectUri('worldcubeassociation', config),
          client_secret: OAuth.openSecret(config.secret),
          code: query.code
        },
      }).content;
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with worldcubeassociation.org. " + err.message),
                   {response: err.response});
  }

  var parsedResponse = tryParseJson(responseContent);
  if (!parsedResponse) {
    throw new Error("Failed to complete OAuth handshake with worldcubeassociation.org. " + responseContent);
  }

  // Success! Extract the wca access token and expiration
  // time from the response.
  var wcaAccessToken = parsedResponse.access_token;
  var wcaExpiresIn = parsedResponse.expires_in;

  if (!wcaAccessToken) {
    throw new Error("Failed to complete OAuth handshake with worldcubeassociation.org " +
                    "-- can't find access token in HTTP response. " + responseContent);
  }
  return {
    accessToken: wcaAccessToken,
    expiresIn: wcaExpiresIn,
  };
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.get(
        "https://www.worldcubeassociation.org/api/v0/me", {
          params: {access_token: accessToken},
        }).data.me;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from worldcubeassociation.org. " + err.message),
                   {response: err.response});
  }
};

WorldCubeAssociation.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
