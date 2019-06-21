'use strict';

angular.module('bahmni.common.conceptSet')
    .directive('concept', ['RecursionHelper', 'spinner', '$filter', 'messagingService', '$http',
        function (RecursionHelper, spinner, $filter, messagingService, $http) {
            var height, weight, brachialPerimeter, bmi, data, key, isValidHeight;
            var link = function (scope) {
                var hideAbnormalbuttonConfig = scope.observation && scope.observation.conceptUIConfig && scope.observation.conceptUIConfig['hideAbnormalButton'];
                var currentUrl = window.location.href;
                if (scope.observation !== null && scope.observation !== undefined && currentUrl.includes("registration")) {
                    scope.observation.value = "";
                }
                if (scope.observation !== null && scope.observation !== undefined && currentUrl.includes("clinical")) {
                    if (scope.observation.concept.name === "WEIGHT" && (scope.observation.value === null || scope.observation.value === undefined)) {
                        scope.observation.value = scope.patient.weight;
                    }
                    if (scope.observation.concept.name === "HEIGHT" && (scope.observation.value === null || scope.observation.value === undefined)) {
                        scope.observation.value = scope.patient.height;
                    }
                }
                scope.now = moment().format("YYYY-MM-DD hh:mm:ss");
                scope.showTitle = scope.showTitle === undefined ? true : scope.showTitle;
                scope.hideAbnormalButton = hideAbnormalbuttonConfig == undefined ? scope.hideAbnormalButton : hideAbnormalbuttonConfig;
                scope.cloneNew = function (observation, parentObservation) {
                    observation.showAddMoreButton = function () {
                        return false;
                    };
                    var newObs = observation.cloneNew();
                    newObs.scrollToElement = true;
                    var index = parentObservation.groupMembers.indexOf(observation);
                    parentObservation.groupMembers.splice(index + 1, 0, newObs);
                    messagingService.showMessage("info", "A new " + observation.label + " section has been added");
                    scope.$root.$broadcast("event:addMore", newObs);
                };

                scope.removeClonedObs = function (observation, parentObservation) {
                    observation.voided = true;
                    var lastObservationByLabel = _.findLast(parentObservation.groupMembers, function (groupMember) {
                        return groupMember.label === observation.label && !groupMember.voided;
                    });

                    lastObservationByLabel.showAddMoreButton = function () { return true; };
                    observation.hidden = true;
                };

                scope.isClone = function (observation, parentObservation) {
                    if (parentObservation && parentObservation.groupMembers) {
                        var index = parentObservation.groupMembers.indexOf(observation);
                        return (index > 0) ? parentObservation.groupMembers[index].label == parentObservation.groupMembers[index - 1].label : false;
                    }
                    return false;
                };

                scope.isRemoveValid = function (observation) {
                    if (observation.getControlType() == 'image') {
                        return !observation.value;
                    }
                    return true;
                };

                scope.getStringValue = function (observations) {
                    return observations.map(function (observation) {
                        return observation.value + ' (' + $filter('bahmniDate')(observation.date) + ")";
                    }).join(", ");
                };

                scope.toggleSection = function () {
                    scope.collapse = !scope.collapse;
                };

                scope.isCollapsibleSet = function () {
                    return scope.showTitle == true;
                };

                scope.hasPDFAsValue = function () {
                    return scope.observation.value && (scope.observation.value.indexOf(".pdf") > 0);
                };

                scope.$watch('collapseInnerSections', function () {
                    scope.collapse = scope.collapseInnerSections && scope.collapseInnerSections.value;
                });
                scope.handleUpdate = function () {
                    var currentEnteredDate;
                    var currentValue;
                    var date = "";
                    if (scope.observation.concept.name == 'Last Menstruation Date') {
                        _.map(scope.rootObservation.groupMembers, function (currentObj) {
                            if (currentObj.concept.name == 'Probable delivery date') {
                                currentObj.value = date;
                                return currentObj;
                            }
                            if (currentObj.concept.name == 'Pregnancy_Yes_No') {
                                currentObj.value = null;
                                return currentObj;
                            }
                        });
                    }
                    if (scope.observation.concept.name == 'Pregnancy_Yes_No') {
                        _.map(scope.rootObservation.groupMembers, function (currentObj) {
                            if (currentObj.concept.name == 'Last Menstruation Date') {
                                currentEnteredDate = currentObj.value;
                            }
                            if (currentObj.concept.name == 'Probable delivery date') {
                                if (scope.observation.value === true) {
                                    currentEnteredDate = moment(currentEnteredDate).add(9, 'M');
                                    currentEnteredDate = moment(currentEnteredDate).add(7, 'days');
                                    currentEnteredDate = moment(currentEnteredDate).format('YYYY-MM-DD');
                                    currentObj.value = currentEnteredDate;
                                } else {
                                    currentObj.value = date;
                                }

                                return currentObj;
                            }
                            return currentObj;
                        });
                    }
                    scope.$root.$broadcast("event:observationUpdated-" + scope.conceptSetName, scope.observation.concept.name, scope.rootObservation);
                };

                var getPregnancyStatus = function (patientUuid) {
                    return $http.get(Bahmni.Common.Constants.observationsUrl, {
                        params: {
                            concept: "Pregnancy_Yes_No",
                            numberOfVisits: 1,
                            patientUuid: patientUuid
                        },
                        withCredentials: true
                    });
                };

                var getDeliveryDate = function (patientUuid) {
                    return $http.get(Bahmni.Common.Constants.observationsUrl, {
                        params: {
                            concept: "Date of Delivery",
                            numberOfVisits: 1,
                            patientUuid: patientUuid
                        },
                        withCredentials: true
                    });
                };

                var getAnswerObject = function (key, value) {
                    if (value) {
                        data = _.filter(_.map(scope.rootObservation.groupMembers, function (currentObj) {
                            if (currentObj.concept.name == 'Nutritional_States_new') {
                                return _.filter(_.map(currentObj.possibleAnswers, function (curObj) {
                                    if (curObj.name.name == key) {
                                        return curObj;
                                    }
                                }));
                            }
                        }));

                        _.map(scope.rootObservation.groupMembers, function (currentObj) {
                            if (currentObj.concept.name == 'Nutritional_States_new') {
                                scope.$apply(function () {
                                    currentObj.value = data[0][0];
                                });
                            }
                        });
                    }
                    else {
                        _.map(scope.rootObservation.groupMembers, function (currentObj) {
                            if (currentObj.concept.name == 'Nutritional_States_new') {
                                scope.$apply(function () {
                                    currentObj.value = undefined;
                                });
                            }
                        });
                    }
                };

                scope.updateNutritionalValue = async function () {
                    if (scope.conceptSetName == 'Clinical_Observation_form') {
                        var patientUuid = scope.patient.uuid;
                        var dataSource = " ";
                        var eligibleForBP = false;
                        var gender = scope.patient.gender;
                        var patientAgeYears = scope.patient.age;
                        var patientAgeDays = scope.patient.ageDays;
                        var patientAgeMonths = scope.patient.ageMonths;
                        var deliveryDateResponse;
                        var isPatientPregnant;
                        var ageToMonths = (patientAgeYears * 12) + patientAgeMonths;

                        if (scope.observation.concept.name == 'WEIGHT') {
                            weight = scope.observation.value;
                        }

                        if (scope.observation.concept.name == 'HEIGHT') {
                            height = scope.observation.value;
                        }

                        if (scope.observation.concept.name == 'Brachial_perimeter_new') {
                            brachialPerimeter = scope.observation.value;
                        }
                        if (weight && height) {
                            bmi = (weight / (height * height)) * 10000;
                        }

                        var pregnancyResponse = await getPregnancyStatus(patientUuid);

                        if (pregnancyResponse.data.length > 0) {
                            isPatientPregnant = pregnancyResponse.data[0].value;
                        }
                        var sixMonthsAgoDate;
                        deliveryDateResponse = await getDeliveryDate(patientUuid);
                        if (deliveryDateResponse.data.length > 0) {
                            deliveryDateResponse = deliveryDateResponse.data[0].value;
                        }

                        var actualDeliveryDate = moment(new Date(deliveryDateResponse));
                        var todayDate = moment(new Date());

                        sixMonthsAgoDate = moment(new Date()).subtract(6, 'M');

                        if (actualDeliveryDate.isBetween(sixMonthsAgoDate, todayDate)) {
                            eligibleForBP = true;
                        }

                        if (ageToMonths >= 6 && ageToMonths <= 59) {
                            eligibleForBP = true;
                        }

                        if (!height && !weight && !brachialPerimeter) {
                            getAnswerObject(key, null);
                            bmi = 0;
                            return;
                        }

                        if ((isPatientPregnant || eligibleForBP) && brachialPerimeter) {
                            if (brachialPerimeter >= 23) {
                                key = "CO_Normal";
                            }

                            if (brachialPerimeter >= 21 && brachialPerimeter < 23) {
                                key = "CO_SAM";
                            }

                            if (brachialPerimeter < 21) {
                                key = "CO_MAM";
                            }

                            getAnswerObject(key, brachialPerimeter);
                            return;
                        }
                        else if (bmi) {
                            if (patientAgeYears > 5) {
                                if (bmi < 16) {
                                    key = "CO_SAM";
                                }

                                if (bmi >= 16 && bmi <= 16.99) {
                                    key = "CO_MAM";
                                }

                                if (bmi >= 17 && bmi <= 18.49) {
                                    key = "Co_LAM";
                                }

                                if (bmi >= 18.5 && bmi <= 24.9) {
                                    key = "CO_Normal";
                                }

                                if (bmi >= 25 && bmi <= 29.9) {
                                    key = "CO_Overweight";
                                }

                                if (bmi >= 30 && bmi <= 34.9) {
                                    key = "CO_OneDO";
                                }

                                if (bmi > 35 && bmi <= 39.9) {
                                    key = "CO_TwoDO";
                                }

                                if (bmi >= 40) {
                                    key = "CO_ThreeDO";
                                }
                                getAnswerObject(key, bmi);
                            }
                            else if (patientAgeYears < 5) {
                                if (gender === "M") {
                                    dataSource = "twoToFiveMale";
                                    if (patientAgeYears < 2) {
                                        dataSource = "zeroToTwoMale";
                                    }
                                } else {
                                    dataSource = "twoToFiveFemale";
                                    if (patientAgeYears < 2) {
                                        dataSource = "zeroToTwoFemale";
                                    }
                                }

                                for (var i = 0; i < childrensBMI[dataSource].length; i++) {
                                    if (height == childrensBMI[dataSource][i].height) {
                                        isValidHeight = true;
                                        var severeObese = parseFloat(childrensBMI[dataSource][i].severe_obese.replace(",", "."));

                                        var obeseSplit = childrensBMI[dataSource][i].obese.split("-");
                                        var obeseMin = parseFloat(obeseSplit[0].replace(",", "."));
                                        var obeseMax = parseFloat(obeseSplit[1].replace(",", "."));

                                        var normalSplit = childrensBMI[dataSource][i].normal.split("-");
                                        var normalMin = parseFloat(normalSplit[0].replace(",", "."));
                                        var normalMax = parseFloat(normalSplit[1].replace(",", "."));

                                        var malnutritionSplit = childrensBMI[dataSource][i].malnutrition.split("-");
                                        var malnutritionMin = parseFloat(malnutritionSplit[0].replace(",", "."));
                                        var malnutritionMax = parseFloat(malnutritionSplit[1].replace(",", "."));

                                        var severeMalnutrition = parseFloat(childrensBMI[dataSource][i].severe_malnutrition.replace(",", "."));

                                        if (weight > severeObese) {
                                            key = "CO_Obese";
                                        }
                                        if (weight >= obeseMin && weight <= obeseMax) {
                                            key = "CO_Overweight";
                                        }
                                        if (weight >= normalMin && weight <= normalMax) {
                                            key = "CO_Normal";
                                        }
                                        if (weight >= malnutritionMin && weight <= malnutritionMax) {
                                            key = "CO_MAM";
                                        }
                                        if (weight < severeMalnutrition) {
                                            key = "CO_SAM";
                                        }
                                    }
                                }
                                getAnswerObject(key, weight);
                            }
                        }
                    }
                };

                scope.update = function (value) {
                    if (scope.getBooleanResult(scope.observation.isObservationNode)) {
                        scope.observation.primaryObs.value = value;
                    } else if (scope.getBooleanResult(scope.observation.isFormElement())) {
                        scope.observation.value = value;
                    }
                    scope.handleUpdate();
                };

                scope.getBooleanResult = function (value) {
                    return !!value;
                };
            };

            var compile = function (element) {
                return RecursionHelper.compile(element, link);
            };

            return {
                restrict: 'E',
                compile: compile,
                scope: {
                    conceptSetName: "=",
                    observation: "=",
                    atLeastOneValueIsSet: "=",
                    showTitle: "=",
                    conceptSetRequired: "=",
                    rootObservation: "=",
                    patient: "=",
                    collapseInnerSections: "=",
                    rootConcept: "&",
                    hideAbnormalButton: "="
                },
                templateUrl: '../common/concept-set/views/observation.html'
            };
        }]);
