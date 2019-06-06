'use strict';

angular.module('bahmni.common.conceptSet')
    .directive('concept', ['RecursionHelper', 'spinner', '$filter', 'messagingService',
        function (RecursionHelper, spinner, $filter, messagingService) {
            var link = function (scope) {
                var hideAbnormalbuttonConfig = scope.observation && scope.observation.conceptUIConfig && scope.observation.conceptUIConfig['hideAbnormalButton'];

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
                    var date="";
                     if (scope.observation.concept.name == 'Last Menstruation Date'){
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
            
                            if (currentObj.concept.name == 'Last Menstruation Date'){

                           currentEnteredDate=currentObj.value; 

                            }
                            if (currentObj.concept.name == 'Probable delivery date') {
                            
                                    if(scope.observation.value === true) {
                                    currentEnteredDate = moment(currentEnteredDate).add(9, 'M');
                                    currentEnteredDate = moment(currentEnteredDate).add(7, 'days');
                                    currentEnteredDate = moment(currentEnteredDate).format('YYYY-MM-DD');
                                    currentObj.value = currentEnteredDate;
                                }
                                else{
                                    currentObj.value = date;
                                }
                            
                                return currentObj;
                            }
                            return currentObj;
                        
                        });
                    }
                    scope.$root.$broadcast("event:observationUpdated-" + scope.conceptSetName, scope.observation.concept.name, scope.rootObservation);
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
