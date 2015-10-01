angular.module('UsersLibrary', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
	.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	
		$locationProvider.html5Mode(true);

		$routeProvider
			.when('/homepage', {
				templateUrl: 'views/homepage.html',
				controller: 'HomepageCtrl'
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.when('/register', {
				templateUrl: 'views/register.html',
				controller: 'RegisterCtrl'
			})
			.when('/profile', {
				templateUrl: 'views/profile.html',
				controller: 'ProfileCtrl'
			})
			.when('/recovery', {
				templateUrl: 'views/recovery.html',
				controller: 'RecoveryCtrl'
			})
			.when('/changePassword', {
				templateUrl: 'views/changePassword.html',
				controller: 'ChangePasswordCtrl'
			})
		  	.otherwise({
		    	redirectTo: '/homepage'
		  	});
	}])
	
	.filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i=0; i < total; i++)
                input.push(i);
            return input;
        }
    });