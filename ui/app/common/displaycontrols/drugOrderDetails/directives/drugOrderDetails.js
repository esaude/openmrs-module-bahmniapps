'use strict';

angular.module('bahmni.common.displaycontrol.drugOrderDetails')
    .directive('drugOrderDetails', ['treatmentService', 'spinner', 'treatmentConfig', '$q', '$http', function (treatmentService, spinner, treatmentConfig, $q, $http) {
        var controller = function ($scope) {
            var init = function () {
                return $q.all([treatmentService.getAllDrugOrdersFor($scope.patient.uuid, $scope.section.dashboardConfig.drugConceptSet, undefined, undefined, $scope.enrollment),
                    treatmentConfig(), getDrugLine()])
                    .then(function (results) {
                        var createDrugOrder = function (drugOrder) {
                            var treatmentConfig = results[1];
                            return Bahmni.Clinical.DrugOrderViewModel.createFromContract(drugOrder, treatmentConfig);
                        };
                        var drugOrderResponse = results[0];
                        var drugOrdersData = results[2].data;
                        var drugOrders = drugOrderResponse.map(createDrugOrder);

                        for (var j = 0; j < drugOrders.length; j++) {
                            for (var i = 0; i < drugOrdersData.length; i++) {
                                if (drugOrdersData[i].uuid === drugOrders[j].drug.uuid) {
                                    drugOrders[j].line_treatment = drugOrdersData[i].line_treatment;
                                }
                            }
                            drugOrders[j].dispensed_date = drugOrdersData[j].dispensed_date;
                        }
                        $scope.drugOrders = sortOrders(drugOrders);
                        if (_.isEmpty($scope.drugOrders)) {
                            $scope.$emit("no-data-present-event");
                        }
                    });
            };

            var getDrugLine = function () {
                var params = {
                    q: "bahmni.sqlGet.patientPrescriptions",
                    v: "full",
                    lang_unit: "pt",
                    lang_route: "pt",
                    lang_treatmentLine: "pt",
                    lang_frequency: "pt",
                    patientUuid: $scope.patient.uuid
                };
                return $http.get('/openmrs/ws/rest/v1/bahmnicore/sql', {
                    method: "GET",
                    params: params,
                    withCredentials: true
                });
            };

            $scope.columnHeaders = [
                "DRUG_DETAILS_DRUG_NAME",
                "DRUG_DETAILS_DOSE_INFO",
                "DRUG_DETAILS_QUANTITY_TEXT",
                "DRUG_DETAILS_ROUTE",
                "DRUG_DETAILS_FREQUENCY",
                "DRUG_DETAILS_START_DATE",
                "DRUG_DETAILS_DISPENSED_DATE",
                "DRUG_DETAILS_INSTRUCTIONS_TEXT",
                "LINE_TREATMENT"
            ];

            $scope.showDetails = false;
            $scope.toggle = function (drugOrder) {
                drugOrder.showDetails = !drugOrder.showDetails;
            };

            var sortOrders = function (response) {
                var drugOrderUtil = Bahmni.Clinical.DrugOrder.Util;
                var sortedDrugOrders = [];
                if ($scope.section.dashboardConfig.showOnlyActive) {
                    var activeAndScheduled = _.filter(response, function (order) {
                        return order.isActive() || order.isScheduled();
                    });
                    sortedDrugOrders.push(drugOrderUtil.sortDrugOrdersInChronologicalOrder(activeAndScheduled));
                } else {
                    sortedDrugOrders.push(drugOrderUtil.sortDrugOrdersInChronologicalOrder(response));
                }
                return _.flatten(sortedDrugOrders);
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
                section: "=",
                patient: "=",
                enrollment: "="
            },
            templateUrl: "../common/displaycontrols/drugOrderDetails/views/drugOrderDetails.html"
        };
    }]);
