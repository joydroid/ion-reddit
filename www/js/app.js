(function () {

  var app = angular.module('myreddit', ['ionic', 'angularMoment']);

  app.controller('RedditCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {
    $scope.stories = [];

    function loadStories(params) {
      var d = $q.defer();
      var promise = d.promise;

      var stories = [];
      $http.get('https://www.reddit.com/r/android/new/.json', { 'params': params })
        .success(function (response) {
          angular.forEach(response.data.children, function (child) {
            var story = child.data;
            if (!story.thumbnail || story.thumbnail === 'self' || story.thumbnail === 'default') {
              story.thumbnail = 'https://www.redditstatic.com/icon.png';
            }
            stories.push(story);
          });
          d.resolve(stories);
        })
        .error(function(error) {
          d.reject(error);
        });
      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    };
    $scope.loadOlderStories = function () {
      console.log("loadOlderStories");
      var params = {};
      if ($scope.stories.length > 0) {
        params['after'] = $scope.stories[$scope.stories.length - 1].name;
      }
      var promise = loadStories(params);
      promise.then(function (olderStories) {
        $scope.stories = $scope.stories.concat(olderStories);
      }).catch(function(error) {
        console.log(error);
      }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };
    $scope.loadNewerStories = function () {
      console.log("loadNewerStories");
      var params = {};
      if ($scope.stories.length > 0) {
        params['before'] = $scope.stories[0].name;
      }
      var promise = loadStories(params);
      promise.then(function (newerStories) {
        $scope.stories = newerStories.concat($scope.stories);
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.openLink = function(link) {
      window.open(link, '_blank');
    };
  }]);

  app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.cordova && window.cordova.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

} ());
