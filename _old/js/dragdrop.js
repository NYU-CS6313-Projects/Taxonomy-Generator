var  dragdrop=angular.module('common.dragdrop', [])

dragdrop.factory('DragDropHandler', [function() {
    return {
        dragObject: undefined,
        addObject: function(object, objects, to) {
            objects.splice(to, 0, object);
        },
        moveObject: function(objects, from, to) {
            objects.splice(to, 0, objects.splice(from, 1)[0]);
        }
    };
}])

dragdrop.directive('draggable', ['DragDropHandler', function(DragDropHandler) {
    return {
        scope: {
            draggable: '='
        },
        link: function(scope, element, attrs){
            element.draggable({
                connectToSortable: attrs.draggableTarget,
                helper: "clone",
                start: function() {
                    DragDropHandler.dragObject = scope.draggable;
                },
                stop: function() {
                    DragDropHandler.dragObject = undefined;
                }
            });

            element.disableSelection();
        }
    };
}])

dragdrop.directive('droppable', ['DragDropHandler', function(DragDropHandler) {
        return {
            scope: {
                droppable: '=',
                ngMove: '&',
                ngCreate: '&'
            },
            link: function(scope, element, attrs){
                element.sortable({
                  connectWith: ['.draggable','.sortable'],
                });
                element.disableSelection();
                var list = element.attr('id');
                element.on("sortupdate", function(event, ui) {
    
                    var from = angular.element(ui.item).scope().$index;
                    var to = element.children().index(ui.item);
                    
                    if (to >= 0 ){
                      //item is moved to this list
                        scope.$apply(function(){
                            if (from >= 0) {
                              //item is coming from a sortable
                              
                              if (!ui.sender) {
                                //item is coming from this sortable
                                  DragDropHandler.moveObject(scope.droppable, from, to);
    
                              } else {
                                //item is coming from another sortable
                                scope.ngMove({
                                    from: from,
                                    to: to,
                                    fromList: ui.sender.attr('id'),
                                    toList: list
                                });
                                ui.item.remove();
                              }
                            } else {
                              //item is coming from a draggable
                                scope.ngCreate({
                                    object: DragDropHandler.dragObject,
                                    to: to,
                                    list: list
                                });
    
                                ui.item.remove();
                            }
                        });
                    }
                });
    
            }
        };
    }]);
