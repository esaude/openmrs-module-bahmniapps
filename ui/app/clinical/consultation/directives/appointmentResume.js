'use strict';

angular.module('bahmni.clinical').directive('appointmentResume', ['$http', '$q', '$window', function ($http, $q, $window) {
    var link = function ($scope) {
        var getUpcomingAppointments = function () {
            var params = {
                q: "bahmni.sqlGet.upComingAppointments",
                v: "full",
                patientUuid: $scope.patient.uuid
            };
            return $http.get('/openmrs/ws/rest/v1/bahmnicore/sql', {
                method: "GET",
                params: params,
                withCredentials: true
            });
        };
        var getPastAppointments = function () {
            var params = {
                q: "bahmni.sqlGet.pastAppointments",
                v: "full",
                patientUuid: $scope.patient.uuid
            };
            return $http.get('/openmrs/ws/rest/v1/bahmnicore/sql', {
                method: "GET",
                params: params,
                withCredentials: true
            });
        };
        $q.all([getUpcomingAppointments(), getPastAppointments()]).then(function (response) {
            var upcomingAppointments = response[0].data;
            $scope.upcomingApss_ClinicalAppointment = [];

            for (let i = 0; i < upcomingAppointments.length; i++) {
                if (upcomingAppointments[i].DASHBOARD_APPOINTMENTS_SERVICE_KEY === 'APSS&PP' || upcomingAppointments[i].DASHBOARD_APPOINTMENTS_SERVICE_KEY === 'Consulta Clínica' || upcomingAppointments[i].DASHBOARD_APPOINTMENTS_SERVICE_KEY === 'Farmácia') {
                    $scope.upcomingApss_ClinicalAppointment.push(upcomingAppointments[i]);
                }
            }

            for (let i = 0; i < $scope.upcomingApss_ClinicalAppointment.length; i++) {
                delete $scope.upcomingApss_ClinicalAppointment[i].DASHBOARD_APPOINTMENTS_PROVIDER_KEY;
                delete $scope.upcomingApss_ClinicalAppointment[i].DASHBOARD_APPOINTMENTS_STATUS_KEY;
                delete $scope.upcomingApss_ClinicalAppointment[i].DASHBOARD_APPOINTMENTS_SERVICE_TYPE_KEY;
                $scope.upcomingApss_ClinicalAppointment[i].DASHBOARD_APPOINTMENTS_SLOT_KEY = $scope.setBlock($scope.upcomingApss_ClinicalAppointment[i].DASHBOARD_APPOINTMENTS_SLOT_KEY);
            }
            $scope.upcomingApss_ClinicalAppointmentsHeadings = _.keys($scope.upcomingApss_ClinicalAppointment[0]);

            var pastAppointments = response[1].data;
            $scope.pastApss_ClinicalAppointments = [];

            for (let i = 0; i < pastAppointments.length; i++) {
                if (pastAppointments[i].DASHBOARD_APPOINTMENTS_SERVICE_KEY === 'APSS&PP' || pastAppointments[i].DASHBOARD_APPOINTMENTS_SERVICE_KEY === 'Consulta Clínica' || pastAppointments[i].DASHBOARD_APPOINTMENTS_SERVICE_KEY === 'Farmácia') {
                    $scope.pastApss_ClinicalAppointments.push(pastAppointments[i]);
                }
            }

            for (let i = 0; i < $scope.pastApss_ClinicalAppointments.length; i++) {
                delete $scope.pastApss_ClinicalAppointments[i].DASHBOARD_APPOINTMENTS_PROVIDER_KEY;
                delete $scope.pastApss_ClinicalAppointments[i].DASHBOARD_APPOINTMENTS_STATUS_KEY;
                delete $scope.pastApss_ClinicalAppointments[i].DASHBOARD_APPOINTMENTS_SERVICE_TYPE_KEY;
                $scope.pastApss_ClinicalAppointments[i].DASHBOARD_APPOINTMENTS_SLOT_KEY = $scope.setBlock($scope.pastApss_ClinicalAppointments[i].DASHBOARD_APPOINTMENTS_SLOT_KEY);
            }
            $scope.pastApss_ClinicalAppointmentsHeadings = _.keys($scope.pastApss_ClinicalAppointments[0]);
        });

        $scope.setBlock = function (timeInterval) {
            if (timeInterval === "12:00 AM - 8:59 AM") {
                return "APP_BLOCK_1";
            } else
            if (timeInterval === "9:00 AM - 11:59 AM") {
                return "APP_BLOCK_2";
            } else
            if (timeInterval === "12:00 PM - 3:29 PM") {
                return "APP_BLOCK_3";
            } else {
                return "APP_BLOCK_4";
            }
        };
    };
    return {
        restrict: 'E',
        link: link,
        templateUrl: './consultation/views/appointmentResume.html'
    };
}]);