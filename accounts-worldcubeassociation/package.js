Package.describe({
  name: 'jfly:accounts-worldcubeassociation',
  version: '1.1.1',
  summary: 'An OAuth login service for worldcubeassociation.org',
  git: 'https://github.com/jfly/meteor-worldcubeassociation-oauth.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');

  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use('jfly:worldcubeassociation@1.1.0', ['client', 'server']);
  api.use('underscore', 'server');

  api.addFiles('worldcubeassociation_login_button.css', 'client');

  api.addFiles("worldcubeassociation.js");
});

