'use strict';

angular.module('bahmni.registration')
    .controller('EditPatientController', ['$scope', 'patientService', 'encounterService', '$stateParams', 'openmrsPatientMapper',
        '$window', '$q', 'spinner', 'appService', 'messagingService', '$rootScope', 'auditLogService', 'patient', '$state',
        function ($scope, patientService, encounterService, $stateParams, openmrsPatientMapper, $window, $q, spinner,
                  appService, messagingService, $rootScope, auditLogService, patient, $state) {
            var dateUtil = Bahmni.Common.Util.DateUtil;
            var uuid = $stateParams.patientUuid;
            var configValueForEnterId = appService.getAppDescriptor().getConfigValue('showEnterID');
            $scope.showEnterID = configValueForEnterId === null ? true : configValueForEnterId;
            $scope.patient = {};
            $scope.actions = {};
            $scope.addressHierarchyConfigs = appService.getAppDescriptor().getConfigValue("addressHierarchy");
            $scope.disablePhotoCapture = appService.getAppDescriptor().getConfigValue("disablePhotoCapture");
            var mozambicanIdentifiers = appService.getAppDescriptor().getConfigValue("mozambicanIdentifiers", []);
            var foreignerIdentifiers = appService.getAppDescriptor().getConfigValue("foreignerIdentifiers", []);

            $scope.today = dateUtil.getDateWithoutTime(dateUtil.now());

            var editMozambicanIdentifiers = [];
            var editForeignerIdentifiers = [];
            $scope.dropdownMozambicanIdentifiers = [];
            $scope.dropdownForeignerIdentifiers = [];
            $scope.editSelectedMozambicanIdentifiers = [];
            $scope.editSelectedForeignerIdentifiers = [];
            var isSwitch = true;
            var mozambicanToRemoveArray = [];
            var foreignerToRemoveArray = [];
            var extraMozambicanIdentifiersSelectAll = [];
            var extraForeignerIdentifiersSelectAll = [];
            $scope.allMozambicanIdentifiersToDisplay = [];
            $scope.allForeignerIdentifiersToDisplay = [];

            $scope.$watch('patient.extraIdentifiers', function (newValue, oldValue, scope) {
                if (newValue != oldValue) {
                    $scope.allMozambicanIdentifiersToDisplay = _.map(newValue, function (obj, index) {
                        if (_.includes(mozambicanIdentifiers, obj.identifierType.name)) {
                            return obj;
                        }
                    });

                    $scope.allMozambicanIdentifiersToDisplay = _.filter($scope.allMozambicanIdentifiersToDisplay);

                    $scope.allForeignerIdentifiersToDisplay = _.map(newValue, function (obj, index) {
                        if (_.includes(foreignerIdentifiers, obj.identifierType.name)) {
                            return obj;
                        }
                    });

                    $scope.allForeignerIdentifiersToDisplay = _.filter($scope.allForeignerIdentifiersToDisplay);

                    $scope.dropdownMozambicanIdentifiers = angular.copy($scope.allMozambicanIdentifiersToDisplay);
                    $scope.dropdownForeignerIdentifiers = angular.copy($scope.allForeignerIdentifiersToDisplay);

                    var ingoreMozambicanIdentifiers = _.remove($scope.dropdownMozambicanIdentifiers, function (currentObj) {
                        return currentObj.hasOwnProperty("identifier");
                    });

                    _.map(ingoreMozambicanIdentifiers, function (currentObj) {
                        mozambicanToRemoveArray.push(currentObj.identifierType.name);
                    });

                    var ingoreForeignerIdentifiers = _.remove($scope.dropdownForeignerIdentifiers, function (currentObj) {
                        return currentObj.hasOwnProperty("identifier");
                    });

                    _.map(ingoreForeignerIdentifiers, function (currentObj) {
                        foreignerToRemoveArray.push(currentObj.identifierType.name);
                    });

                    editMozambicanIdentifiers = editMozambicanIdentifiers.filter(function (currentObj) {
                        return mozambicanToRemoveArray.indexOf(currentObj.identifierType.name) < 0;
                    });

                    editForeignerIdentifiers = editForeignerIdentifiers.filter(function (currentObj) {
                        return foreignerToRemoveArray.indexOf(currentObj.identifierType.name) < 0;
                    });

                    $scope.dropdownMozambicanIdentifiers = editMozambicanIdentifiers;
                    $scope.dropdownForeignerIdentifiers = editForeignerIdentifiers;

                    $scope.dropdownMozambicanIdentifiers = _.map($scope.dropdownMozambicanIdentifiers, function (obj, index) {
                        return _.pick(obj.identifierType, ['name']);
                    });
                    $scope.dropdownMozambicanIdentifiers = _.map($scope.dropdownMozambicanIdentifiers, function (obj, index) {
                        obj.id = index;
                        return obj;
                    });

                    $scope.dropdownForeignerIdentifiers = _.map($scope.dropdownForeignerIdentifiers, function (obj, index) {
                        return _.pick(obj.identifierType, ['name']);
                    });
                    $scope.dropdownForeignerIdentifiers = _.map($scope.dropdownForeignerIdentifiers, function (obj, index) {
                        obj.id = index;
                        return obj;
                    });

                    if (isSwitch) {
                        var originalRemove = _.remove($scope.patient.extraIdentifiers, function (currentObj) {
                            return !currentObj.hasOwnProperty("identifier");
                        });
                    }
                }
            });
            $scope.editPatientsAdditionalMozambicanIdentifiers = [];
            $rootScope.allExtraIdentifiers = [];
            var newMozambicanIdentifierObj = {};
            var tempMozambicanIdentifierObj = {};

            $scope.editPatientsMozambicanIdentifiersDropdownEvents = {
                onItemSelect: function (item) {
                    newMozambicanIdentifierObj = _.filter(editMozambicanIdentifiers, function (obj) {
                        if (obj.identifierType.name == item.name) {
                            obj.id = item.id;
                            return obj;
                        }
                    });
                    $scope.editPatientsAdditionalMozambicanIdentifiers.push(newMozambicanIdentifierObj[0]);
                },

                onItemDeselect: function (item) {
                    var removed = _.remove($scope.editPatientsAdditionalMozambicanIdentifiers, function (n) {
                        return n.id == item.id;
                    });
                },

                onSelectAll: function () {
                    $scope.editPatientsAdditionalMozambicanIdentifiers = [];
                    var copyExtraIdentifiersSelectAll = angular.copy(extraMozambicanIdentifiersSelectAll);
                    copyExtraIdentifiersSelectAll = copyExtraIdentifiersSelectAll.filter(function (currentObj, index) {
                        return mozambicanToRemoveArray.indexOf(currentObj.identifierType.name) < 0;
                    });

                    copyExtraIdentifiersSelectAll = _.map(copyExtraIdentifiersSelectAll, function (currentObj, index) {
                        currentObj.id = index;
                        return currentObj;
                    });
                    $scope.editPatientsAdditionalMozambicanIdentifiers = copyExtraIdentifiersSelectAll;
                },

                onDeselectAll: function () {
                    $scope.editPatientsAdditionalMozambicanIdentifiers = [];
                }
            };

            $scope.editPatientsAdditionalForeignerIdentifiers = [];
            var newForeignerIdentifierObj = {};
            var tempForeignerIdentifierObj = {};

            $scope.editPatientsForeignerIdentifiersDropdownEvents = {
                onItemSelect: function (item) {
                    newForeignerIdentifierObj = _.filter(editForeignerIdentifiers, function (obj) {
                        if (obj.identifierType.name == item.name) {
                            obj.id = item.id;
                            return obj;
                        }
                    });
                    $scope.editPatientsAdditionalForeignerIdentifiers.push(newForeignerIdentifierObj[0]);
                },

                onItemDeselect: function (item) {
                    var removed = _.remove($scope.editPatientsAdditionalForeignerIdentifiers, function (n) {
                        return n.id == item.id;
                    });
                },

                onSelectAll: function () {
                    $scope.editPatientsAdditionalForeignerIdentifiers = [];
                    var copyExtraIdentifiersSelectAll = angular.copy(extraForeignerIdentifiersSelectAll);
                    copyExtraIdentifiersSelectAll = copyExtraIdentifiersSelectAll.filter(function (currentObj, index) {
                        return foreignerToRemoveArray.indexOf(currentObj.identifierType.name) < 0;
                    });

                    copyExtraIdentifiersSelectAll = _.map(copyExtraIdentifiersSelectAll, function (currentObj, index) {
                        currentObj.id = index;
                        return currentObj;
                    });
                    $scope.editPatientsAdditionalForeignerIdentifiers = copyExtraIdentifiersSelectAll;
                },

                onDeselectAll: function () {
                    $scope.editPatientsAdditionalForeignerIdentifiers = [];
                }
            };

            var setReadOnlyFields = function () {
                $scope.readOnlyFields = {};
                var readOnlyFields = appService.getAppDescriptor().getConfigValue("readOnlyFields");
                angular.forEach(readOnlyFields, function (readOnlyField) {
                    if ($scope.patient[readOnlyField]) {
                        $scope.readOnlyFields[readOnlyField] = true;
                    }
                });
            };

            var successCallBack = function (openmrsPatient) {
                $scope.openMRSPatient = openmrsPatient["patient"];
                $scope.patient = openmrsPatientMapper.map(openmrsPatient);
                if ($scope.patient.birthdateEstimated == false) {
                    $scope.isBirthDateEstimatedDisabled = true;
                    $scope.isAgeDisabled = true;
                }
                if ($scope.patient.hasOwnProperty('SECTOR_SELECT')) {
                    if ($scope.patient['SECTOR_SELECT'].value == 'ATIP') {
                        $scope.isATIPSelectShown = true;
                    }
                }
                setReadOnlyFields();
                expandDataFilledSections();
                $scope.patientLoaded = true;
            };

            var expandDataFilledSections = function () {
                angular.forEach($rootScope.patientConfiguration && $rootScope.patientConfiguration.getPatientAttributesSections(), function (section) {
                    var notNullAttribute = _.find(section && section.attributes, function (attribute) {
                        return $scope.patient[attribute.name] !== undefined;
                    });
                    section.expand = section.expanded || (notNullAttribute ? true : false);
                });
            };

            (function () {
                var getPatientPromise = patientService.get(uuid).then(successCallBack);
                var editPatientData = patient.create();
                editMozambicanIdentifiers = editPatientData.extraIdentifiers;

                editMozambicanIdentifiers = _.map(editMozambicanIdentifiers, function (obj, index) {
                    if (_.includes(mozambicanIdentifiers, obj.identifierType.name)) {
                        return obj;
                    }
                });

                editMozambicanIdentifiers = _.filter(editMozambicanIdentifiers);

                editForeignerIdentifiers = editPatientData.extraIdentifiers;

                editForeignerIdentifiers = _.map(editForeignerIdentifiers, function (obj, index) {
                    if (_.includes(foreignerIdentifiers, obj.identifierType.name)) {
                        return obj;
                    }
                });

                editForeignerIdentifiers = _.filter(editForeignerIdentifiers);

                extraMozambicanIdentifiersSelectAll = angular.copy(editMozambicanIdentifiers);
                extraForeignerIdentifiersSelectAll = angular.copy(editForeignerIdentifiers);

                var isDigitized = encounterService.getDigitized(uuid);
                isDigitized.then(function (data) {
                    var encountersWithObservations = data.data.results.filter(function (encounter) {
                        return encounter.obs.length > 0;
                    });
                    $scope.isDigitized = encountersWithObservations.length > 0;
                });

                spinner.forPromise($q.all([getPatientPromise, isDigitized]));
            })();

            $scope.update = function () {
                isSwitch = false;

                if ($scope.editPatientsAdditionalMozambicanIdentifiers !== undefined) {
                    $scope.patient.extraIdentifiers = $scope.patient.extraIdentifiers.concat($scope.editPatientsAdditionalMozambicanIdentifiers);
                }

                if ($scope.editPatientsAdditionalForeignerIdentifiers !== undefined) {
                    $scope.patient.extraIdentifiers = $scope.patient.extraIdentifiers.concat($scope.editPatientsAdditionalForeignerIdentifiers);
                }
                addNewRelationships();
                var errorMessages = Bahmni.Common.Util.ValidationUtil.validate($scope.patient, $scope.patientConfiguration.attributeTypes);
                if (errorMessages.length > 0) {
                    errorMessages.forEach(function (errorMessage) {
                        messagingService.showMessage('error', errorMessage);
                    });
                    return $q.when({});
                }

                return spinner.forPromise(patientService.update($scope.patient, $scope.openMRSPatient).then(function (result) {
                    var patientProfileData = result.data;
                    if (!patientProfileData.error) {
                        successCallBack(patientProfileData);
                        $scope.actions.followUpAction(patientProfileData);
                    }
                    $scope.editPatientsAdditionalMozambicanIdentifiers = [];
                    $scope.dropdownMozambicanIdentifiers = [];

                    $scope.editPatientsAdditionalForeignerIdentifiers = [];
                    $scope.dropdownForeignerIdentifiers = [];

                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                }));
            };

            var addNewRelationships = function () {
                var newRelationships = _.filter($scope.patient.newlyAddedRelationships, function (relationship) {
                    return relationship.relationshipType && relationship.relationshipType.uuid;
                });
                newRelationships = _.each(newRelationships, function (relationship) {
                    delete relationship.patientIdentifier;
                    delete relationship.content;
                    delete relationship.providerName;
                });
                $scope.patient.relationships = _.concat(newRelationships, $scope.patient.deletedRelationships);
            };

            $scope.isReadOnly = function (field) {
                return $scope.readOnlyFields ? ($scope.readOnlyFields[field] ? true : false) : undefined;
            };

            $scope.afterSave = function () {
                auditLogService.log($scope.patient.uuid, Bahmni.Registration.StateNameEvenTypeMap['patient.edit'], undefined, "MODULE_LABEL_REGISTRATION_KEY");
                messagingService.showMessage("info", "REGISTRATION_LABEL_SAVED");
            };

            $scope.handleSectorChange = function () {
                if ($scope.patient['SECTOR_SELECT'].value == 'ATIP') {
                    $scope.isATIPSelectShown = true;
                }
                else {
                    $scope.isATIPSelectShown = false;
                    $scope.patient['ATIP_SELECT'] = null;
                }
            };
        }]);
