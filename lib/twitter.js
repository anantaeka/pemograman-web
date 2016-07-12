
var OAuth = require('oauth').OAuth;
var qs = require('qs');
var _ = require('underscore');
var env = process.env;

function Twitter() {
    this.consumerKey = env.consumerKey;
    this.consumerSecret = env.consumerSecret;
    this.accessToken = env.accessToken;
    this.accessTokenSecret = env.accessTokenSecret;
    this.callBackUrl = env.callBackUrl;
    this.baseUrl = 'https://api.twitter.com/1.1';
    this.oauth = new OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        this.consumerKey,
        this.consumerSecret,
        '1.0',
        this.callBackUrl,
        'HMAC-SHA1'
    );
}

var mappings = [
  { name: "tweets", url:'/statuses/user_timeline.json' },
  { name: "following", url: '/friends/list.json' },
  { name: "favorites", url: '/favorites/list.json' },
  { name: "rates", url: '/application/rate_limit_status.json' }
];

_.each(mappings, function(map) {
  Twitter.prototype[map.name] = function (params, error, success) {
      var path = map.url  + this.buildQS(params);
      var url = this.baseUrl + path;
      this.doGetRequest(url, error, success);
  };
});

Twitter.prototype.show = function(tweet_url, error, success) {
  console.log(tweet_url);
  var str_id = _.last(tweet_url.split('/'));
  var path = '/statuses/show/' + str_id + '.json';
  var url = this.baseUrl + path;
  this.doGetRequest(url, error, success);
};

Twitter.prototype.unfavorite = function(params, body, error, success) {
  var path = "/favorites/destroy.json" + this.buildQS(params);
  var url = this.baseUrl + path;
  this.doPostRequest(url, body, error, success);
};

Twitter.prototype.getOAuthRequestToken = function (next) {
    this.oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log('ERROR: ' + error);
            next();
        }
        else {
            var oauth = {};
            oauth.token = oauth_token;
            oauth.token_secret = oauth_token_secret;
            console.log('oauth.token: ' + oauth.token);
            console.log('oauth.token_secret: ' + oauth.token_secret);
            next(oauth);
        }
    });
};
Twitter.prototype.getOAuthAccessToken = function (oauth, next) {
    this.oauth.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
                                   function (error, oauth_access_token, oauth_access_token_secret, results) {
        if (error) {
            console.log('ERROR: ' + error);
            next();
        } else {
            oauth.access_token = oauth_access_token;
            oauth.access_token_secret = oauth_access_token_secret;

            console.log('oauth.token: ' + oauth.token);
            console.log('oauth.token_secret: ' + oauth.token_secret);
            console.log('oauth.access_token: ' + access_token.token);
            console.log('oauth.access_token_secret: ' + oauth.access_token_secret);
            next(oauth);
        }
    }
                                  );
}

Twitter.prototype.doGetRequest = function (url, error, success) {
    this.oauth.get(url, this.accessToken, this.accessTokenSecret, function (err, body, response) {
        console.log('GET [%s]', url);
        if (!err && response.statusCode == 200) {
            success(JSON.parse(body));
        } else {
            error(err, response, body);
        }
    });
};

Twitter.prototype.doPostRequest = function (url, params, error, success) {
    console.log('POST [%s]', url);
    console.log('params %s', JSON.stringify(params));

    this.oauth.post(url,this.accessToken, this.accessTokenSecret, params, function(err, body, response) {
        if (!err && response.statusCode == 200) {
            success(JSON.parse(body));
        } else {
            error(err, response, body);
        }
    });
};

Twitter.prototype.buildQS = function (params) {
    if (params && Object.keys(params).length > 0) {
        return '?' + qs.stringify(params);
    }
    return '';
};

if (!(typeof exports === 'undefined')) {
    exports.Twitter = Twitter;
}

