var spray = function(kind, name, amount, grainy, type){
        this.kind = kind;
        this.name = name;
        this.amount = amount;
        this.grainy = grainy;
        this.type = type;
    };

var myApp = angular.module('myApp', ['ngRoute', "ngTable", "checklist-model"]);
myApp
    
.controller('myCtrl', function($scope, myService){
    
})

.controller('sendingCtrl', function($scope, myService){

    $scope.order = [];
    $scope.isSubmit = true;

    $scope.submit = function() {
        if(!$scope.order.length){
             swal({
                        title: 'לא הזנת אף פריט לעדכון',
                        timer: 3000,
                        type : 'error'
                    })
        } else {
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
                        type : 'error'
                    })
                }
            }, {data : $scope.order});
        }   
    }

    $scope.addSprayToOrder = function(kind, size, name, amount, grainy, type) {
        if(!kind || !size || !name || !amount || !type){
            swal({
                        title: 'לא הזנת אף פריט לעדכון',
                        timer: 3000,
                        type : 'error'
                    })
        } else {
            $scope.order.push(new spray(kind, name, amount * size, grainy, type));
        }
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
    $scope.checkList = [];
    myService.getSomething('/getInventory', function(data){
        $scope.inventory = data.data;
    });

    $scope.sendToDelete = function() {
        if(!$scope.checkList.length){
            swal({
                        title: 'לא הזנת אף פריט למחיקה',
                        timer: 3000,
                        type : 'error'
                    })
        } else {
            myService.updateSomething('/deleteInventory',
                                 function(err){
                                     $scope.checkList = [];
                                     if (err.status == 200) {
                                        swal({
                                            title: '!הפעולה בוצעה בהצלחה',
                                            text: '.אשריך צדיק',
                                            timer: 3000,
                                            type : 'success'
                                        })
                                        $scope.inventory = [];
                                        myService.getSomething('/getInventory', function(data){
                                            $scope.inventory = data.data;
                                        });
                                    } else {
                                        swal({
                                            title: 'תקלה באמצע הדרך',
                                            text: 'אנא פנה לאיתמר לתמיכה',
                                            type : 'error'
                                        })
                                    }
                                 },
                                 {data : $scope.checkList});
        }
    }
})

.controller('orderCtrl', function($scope, myService){
    
    $scope.order = [];

    myService.getSomething('/getInventory', function(data){
        $scope.inventory = data.data;
    });

    $scope.addSprayToOrder = function(size, currSpray, amount) {
        var parsedSprayObj = JSON.parse(currSpray);
        if (!parsedSprayObj.kind ||
            !parsedSprayObj.name || 
            !size || 
            !amount || 
            !parsedSprayObj.type){
            swal({
                        title: 'לא הזנת אף פריט לעדכון',
                        timer: 3000,
                        type : 'error'
                    })
        } else {
            $scope.order.push(new spray(parsedSprayObj.kind, parsedSprayObj.name, amount * size, parsedSprayObj.grainy, parsedSprayObj.type));
        }
    }

    $scope.submit = function() {
        $scope.order.forEach(function(element) {
            element.amount *= -1;
        });
        
        if(!$scope.order.length){
             swal({
                        title: 'לא הזנת אף פריט לעדכון',
                        timer: 3000,
                        type : 'error'
                    })
        } else {
            $scope.isSubmit = false;
            myService.updateSomething('/updateInventory', function(err){
                $scope.isSubmit = true;
                $scope.order = [];
                if (err.status == 200) {
                    swal({
                        title: 'הפעולה בוצעה בהצלחה!',
                        text: 'אשריך צדיק.',
                        timer: 3000,
                        type : 'success'
                    })
                } else {
                    swal({
                        title: 'תקלה באמצע הדרך',
                        text: 'אנא פנה לאיתמר לתמיכה',
                        type : 'error'
                    })
                }
            }, {data : $scope.order});
        }   

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
                            },
            deleteSomthing : function(path, callback, data) {
                                $http.delete(path, data).then(function(status){
                                    callback(status);
                                }, function(err){
                                    console.log(err);
                                });
                            }
      }
});