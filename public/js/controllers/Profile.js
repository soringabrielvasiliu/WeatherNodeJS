angular.module('UsersLibrary')  
    .controller('ProfileCtrl', ['$scope', '$routeParams', '$location',  '$http', 'Profile', function($scope, $routeParams, $location, $http, Profile) {
        // GET, POST =====================================================================
        // when landing on the page, get/post family details and show them
        // use the service to get/post all the family details

       
$scope.Profile;

Profile.get()
    .success(function(data) {
        if (data.username != null) {
        var temp = {};

        temp._id = data._id;
        temp.username = data.username;
        temp.email = data.email;

        $scope.Profile = temp; 
    } else $location.path('/login');
    });

// Profile.post()
//    .success(function(data) {})

}]);