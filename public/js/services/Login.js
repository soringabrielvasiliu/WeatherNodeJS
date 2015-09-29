angular.module('UsersLibrary')

	// super simple service
	// each function returns a promise object 
	.factory('Login', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get : function() {
				return $http.get('/api/login');
			},
			post : function() {
				return $http.post('/api/login');
			}
		}
	}]);