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
    var spray = function(name, amount, grainy, type){
        this.name = name;
        this.amount = amount;
        this.grainy = grainy;
        this.type = type;
    };

    $scope.order = [];
    $scope.isSubmit = true;

    $scope.submit = function() {
        $scope.isSubmit = false;
        myService.updateSomething('/sendSending', function(err){
            $scope.isSubmit = true;
            $scope.order = [];
            if (err.status == 200) {
                swal({
                    title: '!הפעולה בוצעה בהצלחה',
                    text: '.אשריך צדיק',
                    timer: 3000,
                    type : 'success'
                })
            } else {
                swal({
                    title: 'תקלה באמצע הדרך',
                    text: 'אנא פנה לאיתמר לתמיכה',
                    timer: 3000,
                    type : 'error'
                })
            }
        }, {data : $scope.order});   
    }

    $scope.addSprayToOrder = function(name, amount, grainy, type) {
        $scope.order.push(new spray(name, amount, returnNumberFromBoolean(grainy), type));
    }
    
    function removeSpray(element) {
        var tempArray = [];

        for (var i = 0; i < $scope.order.length; i++){
            if ($scope.order[i] != element){
                tempArray.push($scope.order[i]);
            }
        }
        
        $scope.order = tempArray;
    }
    $scope.remove = function(currSpray){
        delete currSpray.$$hashKey;
        removeSpray(currSpray);
    }
})

.controller('inventoryCtrl', function($scope, myService){
    myService.getSomething('/getInventory', function(data){
        $scope.inventory = data.data;
    });
})

.controller('orderCtrl', function($scope, myService){
    var spray = function(name, amount, grainy, type, currAmount){
        this.name = name;
        this.amount = amount;
        this.grainy = grainy;
        this.type = type;
        this.currAmount = currAmount;
    };
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