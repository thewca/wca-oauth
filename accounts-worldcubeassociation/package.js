Package.describe({
  name: 'jfly:accounts-worldcubeassociation',
  version: '1.0.0',
  summary: 'An OAuth login service for worldcubeassociation.org',
  git: 'https://github.com/jfly/meteor-worldcubeassociation-oauth.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');

  api.use('ecmascript');
  api.use('jfly:worldcubeassociation@1.0.0');

  api.addFiles('accounts-worldcubeassociation.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('jfly:accounts-worldcubeassociation');
  api.addFiles('accounts-worldcubeassociation-tests.js');
});
