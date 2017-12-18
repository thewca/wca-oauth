/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  json = json.me;

  var profile = {};

  profile.id = json.id;
  profile.displayName = json.name;
  profile.emails = [{value: json.email}];

  if (json.avatar) {
    profile.photos = [{value: json.avatar.url}, {value: json.avatar.thumb_url}];
  } else {
    profile.photos = [];
  }
  
  // WCA specific
  profile.wca = {
    id: json.wca_id,
    dob: json.dob,
    region: json.region,
    senior_delegate_id: json.senior_delegate_id,
    teams: json.teams
  };

  return profile;
};
