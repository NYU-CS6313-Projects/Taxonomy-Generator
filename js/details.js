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
    }
  };
});