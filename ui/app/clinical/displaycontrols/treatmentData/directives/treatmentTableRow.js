'use strict';

angular.module('bahmni.clinical')
    .directive('treatmentTableRow', ['$http', function ($http) {
        var controller = function ($scope) {
            $scope.showDetails = false;
            if ($scope.params.showProvider === undefined) {
                $scope.params.showProvider = true;
            }
            $scope.toggle = function () {
                $scope.showDetails = !$scope.showDetails;
            };

            var dispenseddrug = function () {
                $http.get(Bahmni.Common.Constants.dispenseDrugOrderUrl, {
                    params: {
                        locId: 17,
                        patientUuid: $scope.params.patientUuid
                    },
                    withCredentials: true
                }).then(function (results) {
                    var dispensedDrug = results.data;
                    console.log('aqui');
                    console.log(results);
                });
            };
            dispenseddrug();
        };
        return {
            restrict: 'A',
            controller: controller,
            scope: {
                drugOrder: "=",
                params: "="
            },
            templateUrl: "displaycontrols/treatmentData/views/treatmentTableRow.html"
        };
    }]);
