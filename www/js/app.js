(function () {

  var app = angular.module('myreddit', ['ionic', 'angularMoment']);

  app.controller('RedditCtrl', function ($scope, $http) {
    $scope.stories = [];

    function loadStories(params, callback) {
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
          callback(stories)
        });
    };
    $scope.loadOlderStories = function () {
      var params = {};
      if ($scope.stories.length > 0) {
        params['after'] = $scope.stories[$scope.stories.length - 1].name;
      }
      loadStories(params, function (olderStories) {
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };
    $scope.loadNewerStories = function () {
      var params = {};
      if ($scope.stories.length > 0) {
        params['before'] = $scope.stories[0].name;
      }
      loadStories(params, function (newerStories) { 
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.openLink = function(link) {
      window.open(link, '_blank');
    };
  });

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