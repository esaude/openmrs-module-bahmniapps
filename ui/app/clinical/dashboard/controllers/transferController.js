/* eslint-disable eol-last */
'use strict';
angular.module('bahmni.clinical')
    .controller('transferController', ['$scope', '$rootScope',
    function ($scope, $rootScope) 
    {
        $scope.isTarvReport = $rootScope.isTarvReport;
        $scope.data = $rootScope.transferReportData;
    }]);