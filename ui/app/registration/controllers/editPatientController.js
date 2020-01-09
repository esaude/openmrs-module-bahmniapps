'use strict';

angular.module('bahmni.registration')
    .controller('EditPatientController', ['$scope', 'patientService', 'encounterService', '$stateParams', 'openmrsPatientMapper',
        '$window', '$q', 'spinner', 'appService', 'messagingService', '$rootScope', 'auditLogService', '$state',
        function ($scope, patientService, encounterService, $stateParams, openmrsPatientMapper, $window, $q, spinner,
            appService, messagingService, $rootScope, auditLogService, $state) {
            var dateUtil = Bahmni.Common.Util.DateUtil;
            var uuid = $stateParams.patientUuid;
            $scope.patient = {};
            $scope.actions = {};
            $scope.myForms = {};
            $scope.NID = {};
            $scope.currentYear = new Date().getFullYear();
            $scope.addressHierarchyConfigs = appService.getAppDescriptor().getConfigValue("addressHierarchy");
            $scope.disablePhotoCapture = appService.getAppDescriptor().getConfigValue("disablePhotoCapture");
            $scope.today = dateUtil.getDateWithoutTime(dateUtil.now());
            $rootScope.isEligibleForVisit = true;
            var completeNIDLength = 22;
            var patientNID, typeOfRegistrationValue;
            $scope.hasTypeOfRegistration = false;

            $scope.onBirthDateChange = function () {
                $scope.dateValue = angular.element("#birthdate")[0].value;
                if ($scope.dateValue <= $scope.today) {
                    angular.element("#birthdate").css("border", "1px solid #DDD");
                    angular.element("#birthdate").css("background", "#fff");
                    angular.element("#birthdate").css("outline", "0");
                } else {
                    angular.element("#birthdate").css("border", "1px solid red");
                    angular.element("#birthdate").css("background", "#ffcdcd");
                    angular.element("#birthdate").css("outline", "0");
                    messagingService.showMessage('error', "US_REG_DATE_MESSAGE");
                }
            };

            var splitNID = function () {
                return patientService.get(uuid).then(function (response) {
                    patientNID = response.patient.identifiers[0].identifier;
                    typeOfRegistrationValue = response.patient.person.attributes;
                    if (patientNID.length === completeNIDLength) {
                        var NIDResult = patientNID.split("/");
                        $scope.NID.healthFacilityCode = NIDResult[0];
                        $scope.NID.year = parseInt(NIDResult[2], 10);
                        $scope.NID.sequentialCode = NIDResult[3];
                    }

                    for (var i = 0; i < typeOfRegistrationValue.length; i++) {
                        if (typeOfRegistrationValue[i].display === 'NEW_PATIENT' || typeOfRegistrationValue[i].display === 'TRANSFERRED_PATIENT') {
                            $scope.hasTypeOfRegistration = true;
                        }
                    }
                });
            };
            splitNID();
            var splitNIDss = function () {
                var nidYear = $scope.NID.year;
                if (!nidYear) {
                    var currentDate = new Date();
                    var currentYear = currentDate.getFullYear();
                    $scope.NID.year = currentYear;
                }
            };

            splitNIDss();
            $scope.buildFinalNID = function () {
                var seqCode = $scope.NID.sequentialCode;
                if (seqCode) {
                    while (seqCode.length < 5) {
                        seqCode = '0' + seqCode;
                    }
                    $scope.NID.sequentialCode = seqCode;
                }
                if (!$scope.patient.primaryIdentifier) {
                    return;
                }
                $scope.patient.primaryIdentifier.registrationNumber = $scope.NID.healthFacilityCode + '/' + $scope.NID.serviceCode + '/' + $scope.NID.year + '/' + $scope.NID.sequentialCode;
            };

            $scope.$on('DisableRegistrationFields', function (ent, data) {
                if (data) {
                    $scope.formFieldsDisabled = data;
                } else {
                    $scope.formFieldsDisabled = false;
                }
            });

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
                if (patientNID.length === completeNIDLength) {
                    $scope.$watch('patient.primaryIdentifier.registrationNumber', function () {
                        $scope.patient.primaryIdentifier.generate();
                    });
                }

                $scope.openMRSPatient = openmrsPatient["patient"];
                $scope.patient = openmrsPatientMapper.map(openmrsPatient);
                patientService.getPatientStatusState(uuid).then(function (response) {
                    $scope.patient.patientStatus = response.data[0].patient_status;
                    $scope.patient.patientState = response.data[0].patient_state;

                    _.map(response.data, function (currentObj) {
                        if (currentObj.patient_state != 'INACTIVE_TRANSFERRED_OUT' || currentObj.patient_state != 'INACTIVE_SUSPENDED' || currentObj.patient_state != 'INACTIVE_DEATH') {
                            $scope.patient.lastActiveState = currentObj.patient_state;
                        }
                    });

                    if ($scope.patient.patientState == "INACTIVE_SUSPENDED" || $scope.patient.patientState === "INACTIVE_TRANSFERRED_OUT" || $scope.patient.patientState === "INACTIVE_DEATH") {
                        $rootScope.isEligibleForVisit = false;
                        if ($scope.myForms.myForm.healthFacilityCode.$invalid || $scope.myForms.myForm.nidYear.$invalid || $scope.myForms.myForm.sequentialCode.$invalid) {
                            $scope.enableRequiredFields = false;
                        } else {
                            $scope.enableRequiredFields = true;
                        }
                        $scope.$broadcast("DisableRegistrationFields", true);
                        $scope.$emit("DisableRegistrationFields", true);
                    }

                    if ($scope.patient.patientState == "INACTIVE_TRANSFERRED_OUT") {
                        $scope.$broadcast("IN_TF", true);
                    }

                    if ($scope.patient.patientState == "INACTIVE_SUSPENDED") {
                        $scope.$broadcast("IN_SU", true);
                    }

                    if ($scope.patient.patientState == "INACTIVE_DEATH") {
                        $scope.$broadcast("IN_DT", true);
                    }
                });
                $scope.editPatientDocuments = [];
                var nationalityVar = function () {
                    if ($scope.patient.NATIONALITY == undefined) {
                        $scope.patient.NATIONALITY = "";
                    } else {
                        $scope.nationalityChoice = $scope.patient.NATIONALITY.value;
                        if ($scope.nationalityChoice == 'Moçambicana' || $scope.nationalityChoice == 'Mozambican') {
                            var mozAttributes = ['REGISTRATION_OPTION_NONE', 'BI', 'CARTAO_DE_ELEITOR', 'CEDULA_DE_NASCIMENTO', 'NUIT', 'NUIC'];
                            $scope.nationalityDocs = [];
                            $scope.nationalityDocs = mozAttributes;
                            $scope.existDocs = $scope.nationalityDocs;
                        } else if ($scope.nationalityChoice == 'Outra' || $scope.nationalityChoice == 'Other') {
                            var foreignAttributes = ['REGISTRATION_OPTION_NONE', 'DIRE', 'NUIT', 'PASSAPORTE_ESTRANGEIRO'];
                            $scope.nationalityDocs = [];
                            $scope.nationalityDocs = foreignAttributes;
                            $scope.existDocs = $scope.nationalityDocs;
                        }
                    }
                };
                nationalityVar();

                var existingPatientDocs = function () {
                    if ($scope.nationalityDocs == undefined) {
                        $scope.nationalityDocs = "";
                        return;
                    } else {
                        for (var i = -1; i <= $scope.nationalityDocs.length; i++) {
                            _.each($scope.nationalityDocs, function (doc) {
                                if ($scope.patient[doc] == undefined) {
                                    return;
                                } else {
                                    if ($scope.patient[doc].length > 0) {
                                        $scope.editPatientDocuments.push(doc);
                                        $scope.existDocs.splice($scope.existDocs.indexOf(doc), 1);
                                    }
                                }
                            });
                        }
                    }
                };
                existingPatientDocs();

                $scope.nationality = function () {
                    if ($scope.patient.NATIONALITY == undefined) {
                        $scope.patient.NATIONALITY = "";
                    } else {
                        $scope.nationalityChoice = $scope.patient.NATIONALITY.value;
                        if ($scope.nationalityChoice == 'Moçambicana' || $scope.nationalityChoice == 'Mozambican') {
                            var mozAttributes = ['REGISTRATION_OPTION_NONE', 'BI', 'CARTAO_DE_ELEITOR', 'CEDULA_DE_NASCIMENTO', 'NUIT', 'NUIC'];
                            $scope.nationalityDocs = [];
                            $scope.nationalityDocs = mozAttributes;
                            $scope.existDocs = $scope.nationalityDocs;
                        } else if ($scope.nationalityChoice == 'Outra' || $scope.nationalityChoice == 'Other') {
                            var foreignAttributes = ['REGISTRATION_OPTION_NONE', 'DIRE', 'NUIT', 'PASSAPORTE_ESTRANGEIRO'];
                            $scope.nationalityDocs = [];
                            $scope.nationalityDocs = foreignAttributes;
                            $scope.existDocs = $scope.nationalityDocs;
                        }
                    }
                };

                $scope.$watch('patient.NATIONALITY.value', function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        if (oldValue == undefined) {
                            nationalityVar();
                        } else {
                            for (var i = 0; i <= $scope.nationalityDocs.length; i++) {
                                $scope.patient[$scope.nationalityDocs[i]] = "";
                            }

                            $scope.editPatientDocuments = [];
                            nationalityVar();
                        }
                    }
                });

                $scope.nationalityEditAttribute = function (document) {
                    $scope.attributeChoice = document;
                    $scope.patient.attribute = $scope.attributeChoice;
                };
                $scope.addEditDocRow = function () {
                    if ($scope.editPatientDocuments.includes($scope.attributeChoice) || $scope.attributeChoice == undefined || !$scope.nationalityDocs.includes($scope.attributeChoice)) {
                        alert("Selecione outro documento");
                    } else {
                        $scope.editPatientDocuments.push($scope.attributeChoice);
                        $scope.existDocs.splice($scope.existDocs.indexOf($scope.attributeChoice), 1);
                        $scope.attributeChoice = "";
                    }
                };
                $scope.removeEditDocRow = function (docu) {
                    if ($scope.editPatientDocuments.includes(docu)) {
                        $scope.editPatientDocuments.splice($scope.editPatientDocuments.indexOf(docu), 1);
                        $scope.existDocs.push(docu);
                        $scope.patient[docu] = "";
                    } else {
                        alert("Remova outro documento");
                    }
                };
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
                var isDigitized = encounterService.getDigitized(uuid);
                isDigitized.then(function (data) {
                    var encountersWithObservations = data.data.results.filter(function (encounter) {
                        return encounter.obs.length > 0;
                    });
                    $scope.isDigitized = encountersWithObservations.length > 0;
                });

                spinner.forPromise($q.all([getPatientPromise, isDigitized]));
            })();

            $scope.$on("PTO", function (evt, data) {
                $scope.patient.patientStateChange = data;
            });

            var validFields = function () {
                if ($scope.myForms.myForm.healthFacilityCode.$invalid || $scope.myForms.myForm.nidYear.$invalid || $scope.myForms.myForm.sequentialCode.$invalid || $scope.myForms.myForm.givenName.$invalid ||
                    $scope.myForms.myForm.familyName.$invalid || $scope.myForms.myForm.gender.$invalid || $scope.myForms.myForm.ageYear.$invalid ||
                    $scope.myForms.myForm.birthdate.$invalid) {
                    return false;
                }
                return true;
            };

            $scope.update = function () {
                if (!validFields() || !$rootScope.isValidFields) {
                    messagingService.showMessage("error", "REGISTRATION_REQUIRED_INVALID_FIELD");
                } else {
                    if ($rootScope.buttonSubmitted && $scope.NID.healthFacilityCode && $scope.NID.serviceCode && $scope.NID.year && $scope.NID.sequentialCode) {
                        $scope.patient.primaryIdentifier.registrationNumber = $scope.NID.healthFacilityCode + '/' + $scope.NID.serviceCode + '/' + $scope.NID.year + '/' + $scope.NID.sequentialCode;
                        $scope.patient.primaryIdentifier.generate();
                    }

                    var patientStatus = $scope.patient.patientStatus;
                    var patientUuid = $scope.patient.uuid;
                    var creatorUuid = $rootScope.currentUser.uuid;
                    var patientState = $scope.patient.patientStateChange || $scope.patient.patientState;

                    if ($scope.patient.patientState == 'INACTIVE_TRANSFERRED_OUT') {
                        if ($scope.patient['TRANSFERENCE_HF_NAME']) {
                            $scope.patient['PATIENT_STATE_CHANGE'] = '';
                            $scope.patient['TRANSFER_OUT_DISTRICT'] = '';
                            $scope.patient['TRANSFER_OUT_NAME'] = '';
                            $scope.patient['TRANSFER_OUT_PROVINCE'] = '';
                            $scope.patient['Transfer_Date'] = '';
                            $scope.patient['Observations'] = '';
                            if ($scope.patient.lastActiveState === 'INACTIVE_TRANSFERRED_OUT') {
                                patientState = 'ACTIVE';
                            } else {
                                patientState = $scope.patient.lastActiveState;
                            }
                        }
                    }
                    addNewRelationships();
                    var errorMessages = Bahmni.Common.Util.ValidationUtil.validate($scope.patient, $scope.patientConfiguration.attributeTypes);
                    if (errorMessages.length > 0) {
                        errorMessages.forEach(function (errorMessage) {
                            messagingService.showMessage('error', errorMessage);
                        });
                        return $q.when({});
                    }

                    return spinner.forPromise($q.all([patientService.update($scope.patient, $scope.openMRSPatient), patientService.savePatientStatusState(patientStatus, patientUuid, creatorUuid, patientState)]).then(function (result) {
                        var patientProfileData = result[0].data;
                        if (!patientProfileData.error) {
                            successCallBack(patientProfileData);
                            $state.go($state.current, {}, {
                                reload: true
                            });
                            $scope.actions.followUpAction(patientProfileData);
                        }
                    }));
                }
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
                if ($scope.patient.patientState) {
                    if ($scope.patient.patientState === "INACTIVE_SUSPENDED" || $scope.patient.patientState === "INACTIVE_TRANSFERRED_OUT" || $scope.patient.patientState === "INACTIVE_DEATH") {
                        return true;
                    } else {
                        return false;
                    }
                }
            };

            $scope.afterSave = function () {
                auditLogService.log($scope.patient.uuid, Bahmni.Registration.StateNameEvenTypeMap['patient.edit'], undefined, "MODULE_LABEL_REGISTRATION_KEY");
                messagingService.showMessage("info", "REGISTRATION_LABEL_SAVED");
            };

            $scope.handleSectorChange = function () {
                if ($scope.patient['SECTOR_SELECT'].value == 'ATIP') {
                    $scope.isATIPSelectShown = true;
                } else {
                    $scope.isATIPSelectShown = false;
                    $scope.patient['ATIP_SELECT'] = null;
                }
            };
        }
    ]);
