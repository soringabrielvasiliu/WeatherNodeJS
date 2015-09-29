angular.module('UsersLibrary')

	// super simple service
	// each function returns a promise object 
	.factory('Register', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			// get : function() {
			// 	return $http.get('/api/register');
			// },
			post : function() {
				return $http.post('/api/register');
			}
		}
	}]);