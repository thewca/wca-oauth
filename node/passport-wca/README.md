# Passport-WCA

[Passport](http://passportjs.org/) strategy for authenticating with [WCA](https://worldcubeassociation.org/)
using the OAuth 2.0 API.

This module lets you authenticate using WCA in your Node.js applications. By plugging into Passport, WCA authentication can be easily and unobtrusively integrated into any application or framework that supports [Connect](http://www.senchalabs.org/connect/)-style middleware, including [Express](http://expressjs.com/).

## Install

```
$ npm install passport-wca
```

## Usage

#### Configure Strategy

The WCA authentication strategy authenticates users using a WCA account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts these credentials and calls `done` providing a user, as well as `options` specifying a client ID, client secret, and callback URL.

The `state` flag turns on a valuable protection against login CSRF attacks, but is reliant on sessions being enabled. If you're using sessions, you should set the flag and get a layer of defense for free. If you set the flag and no session exists, an error will be thrown.

```js
passport.use(new WCAStrategy({
    clientID: WCA_CLIENT_ID,
    clientSecret: WCA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/wca/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ wcaUserId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

## Notes

A user will have 2 different IDs. They have a WCA User ID and a WCA ID. Every user will have a WCA User ID, they have one if they have made a wca account. This is accessed at `profile.id` A WCA ID is granted if they have gone to a WCA competition and have official results. This WCA ID points to a WCA profile. If they have a WCA ID, you'll find it in `profile.wca.id`. 

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'wca'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

```js
app.get('/auth/wca',
  passport.authenticate('wca'));

app.get('/auth/wca/callback',
  passport.authenticate('wca', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Tests

```no-highlight
$ npm install --dev
$ npm run test
```

## Credits

  - [Caleb Hoover](http://github.com/coder13)
  - Based on various implementations of passport strategies
