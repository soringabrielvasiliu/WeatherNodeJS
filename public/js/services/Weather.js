angular.module('UsersLibrary')

	// super simple service
	// each function returns a promise object 
	.factory('Weather', ['$http', '$routeParams', function($http, $routeParams) {
		return {
			get:function(){
				return $http.get('/api/weather')
			}
		}
	}]);