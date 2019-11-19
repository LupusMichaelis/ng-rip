'use strict';

angular.module('draftApp', [])
    .controller('DraftController', function($scope)
    {
        this.yourName = $scope.yourName || '';
        this.yourEmail = $scope.yourEmail || '';
        this.yourContent = $scope.yourContent || '';
    })
    .directive('tabs', () => (
        { restrict: 'E'
        , transclude: true
        , scope:
            {
            }
        , controller: function($scope)
            {
                $scope.panes = [];
                $scope.tabIndex = 1;

                this.addPane = (pane) =>
                {
                    $scope.panes.length || $scope.switchTab(0);
                    1 === $scope.panes.length && (pane.selected = true);
                    $scope.panes.push(pane);
                };

                $scope.switchTab = (position) =>
                    $scope.tabIndex = position;

                $scope.isActivePane = (pane) =>
                    $scope.tabIndex == $scope.panes.indexOf(pane);
            }
        , template: `<div class='tabbable'>
                       <ul class='nav nav-tabs'>
                         <li ng-repeat='pane in panes'
                           class='nav-item'
                           ng-class='{active:$index == tabIndex}'
                           >
                           <a
                             class='nav-link'
                             ng-click='switchTab($index)'
                             >{{ pane.title }}</a>
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
                          ng-class='{active: selected}'
                     />`
        , replace: true
        })
    )
;
