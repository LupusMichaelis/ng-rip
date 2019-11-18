'use strict';

angular.module('draftApp', [])
    .controller('DraftController', function($scope)
    {
        this.yourName = $scope.yourName || '';
        this.yourEmail = $scope.yourEmail || '';
    })
    .directive('tabs', () => (
        { restrict: 'E'
        , transclude: true
        , scope:
            {
            }
        , controller: function($scope)
            {
                var panes = $scope.panes = [];
                var tabIndex = $scope.tabIndex = 1;

                this.addPane = (pane) =>
                {
                    panes.length || $scope.switchTab(0);
                    panes.push(pane);
                }

                $scope.switchTab = (position) =>
                {
                    $scope.tabIndex = tabIndex = position;
                }
            }
        , template: `<div class='tabbable'>
                       <ul class='nav nav-tabs'>
                         <li ng-repeat='pane in panes'
                             ng-class='{active:$index == tabIndex}'
                             >
                           <span ng-click='switchTab($index)'>{{ pane.title }}</span>
                         </li>
                       </ul>
                       <div ng-transclude
                            class='tab-content'
                            />
                     </div>
                    `
        , replace: true
        })
    )
    .directive('pane', () => (
        { require: '^tabs'
        , restrict: 'E'
        , transclude: true
        , scope:
            { title: '@'
            }
        , link: (scope, element, attrs, tabsController) =>
            tabsController.addPane(scope)
        , template: `<div ng-transclude
                          class='tab-pane'
                          ng-class='{active: $index == tabIndex}'
                     />`
        , replace: true
        })
    )
;
