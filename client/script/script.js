var myApp = angular.module('myApp', ['ngRoute']);
myApp
    
.controller('myCtrl', function($scope, myService){
    
})

.controller('orderCtrl', function($scope, myService){

    myService.getSomething('/getInventory', function(data){
        $scope.inventory = data;
    });

    
})

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/order', {
        templateUrl: '../view/order.html',
        controller: 'orderCtrl'
      }).
      when('/update', {
        templateUrl: '../view/update.html',
        controller: 'updateCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }])
  .service('myService', function($http){
      return{
            getSomething : function(path, callback){
                                $http.get(path).then(function(data){
                                    callback(data.data[0].inventory);
                                }, function(data){
                                   callback(data);
                                });
                            } 
      }
});