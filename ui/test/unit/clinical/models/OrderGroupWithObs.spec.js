'use strict';

describe('Order group with obs', function () {
    var listOfEncounterTransactions = function() {
        return [
            {
                "encounterDateTime": "2014-03-24T14:27:36.000+0530",
                "encounterUuid": "44f473d1-18a3-468f-8bc9-d2fea42e3124",
                "testOrders": [
                    {
                        "uuid": "34a9d9ff-b243-4f73-a7bc-4f2f2ffeec2a",
                        "voided": false,
                        "dateCreated": "2014-03-24T14:38:13.000+0530"
                    },
                    {
                        "uuid": "ff09eced-a3a7-424c-9963-2fd0e98f8708",
                        "voided": false,
                        "dateCreated": "2014-03-25T14:38:13.000+0530"
                    }
                ],
                "providers": [
                    {
                        "uuid": "35ba3170-cf80-4749-9672-b3b678c77b6a",
                        "name": "superman"
                    }
                ]
            },
            {
                "encounterDateTime": "2014-03-24T14:27:36.000+0530",
                "encounterUuid": "3428e858-7d8e-4b66-965e-efdb3ac2bed8",
                "testOrders": [],
                "providers": [
                    {
                        "uuid": "da6867ba-a2a1-11e3-af88-005056821db0",
                        "name": "Lab System"
                    }
                ],
                "observations": [
                    {
                        "orderUuid": "34a9d9ff-b243-4f73-a7bc-4f2f2ffeec2a",
                        "value": "100",
                        "voided": false,

                    }
                ]
            }
        ];
    };

    it("should create and map test orders with observations",function(){
        var encounterTransactions = listOfEncounterTransactions();
        var orderGroupWithObs = Bahmni.Clinical.OrderGroupWithObs.prototype.create(encounterTransactions,'testOrders', null);
        expect(orderGroupWithObs.length).toBe(2);
        expect(orderGroupWithObs[0].orders[0].obs.length).toBe(1);
        expect(orderGroupWithObs[1].orders.length).toBe(1);
        expect(orderGroupWithObs[1].orders[0].obs.length).toBe(0);
    });

    it("should set providers for each observation",function(){
        var encounterTransactions = listOfEncounterTransactions();
        var orderGroupWithObs = Bahmni.Clinical.OrderGroupWithObs.prototype.create(encounterTransactions,'testOrders', null);
        expect(orderGroupWithObs.length).toBe(2);
        expect(orderGroupWithObs[0].orders[0].obs[0].provider.name).toBe("Lab System");
    });

    it("should set providers for nested observations",function(){
        var encounterTransactions = listOfEncounterTransactions();
        var orderGroupWithObs = Bahmni.Clinical.OrderGroupWithObs.prototype.create(encounterTransactions,'testOrders', null);
        expect(orderGroupWithObs.length).toBe(2);
        expect(orderGroupWithObs[0].orders[0].obs[0].provider.name).toBe("Lab System");
    });
});