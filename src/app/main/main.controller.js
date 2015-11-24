(function() {
  'use strict';

  angular
    .module('macrofy')
    .controller('MainController', MainController);

function MainController($scope, SearchLocation, $state){
  var self = this;
  self.foods = null;
  self.searchCriteria = {};
  self.resturantList = ['McDonald\'s', 'Burger King', 'Subway', 'Chipotle Mexican Grill', 'Checkers',
             'Wendys', 'Taco Bell', 'Five Guys Burgers and Fries', 'Quiznos', 'Dunkin\' Donuts',
              'Au Bon Pain', 'Domino\'s Pizza', 'Pizza Hut', 'Starbucks'];
  
  // get postions and get restaunts near position
  self.onSearch = function(searchCriteria) {
    
  //  $scope.$emit('load')
    SearchLocation.getFoodsForPosition(searchCriteria, self.resturantList, function(results) {
      
      if(results){
        console.log('done');
        self.foods=results;
        
        $state.go('results');
        console.log(self.foods);
      }
      //$scope.$emit('unload')
      
    });
    
    //$state.go('results', {myParam: self.results});
  };
}
  // /** @ngInject */
  // function MainController($timeout, webDevTec, toastr) {
    



  //   var vm = this;

  //   vm.awesomeThings = [];
  //   vm.classAnimation = '';
  //   vm.creationDate = 1448222934606;
  //   vm.showToastr = showToastr;

  //   activate();

  //   function activate() {
  //     getWebDevTec();
  //     $timeout(function() {
  //       vm.classAnimation = 'rubberBand';
  //     }, 4000);
  //   }

  //   function showToastr() {
  //     toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
  //     vm.classAnimation = '';
  //   }

  //   function getWebDevTec() {
  //     vm.awesomeThings = webDevTec.getTec();

  //     angular.forEach(vm.awesomeThings, function(awesomeThing) {
  //       awesomeThing.rank = Math.random();
  //     });
  //   }
  // }
})();
