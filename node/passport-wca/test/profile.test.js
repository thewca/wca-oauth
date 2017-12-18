/* global describe, it, expect, before */
/* jshint expr: true */

var fs = require('fs')
  , parse = require('../lib/profile').parse;


describe('profile.parse', function() {

  describe('example profile', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/data/example.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });

    it('should parse profile', function() {
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
  });

  describe('example profile with null wca_id', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/data/example-null-wca_id.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal(8184);
      expect(profile.displayName).to.equal('Caleb Hoover');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('8184@worldcubeassociation.org');
      expect(profile.wca.id).to.equal(null);
      expect(profile.wca.region).to.equal('USA (Washington)');
      expect(profile.wca.senior_delegate_id).to.equal(259);
      expect(profile.wca.teams).to.have.length(1);
      expect(profile.wca.teams[0].friendly_id).to.equal('wst');
      expect(profile.wca.teams[0].leader).to.equal(false);
    });
  });

});