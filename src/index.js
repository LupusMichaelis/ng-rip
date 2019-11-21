'use strict';

angular.module('draftApp', [])
    .controller('CountryController', function($http, $scope)
    {
        $scope.all = [];
        $scope.sortCriterion = null;
        $scope.sortReverse = false;

        $scope.sortBy = (criterion) =>
            criterion === $scope.sortCriterion
                ? $scope.sortReverse = !$scope.sortReverse
                : $scope.sortCriterion = criterion
                ;

        const url = 'https://172.17.0.2/r/country'
        const headers =
            { 'content-type': 'application/json'
            };
        const mode = 'cors';

        $http
            .get(url, {headers, mode})
            .then(({data}) => $scope.all = data)
            .catch(error => console.error(error));
    })
    .controller('DraftController', function($scope)
    {
        $scope.yourName || '';
        $scope.yourEmail || '';
        $scope.yourContent || '';
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
                $scope.tabIndex = 0;

                this.addPane = (pane) =>
                {
                    $scope.panes.push(pane);

                    if(pane.isActive)
                        $scope.switchTab(pane);
                };

                $scope.switchTab = (pane) =>
                {
                    $scope.tabIndex < $scope.panes.length &&
                        ($scope.panes[$scope.tabIndex].isActive = false);
                    $scope.tabIndex = $scope.panes.indexOf(pane);
                    $scope.panes[$scope.tabIndex].isActive = true;
                }
            }
        , templateUrl: 'tabcontainer.html'
        , replace: true
        })
    )
    .directive('pane', () => (
        { require: '^tabs'
        , restrict: 'E'
        , transclude: true
        , scope:
            { title: '@'
            , active: '='
            }
        , link:
            ( scope
            , element
            , attrs
            , tabsController
            ) =>
                tabsController.addPane(scope)
        , templateUrl: 'tabpane.html'
        , replace: true
        })
    )
    .filter('bigNumber', () =>
    {
        const format =
        { 6: ''
        , 9: 'k'
        , 12: 'M'
        , 15: 'G'
        , 18: 'T'
        , 21: 'P'
        };

        return (input) =>
        {
            input += '';

            for(var limit in format)
                if(null === format[limit])
                {
                    if(input.length <= limit)
                        break;
                }
                else
                {
                    if(input.length <= limit)
                    {
                        input = input.slice(0, input.length - limit + 3)
                            + ' '
                            + input.slice(input.length - limit + 3, input.length - limit + 6)
                            + ( format[limit] ? ' ' + format[limit] : '')
                            ;
                        break;
                    }
                }

            return input;
        };
    })
;
