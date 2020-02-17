'use strict';

angular.module('bahmni.clinical')
    .directive('treatmentData', ['treatmentService', 'appService', 'spinner', '$stateParams', '$q', 'treatmentConfig', '$http', function (treatmentService, appService, spinner, $stateParams, $q, treatmentConfig, $http) {
        var controller = function ($scope) {
            var Constants = Bahmni.Clinical.Constants;
            var defaultParams = {
                showListView: true,
                showRoute: false,
                showDrugForm: false,
                numberOfVisits: 1
            };
            $scope.params = angular.extend(defaultParams, $scope.params);

            var init = function () {
                var getToDate = function () {
                    return $scope.visitSummary.stopDateTime || Bahmni.Common.Util.DateUtil.now();
                };

                var programConfig = appService.getAppDescriptor().getConfigValue("program") || {};

                var startDate = null, endDate = null, getEffectiveOrdersOnly = false;
                if (programConfig.showDetailsWithinDateRange) {
                    startDate = $stateParams.dateEnrolled;
                    endDate = $stateParams.dateCompleted;
                    if (startDate || endDate) {
                        $scope.params.showOtherActive = false;
                    }
                    getEffectiveOrdersOnly = true;
                }

                var getDrugLine = function () {
                    var params = {
                        q: "bahmni.sqlGet.patientPrescriptions",
                        v: "full",
                        lang_unit: "pt",
                        lang_route: "pt",
                        lang_treatmentLine: "pt",
                        lang_frequency: "pt",
                        patientUuid: $scope.params.patientUuid
                    };
                    return $http.get('/openmrs/ws/rest/v1/bahmnicore/sql', {
                        method: "GET",
                        params: params,
                        withCredentials: true
                    });
                };

                return $q.all([treatmentConfig(), treatmentService.getPrescribedAndActiveDrugOrders($scope.params.patientUuid, $scope.params.numberOfVisits,
                    $scope.params.showOtherActive, $scope.params.visitUuids || [], startDate, endDate, getEffectiveOrdersOnly), getDrugLine()])
                    .then(function (results) {
                        var drugOrdersData = results[2].data;
                        var config = results[0];
                        var drugOrderResponse = results[1].data;

                        var createDrugOrderViewModel = function (drugOrder) {
                            return Bahmni.Clinical.DrugOrderViewModel.createFromContract(drugOrder, config);
                        };

                        for (var key in drugOrderResponse) {
                            drugOrderResponse[key] = drugOrderResponse[key].map(createDrugOrderViewModel);
                            for (var i = 0; i < drugOrdersData.length; i++) {
                                for (var j = 0; j < drugOrderResponse[key].length; j++) {
                                    if (drugOrdersData[i].uuid === drugOrderResponse[key][j].drug.uuid && drugOrdersData[i].visit_uuid === drugOrderResponse[key][j].visit.uuid) {
                                        drugOrderResponse[key][j].line_treatment = drugOrdersData[i].line_treatment;
                                        drugOrderResponse[key][j].dispensed_date = drugOrdersData[i].dispensed_date;
                                    }
                                }
                            }
                        }

                        var groupedByVisit = _.groupBy(drugOrderResponse.visitDrugOrders, function (drugOrder) {
                            return drugOrder.visit.startDateTime;
                        });
                        var treatmentSections = [];

                        for (var key in groupedByVisit) {
                            var values = Bahmni.Clinical.DrugOrder.Util.mergeContinuousTreatments(groupedByVisit[key]);
                            treatmentSections.push({visitDate: key, drugOrders: values});
                        }
                        if (!_.isEmpty(drugOrderResponse[Constants.otherActiveDrugOrders])) {
                            var mergedOtherActiveDrugOrders = Bahmni.Clinical.DrugOrder.Util.mergeContinuousTreatments(drugOrderResponse[Constants.otherActiveDrugOrders]);
                            treatmentSections.push({
                                visitDate: Constants.otherActiveDrugOrders,
                                drugOrders: mergedOtherActiveDrugOrders
                            });
                        }
                        $scope.treatmentSections = treatmentSections;
                        if ($scope.visitSummary) {
                            $scope.ipdDrugOrders = Bahmni.Clinical.VisitDrugOrder.createFromDrugOrders(drugOrderResponse.visitDrugOrders, $scope.visitSummary.startDateTime, getToDate());
                        }
                    });
            };

            $scope.initialization = init();
        };
        var link = function ($scope, element) {
            spinner.forPromise($scope.initialization, element);
        };

        return {
            restrict: 'E',
            controller: controller,
            link: link,
            scope: {
                params: "=",
                visitSummary: "=?"
            },
            templateUrl: "displaycontrols/treatmentData/views/treatmentData.html"
        };
    }]);
