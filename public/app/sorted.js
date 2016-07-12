var app = angular.module("App", []);

NgEnter.add(app);

app.controller("AppCtrl", function($scope, $http) {
  $scope.sorted = [];
  $scope.tags = [];
  $scope.tagCloud = [ ];
  $scope.searchString = "";
  $scope.importUrl = "";

  $http({ method: 'GET', url: '/tags' })
    .success(function(tags) {
      $http({ method: 'GET', url: '/sorted' })
        .success(function(data) {
          _.each(data, function(d) {
            d.show = true;

            if(tags[d.id_str]) { d.tags = tags[d.id_str]; }
            else { d.tags = ""; }
          });

          $scope.tagCloud = TagCloud.create(data);

          $scope.sorted = data;
        });
    });

  $scope.edit = function(tweet) { tweet.editing = true; };

  $scope.saveTags = function(tweet) {
    $http.post('/tag', { id_str: tweet.id_str, tags: tweet.tags })
      .success(function(data, status, headers, config) {
        tweet.editing = false;
        $scope.tagCloud = TagCloud.create($scope.sorted);
      });
  };

  $scope.importTweet = function() {
    $http.post('/import', { tweet_url: $scope.importUrl })
      .success(function(tweet, status, headers, config) {
        if(tweet.statusCode == 404) {
          $scope.importUrl = "not found";
        } else {
          $scope.importUrl = "";
          tweet.tags = "imported";
          $scope.sorted.unshift(tweet);
          $scope.tagCloud = TagCloud.create($scope.sorted);
          $scope.searchString = "imported";
          $scope.search();
        }
      });
  };

  $scope.markArchived = function(tweet) {
    $http.post('/markArchived', tweet)
      .success(function(data, status, headers, config) {
        $scope.sorted.splice($scope.sorted.indexOf(tweet), 1);

        $scope.tagCloud = TagCloud.create($scope.sorted);
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
    _.each($scope.sorted, function(s) {
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
