angular.module('UsersLibrary')
    .controller('ChangePasswordCtrl', ['$scope', '$routeParams', '$http', 'ChangePassword', function($scope, $routeParams, $http, ChangePassword) {
    // GET, POST =====================================================================
    // when landing on the page, get/post family details and show them
    // use the service to get/post all the family details

	$scope.errorCode = $routeParams.error;
}]);