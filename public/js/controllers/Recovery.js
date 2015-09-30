angular.module('UsersLibrary')
    .controller('RecoveryCtrl', ['$scope', '$routeParams', '$http', 'Recovery', function($scope, $routeParams, $http, Recovery) {
    // GET, POST =====================================================================
    // when landing on the page, get/post family details and show them
    // use the service to get/post all the family details

	$scope.errorCode = $routeParams.error;
}]);