/* eslint-disable eol-last */
'use strict';
angular.module('bahmni.clinical').controller('PrintMasterCardController', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
        $scope.data = $rootScope.masterCardData;
    }]);