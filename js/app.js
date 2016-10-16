// Ionic Starter App

var jsonUrl = null;
var jsonData = null;
var qrData = null;
function handleOpenURL(url) {
  setTimeout(function () {
    jsonUrl = url;
    angular.element(document.getElementById('MyController')).scope().openModal();
    //alert("received: " + $rootScope);
    //$rootScope.$openModal();

    //$scope.$openModal();
    //$scope.$apply();
    //angular.element(document.getElementById('MyController')).injector().‌​get('$rootScope').openModal();
  }, 0);
}

function getJsonUrl() {
  return jsonUrl;
}

function openBoleto(){
  angular.element(document.getElementById('boleto')).scope().openModal();
}

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

  .controller("ExampleController", function($scope, $cordovaBarcodeScanner) {

    $scope.scanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(imageData) {

        var data = JSON.parse(imageData.text());
        var xhr = new XMLHttpRequest();
        var url = "http://api.salaera.com/receipts"
        var params = "?bundle="+ data.bundleId +"&auth_key="+ data.auth_key +"&transaction="+ data.ref_id;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            qrData = JSON.parse(xhr.responseText);
            handleOpenURL("qr");
          }
        }
        xhr.send(params);
      }, function(error) {
        console.log("An error happened -> " + error);
      });
    };

  })
.controller('MyController', function($scope, $ionicModal) {
  $ionicModal.fromTemplateUrl('login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})

  .controller('boleto', function($scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('boleto.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
  })

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $window) {
  $scope.data = {};

  $scope.login = function() {
    var xhr = new XMLHttpRequest();
    var url = "http://athmapi.westus.cloudapp.azure.com/athm/requestSession";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var json = JSON.parse(xhr.responseText);
        jsonData = json;
        openBoleto();

      }
    }

    var data = JSON.stringify({"commUsername":$scope.data.username,"commPassword":$scope.data.password});
    xhr.send(data);

    /*LoginService.loginUser().success(function(data) {

     $state.go('tab.dash');
     }).error(function(data) {
     var alertPopup = $ionicPopup.alert({
     title: 'Login failed!',
     template: 'Please check your credentials!'
     });
     });*/
  }
})

  .controller('BoletoCtrl', function($scope, LoginService, $ionicPopup, $state, $window) {
    $scope.data = {};

    $scope.requestPayment = function() {
      if(jsonUrl === "qr"){
        $scope.requestPaymentWeb();
      }else{
        var xhr = new XMLHttpRequest();
        var url = "http://athmapi.westus.cloudapp.azure.com/athm/requestPayment";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            var json2 = JSON.parse(xhr.responseText);
            json2.token = jsonData.token;
            json2.referenceId = getParameterByName("referenceId",jsonUrl);



            var str = Object.keys(json2).map(function(key){
              return encodeURIComponent(key) + '=' + encodeURIComponent(json2[key]);
            }).join('&');

            $window.location.href = getParameterByName("urlCallback",jsonUrl)+"?" + str;

            $scope.closeModal();

          }
        }

        var data = JSON.stringify({"token":jsonData.token,"phone":getParameterByName("phoneNumber",jsonUrl),"amount":getParameterByName("amount",jsonUrl)});
        xhr.send(data);
      }
    }

    $scope.cancelPayment = function () {
      $scope.closeModal();
    }

    $scope.requestPaymentWeb = function () {
      var xhr = new XMLHttpRequest();
      var url = "http://athmapi.westus.cloudapp.azure.com/athm/requestPayment";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);

          var str = Object.keys(data).map(function(key){
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
          }).join('&');

          var xhr = new XMLHttpRequest();
          var url = "http://api.salaera.com/receipts"
          var params = "?bundle="+ qrData.bundleId +"&auth_key="+ qrData.auth_key +"&transaction="+ qrData.ref_id+"&status=2&data="+str;
          xhr.open("POST", url, true);
          xhr.setRequestHeader("Content-type", "application/json");
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {

            }
          }
          xhr.send(params);

          $scope.closeModal();

        }
      }

      var data = JSON.stringify({"token":jsonData.token,"phone":qrData.phone,"amount":qrData.amount});
      xhr.send(data);
    }
  });





/*.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
    .state('tab.login', {
      url: '/login',
      views: {
        'tab-login': {
          templateUrl: 'templates/tab-login.html',
          controller: 'LoginCtrl'
        }
      }
    })
  $urlRouterProvider.otherwise('/login');
  });*/

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
