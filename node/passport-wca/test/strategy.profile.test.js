/* global describe, it, expect, before */
/* jshint expr: true */

var WCAStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {

  var strategy =  new WCAStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});

  // mock
  strategy._oauth2.get = function(url, accessToken, callback) {
    console.log(accessToken)
    if (url != 'https://www.worldcubeassociation.org/api/v0/me') { return callback(new Error('wrong url argument')); }
    if (accessToken != 'token') { return callback(new Error('wrong token argument')); }

    var body = '{ "me": { "class": "user", "url": "https://staging.worldcubeassociation.org/persons/2016HOOV01", "id": 8184, "wca_id": "2016HOOV01", "name": "Caleb Hoover", "gender": "m", "country_iso2": "US", "delegate_status": "candidate_delegate", "created_at": "2016-01-12T23:29:21.000Z", "updated_at": "2017-12-18T19:54:10.000Z", "teams": [ { "friendly_id": "wst", "leader": false } ], "avatar": { "url": "https://staging.worldcubeassociation.org/assets/missing_avatar_thumb-f0ea801c804765a22892b57636af829edbef25260a65d90aaffbd7873bde74fc.png", "thumb_url": "https://staging.worldcubeassociation.org/assets/missing_avatar_thumb-f0ea801c804765a22892b57636af829edbef25260a65d90aaffbd7873bde74fc.png", "is_default": true }, "dob": "1954-12-04", "email": "8184@worldcubeassociation.org", "region": "USA (Washington)", "senior_delegate_id": 259 } }'

    callback(null, body, undefined);
  };

  describe('loading profile', function() {
    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('wca');

      expect(profile.id).to.equal(8184);
      expect(profile.displayName).to.equal('Caleb Hoover');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('8184@worldcubeassociation.org');
      expect(profile.wca.id).to.equal('2016HOOV01');
      expect(profile.wca.region).to.equal('USA (Washington)');
      expect(profile.wca.senior_delegate_id).to.equal(259);
      expect(profile.wca.teams).to.have.length(1);
      expect(profile.wca.teams[0].friendly_id).to.equal('wst');
      expect(profile.wca.teams[0].leader).to.equal(false);
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });

  describe('encountering an error', function() {
    var err, profile;

    before(function(done) {
      strategy.userProfile('wrong-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
    });

    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  });

});