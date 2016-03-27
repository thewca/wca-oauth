Package.describe({
  name: 'jfly:worldcubeassociation',
  version: '1.2.2',
  summary: 'World Cube Association OAuth flow',
  git: 'https://github.com/cubing/wca-oauth.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');

  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('WorldCubeAssociation');

  api.addFiles(
    ['worldcubeassociation_configure.html', 'worldcubeassociation_configure.js'],
    'client');

  api.addFiles('worldcubeassociation_server.js', 'server');
  api.addFiles('worldcubeassociation_client.js', 'client');
});
