'use strict';

angular.module('bahmni.clinical').factory('patientInitialization',
    ['$q', '$rootScope', 'patientService', 'configurations', '$translate',
        function ($q, $rootScope, patientService, configurations, $translate) {
            return function (patientUuid) {
                var getPatient = function () {
                    var patientMapper = new Bahmni.PatientMapper(configurations.patientConfig(), $rootScope, $translate);
                    return $q.all([patientService.getPatient(patientUuid), patientService.getPatientStatusState(patientUuid)]).then(function (openMRSPatientResponse) {
                        var patient = patientMapper.map(openMRSPatientResponse[0].data);
                        patient.patientStatus = openMRSPatientResponse[1].data[0].patient_status;
                        patient.patientState = openMRSPatientResponse[1].data[0].patient_state;
                        return {"patient": patient};
                    });
                };

                return getPatient();
            };
        }]
);
