var spray = function(name, amount, grainy, type, currAmount){
        this.name = name;
        this.amount = amount;
        this.grainy = grainy;
        this.type = type;
        this.currAmount = currAmount;
};

function returnNumberFromBoolean(bool){
    return (bool ? 1 : 0);
}

var myApp = angular.module('myApp', ['ngRoute', "ngTable"]);
myApp
    
.controller('myCtrl', function($scope, myService){
    
})

.controller('sendingCtrl', function($scope, myService){
    $scope.inventory = [];
    $scope.order = [];
    $scope.submit = function() {
        myService.getSomething('/getInventory', function(data){
        $scope.inventory = data.data;

            $scope.order.forEach(function(element) {
                
                    myService.updateSomething('/insertInventory',
                                function(err, data){
                                    console.log(err, data);
                                },
                                {data : element});         
                // } else {
                //      myService.updateSomething('/updateInventory',
                //                 function(err, data){
                //                     console.log(err, data);
                //                 },
                //                 {data : element});
                // }
            });
        
        });   
    }

    $scope.addSprayToOrder = function(name, amount, grainy, type, currAmount) {
        $scope.order.push(new spray(name, amount, returnNumberFromBoolean(grainy), type, currAmount));
    }
    
})

.controller('inventoryCtrl', function($scope, myService){
    myService.getSomething('/getInventory', function(data){
        $scope.inventory = data.data;
    });
})

.controller('orderCtrl', function($scope, myService){

    $scope.order = [];

    myService.getSomething('/getInventory', function(data){
        $scope.inventory = data.data;
    });

    $scope.addSprayToOrder = function(currSpray, amount) {
        var parsedSprayObj = JSON.parse(currSpray);
        $scope.order.push(new spray(parsedSprayObj.name, amount, parsedSprayObj.grainy, parsedSprayObj.amount));
    }

    $scope.submit = function() {
        console.log('entered');
    }
})

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/order', {
        templateUrl: '../view/order.html',
        controller: 'orderCtrl'
      }).
      when('/update', {
        templateUrl: '../view/sending.html',
        controller: 'sendingCtrl'
      }).
      when('/inventory', {
        templateUrl: '../view/inventory.html',
        controller: 'inventoryCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }])
  .service('myService', function($http){
      return{
            getSomething : function(path, callback){
                                $http.get(path).then(function(data){
                                    callback(data);
                                }, function(err){
                                   console.log(err);
                                });
                            },
            updateSomething : function(path, callback, data) {
                                $http.post(path, data).then(function(data){
                                    callback(data);
                                }, function(err){
                                  console.log(err);
                                });
                            }
      }
});