angular.module('UsersLibrary')
    .controller('HomepageCtrl', ['$scope', '$routeParams', '$rootScope', '$location', '$timeout', '$filter', '$http', 'Homepage', 'Weather', function($scope, $routeParams, $rootScope, $location, $timeout, $filter, $http, Homepage, Weather) {

    Homepage.get()
    .success(function(data){
    	console.log(data);
    	if (data.username == 0 && typeof $rootScope.username === 'undefined') {
    		$rootScope.username == '';
    	} else {
    		$rootScope.username = data.username;
    	}
    });

	Weather.get()
	.success(function(data) {
		console.log(data);
		$rootScope.weather = data;
	});
}]);