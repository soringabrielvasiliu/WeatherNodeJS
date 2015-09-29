angular.module('UsersLibrary')

	// super simple service
	// each function returns a promise object 
	.factory('Homepage', ['$http', function($http) {
		return {
			get : function() {
				return $http.get('/api/homepage');
			}
		}
	}]);