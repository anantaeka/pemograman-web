var app = angular.module("App", []);

NgEnter.add(app);

app.controller("AppCtrl", function($scope, $http) {
  //set up variables on the "view model" (for binding to the view)
  $scope.archived = [];
  $scope.tags = [];
  $scope.tagCloud = [ ];
  $scope.searchString = "";

  $http({ method: 'GET', url: '/tags' })
    .success(function(tags) {
      $http({ method: 'GET', url: '/archived' })
        .success(function(data) {
          _.each(data, function(d) {
            d.show = true;

            if(tags[d.id_str]) { d.tags = tags[d.id_str]; }
            else { d.tags = ""; }
          });

          $scope.tagCloud = TagCloud.create(data);

          $scope.archived = data;
        });
    });

  $scope.edit = function(tweet) { tweet.editing = true; };

  $scope.saveTags = function(tweet) {
    $http.post('/tag', { id_str: tweet.id_str, tags: tweet.tags })
      .success(function(data, status, headers, config) {
        tweet.editing = false;

        $scope.tagCloud = TagCloud.create($scope.archived);
      });
  };

  $scope.markDeleted = function(tweet) {
    $http.post('/markDeleted', tweet)
      .success(function(data, status, headers, config) {
        $scope.archived.splice($scope.archived.indexOf(tweet), 1);

        $scope.tagCloud = TagCloud.create($scope.archived);
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
    _.each($scope.archived, function(s) {
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
