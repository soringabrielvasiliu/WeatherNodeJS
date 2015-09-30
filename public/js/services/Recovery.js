angular.module('UsersLibrary')

	// super simple service
	// each function returns a promise object 
	.factory('Recovery', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			post : function() {
				return $http.post('/api/recovery');
			}
		}
	}]);