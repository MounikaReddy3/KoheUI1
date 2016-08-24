var app = angular.module('portal', [])
    .controller("AppCtrl", function ($scope) {

app.config(function($stateProvider) {
    $stateProvider
        .state('login', {
        url : '/login',
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl'
    })
        .state('Dashboard', {
        url : '/Dashboard',
        templateUrl: 'Dashboard/main.html',
        controller: 'MainCtrl'
    })
        .state('resetPwd', {
        url : '/resetPwd',
        templateUrl: 'resetpassword/resetpassword.html',
       // controller: 'ResetController'
    })
        .state('changePwd', {
        url : '/changePwd',
        templateUrl: 'Change_Password/changepassword.html',
        // controller: 'ChangeController'
    })
        .state('contactus', {
        url : '/contactus',
        templateUrl: 'Contactus/contactus.html',
        //controller: 'ContactCtrl'
    });
    $stateProvider.otherwise({ redirectTo: '/login' });
});

app.run(function(authentication, $rootScope, $location) {
    $rootScope.$on('$stateChangeStart', function(evt) {
       // if(!authentication.isAuthenticated){
          //  $location.url("/login");
       // }
       // event.preventDefault();
    });
})

app.controller('LoginCtrl', function($scope, $http, $location, authentication) {
    $scope.login = function() {

        var username = $scope.username;

        $http({
            method: 'GET',
            url: 'http://localhost:8080/Project/Rest/timeportal/login?username=' +username
        }).then(function successCallback(response) {
            var Results = angular.fromJson(response.data)[0];

            var userName = Results.username;
            var role = Results.role;
            var passWord = Results.password;

            if ($scope.username === userName && $scope.password === passWord) {

                console.log('successful')
                authentication.isAuthenticated = true;
                authentication.user = {name: $scope.username};
                $location.url("/Dashboard");
            }
            else {
                $scope.loginError = "Invalid username/password";
                console.log('Login failed..');
            }
            ;

        }, function errorCallback(response) {

        });


    };
});

app.controller('AppCtrl', function($scope, $httpBackend, $http, authentication) {
    $scope.templates =
        [
            { url: 'login.html' },
            { url: 'home.html' }
        ];

    $scope.template = $scope.templates[0];
    $scope.login = function (username, password) {
        if ( username === 'admin' && password === '1234') {


            authentication.isAuthenticated = true;
            $scope.template = $scope.templates[1];
            $scope.user = username;
        } else {
            $scope.loginError = "Invalid username/password combination";
        };
    };

});

app.controller('MainCtrl', function($scope, authentication) {
    $scope.username = authentication.username;

});

app.factory('authentication', function() {
    return {
        isAuthenticated: false,
        user: null
    }
});
    });