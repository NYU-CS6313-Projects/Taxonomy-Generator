viz.directive('details', function() {
  return {
    restrict: 'A   E',
    scope: {
        show: '=',
        data: '=',
        totals: '='
    },
    templateUrl: 'details.html',
    link: function(scope, element, attrs) {
        scope.hideModal = function(){
            scope.show = false;
        }
        
        scope.add = function(list) {
            list.push({word: scope.data.key, on:true});
            scope.$parent.load();
            scope.hideModal();
        }
    }
  };
});