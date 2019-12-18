'use strict';

angular.module('bahmni.clinical').factory('patientInitialization',
    ['$q', '$rootScope', 'patientService', 'configurations', '$translate', 'observationsService',
        function ($q, $rootScope, patientService, configurations, $translate, observationsService) {
            return function (patientUuid) {
                var getPatient = function () {
                    var patientMapper = new Bahmni.PatientMapper(configurations.patientConfig(), $rootScope, $translate);
                    return $q.all([patientService.getPatient(patientUuid), patientService.getPatientStatusState(patientUuid), observationsService.fetch(patientUuid, 'Clinical_History_Obs_Form', undefined, 2)]).then(function (openMRSPatientResponse) {
                        var patient = patientMapper.map(openMRSPatientResponse[0].data);
                        patient.patientStatus = openMRSPatientResponse[1].data[0].patient_status;
                        patient.patientState = openMRSPatientResponse[1].data[0].patient_state;

                        if (openMRSPatientResponse[2].data.length > 0) {
                            var tarvProphilaxisMembers = openMRSPatientResponse[2].data[0].groupMembers[0].groupMembers;
                            for (var i = 0; i < tarvProphilaxisMembers.length; i++) {
                                if (tarvProphilaxisMembers[i].concept.name === 'HOF_TARV_PROPHILAXIS_Patient_Date_Of_Tarv') {
                                    patient.arvdispenseddate = tarvProphilaxisMembers[i].value;
                                }
                            }
                        }

                        if (patient.patientState == 'INACTIVE_TRANSFERRED_OUT' || patient.patientState == 'INACTIVE_SUSPENDED' || patient.patientState == 'INACTIVE_DEATH') {
                            patient.isReadOnly = true;
                        } else {
                            patient.isReadOnly = false;
                        }
                        if (patient["OLD PERSON ID"] !== undefined && patient["OLD PERSON ID"] !== null) {
                            patient.isMigrated = true;
                        } else {
                            patient.isMigrated = false;
                        }
                        return {"patient": patient};
                    });
                };

                return getPatient();
            };
        }]
);
