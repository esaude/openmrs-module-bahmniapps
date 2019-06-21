'use strict';

angular.module('bahmni.common.domain')
    .factory('providerTypeService', ['$http', 'providerService', function ($http, providerService) {
        var getProviderType = function (allProviders, currentProvider) {
            return _.filter(_.map(allProviders, function (current) {
                if (current.uuid == currentProvider.uuid) {
                    return _.map(current.attributes, function (obj) {
                        if (obj.attributeType.display == 'APSS') {
                            if (obj.value == true) {
                                return obj.attributeType.display;
                            }
                        } else if (obj.attributeType.display == 'Clinical') {
                            if (obj.value == true) {
                                return obj.attributeType.display;
                            }
                        }
                    });
                }
            }));
        };

        var getAllProviders = function () {
            var params = {v: "custom:(display,person,uuid,retired,attributes:(attributeType:(display),value,voided))"};
            return providerService.list(params).then(function (response) {
                return _.filter(response.data.results);
            });
        };

        return {
            getProviderType: getProviderType,
            getAllProviders: getAllProviders

        };
    }]);
