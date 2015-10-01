angular.module('UsersLibrary')
    .controller('WeatherCtrl', ['$scope', '$rootScope', 'Weather', function($scope, $rootScope, Weather) {

    Weather.getAll()
    .success(function (data) {
        $scope.weather = data.weatherRes;

        if (data.username == 0 && typeof $rootScope.username === 'undefined') {
            $rootScope.username == '';
        } else {
            $rootScope.username = data.username;
        }
    });
}]);