angular.module('UsersLibrary')
	.factory('Weather', ['$http', function($http) {
		return {
			get : function () {
				return $http.get('/api/weather');
			},
			getAll : function () {
				return $http.get('/api/allWeatherData');
			},
			sendLocation : function (location) {
				return $http.post('/api/getWeatherByLocation', location);
			}
		}
	}]);