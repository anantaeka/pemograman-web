var app = angular.module("App", []);

NgEnter.add(app);

app.controller("AppCtrl", function($scope, $http) {
  $scope.inbox = [];
  $scope.tags = [];
  $scope.tagCloud = [ ];
  $scope.searchString = "";

  $http({ method: 'GET', url: '/tags' })
    .success(function(tags) {
      $http({ method: 'GET', url: '/inbox' })
        .success(function(data) {
          _.each(data, function(d) {
            d.show = true;

            if(tags[d.id_str]) { d.tags = tags[d.id_str]; }
            else { d.tags = ""; }
          });

          $scope.tagCloud = TagCloud.create(data);

          $scope.inbox = data;
        });
    });

  $scope.edit = function(tweet) { tweet.editing = true; };

  $scope.saveTags = function(tweet) {
    $http.post('/tag', { id_str: tweet.id_str, tags: tweet.tags })
      .success(function(data, status, headers, config) {
        tweet.editing = false;

        $scope.tagCloud = TagCloud.create($scope.inbox);
      });
  };

  $scope.markSorted = function(tweet) {
    if(tweet.tags == "") {
      tweet.tags = "needs-tag!";
      $scope.saveTags(tweet);
    };

    $http.post('/markSorted', tweet)
      .success(function(data, status, headers, config) {
        $scope.inbox.splice($scope.inbox.indexOf(tweet), 1);

        $scope.tagCloud = TagCloud.create($scope.inbox);
      });
  };

  $scope.unfavorite = function(tweet) {
    $http.post('/unfavorite', tweet)
      .success(function(data, status, headers, config) {
        $scope.inbox.splice($scope.inbox.indexOf(tweet), 1);

        $scope.tagCloud = TagCloud.create($scope.inbox);
      });
  };

  $scope.sortTag = TagCloud.sort;

  $scope.clearSearch = function() {
    $scope.searchString = "";
    $scope.search();
  };

  $scope.filterOnTag = function(entry) {
    $scope.searchString = entry.tag;
    $scope.search();
  };

  $scope.search = function() {
    _.each($scope.inbox, function(s) {
      if(s.text.match(new RegExp($scope.searchString, "i"))) {
        s.show = true;
      } else if (s.tags.match(new RegExp($scope.searchString, "i"))) {
        s.show = true;
      } else {
        s.show = false;
      }
    });
  };
});
