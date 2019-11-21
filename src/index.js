'use strict';

const app = angular.module('draftApp', []);

app
    .component
        ( 'countries'
        ,
            { templateUrl: 'countries.html'
            , controller: function ($http)
                {
                    this.all = [];
                    this.sortCriterion = null;
                    this.sortReverse = false;

                    this.sortBy = (criterion) =>
                        criterion === this.sortCriterion
                            ? this.sortReverse = !this.sortReverse
                            : this.sortCriterion = criterion
                            ;

                    const url = 'https://172.17.0.2/r/country'
                    const headers =
                        { 'content-type': 'application/json'
                        };
                    const mode = 'cors';
                    const that = this;

                    $http
                        .get(url, {headers, mode})
                        .then(({data}) => that.all = data)
                        .catch(error => console.error(error));
                }
            }
        );

app
    .controller('DraftController', function($scope)
    {
        this.yourName || '';
        this.yourEmail || '';
        this.yourContent || '';
    });

app
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

                const trueValues =
                    [ ''
                    ];

                this.addPane = (pane) =>
                {
                    const isActiveByDefault =
                        ('isActive' in pane
                            && true === pane.isActive
                            || ('string' === typeof pane['default']
                                && -1 !== trueValues.indexOf(pane['default'])));

                    $scope.panes.push(pane);

                    if(isActiveByDefault)
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
            , default: '@'
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
    );

app
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
