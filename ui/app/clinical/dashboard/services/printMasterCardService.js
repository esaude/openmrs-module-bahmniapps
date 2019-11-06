'use strict';

angular.module('bahmni.clinical')
    .service('printMasterCardService', ['$rootScope', '$translate', 'patientService', 'observationsService', 'programService', 'treatmentService', 'localeService', 'patientVisitHistoryService', 'conceptSetService', 'labOrderResultService',
        function ($rootScope, $translate, patientService, observationsService, programService, treatmentService, localeService, patientVisitHistoryService, conceptSetService, labOrderResultService) {
            var masterCardModel = {

                hospitalLogo: '',
                keyPopulation: '',
                Transfer: '',
                dest: '',
                patientInfo: {
                    mainContact: '',
                    username: '',
                    Tb_start: '',
                    INH_start: '',
                    INH_end: '',
                    firstName: '',
                    lastName: '',
                    age: '',
                    sex: '',
                    weight: '',
                    height: '',
                    patientId: '',
                    address: '',
                    birth_date: '',
                    address1: '',
                    address2: '',
                    address3: '',
                    address4: '',
                    District: '',
                    province: '',
                    close: '',
                    BMI: '',
                    CTZ_start: '',
                    CTZ_end: '',
                    Tb_end: '',
                    Tb_back: '',
                    pregStatus: '',
                    breastFeedingStatus: '',
                    whoStaging: '',
                    stageConditionName: '',
                    modelTypes: '',
                    modelDate: '',
                    hivDate: '',
                    patientStatus: '',
                    isTARV: '',
                    regDate: '',
                    treatmentStartDate: '',
                    labName: '',
                    labOrderResult: '',
                    mdsYes: '',
                    mdsNo: '',
                    secLast: '',
                    thirdLast: '',
                    secLastDate: '',
                    thirdLastDate: '',
                    condName: '',
                    diagnosisName: '',
                    pastName: '',
                    notARV: '',
                    isARV: '',
                    currRegARV: '',
                    diagnosisPastName: '',
                    resultAlt: '',
                    resultAst: '',
                    resultHb: '',
                    resultVl: '',
                    resultcd: ''
                }
            };

            var patientUuid = '';

            this.getReportModel = function (_patientUuid) {
                patientUuid = _patientUuid;
                return new Promise(function (resolve, reject) {
                    var p1 = populatePatientDemographics();
                    var p2 = populatePatientWeightAndHeight();
                    var p3 = populateLocationAndDrugOrders(0);
                    var p4 = populateHospitalNameAndLogo();
                    var p5 = populatePatientHeight();
                    var p6 = populateBMI();
                    var p7 = populatePriorityPopulation();
                    var p8 = populateTbDetails();
                    var p9 = populateTbEndDate();
                    var p10 = populateTbBackground();
                    var p11 = populatePreg();
                    var p12 = populateBrestFeeding();
                    var p13 = populateWhoStage();
                    var p14 = populateModels();
                    var p15 = populateProf();
                    var p16 = populateLabResult();
                    var p17 = populateARV();
                    var p18 = populateARTDetails();
                    var p19 = populatePatientLabResults();

                    Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19]).then(function () {
                        resolve(masterCardModel);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populatePriorityPopulation = function () {
                var pP = 'Group_Priority_Population_obs_form';
                observationsService.fetch(patientUuid, [pP]).then(function (response) {
                    if (response.data && response.data.length > 0) {
                        var pPValues = response.data[0].value.split(',');
                        var pPValues = response.data[0].value.split(',');
                        pPValues.forEach(function (value) {
                            value = value.trim();
                            if (value == 'PP_Key_population_PID') {
                                masterCardModel.keyPopulation = value;
                            }
                        });
                    }
                });
            };

            var populatePatientDemographics = function () {
                return new Promise(function (resolve, reject) {
                    patientService.getPatient(patientUuid).then(function (response) {
                        var patientMapper = new Bahmni.PatientMapper($rootScope.patientConfig, $rootScope, $translate);
                        var contact = response.data.person.attributes[0].value;
                        masterCardModel.patientInfo.mainContact = $rootScope.patient.PRIMARY_CONTACT_NUMBER_1.value;
                        var patient = patientMapper.map(response.data);
                        masterCardModel.patientInfo.firstName = patient.givenName;
                        masterCardModel.patientInfo.lastName = patient.familyName;
                        masterCardModel.patientInfo.gender = patient.gender;
                        masterCardModel.patientInfo.age = patient.age;
                        masterCardModel.patientInfo.patientId = patient.identifier;
                        masterCardModel.patientInfo.birth_date = patient.birthdate;
                        masterCardModel.patientInfo.stageConditionName = $rootScope.stageConditionName;
                        masterCardModel.patientInfo.username = $rootScope.currentUser.username;

                        if ($rootScope.patient.DateofHIVDiagnosis === undefined) {
                            masterCardModel.patientInfo.hivDate = null;
                        }
                        else {
                            masterCardModel.patientInfo.hivDate = $rootScope.patient.DateofHIVDiagnosis.value;
                        }
                        masterCardModel.patientInfo.condName = $rootScope.conditionName;

                        var arrDiagc = [];
                        if ($rootScope.diagName == null && $rootScope.diagPastName == null) {
                            $rootScope.diagName = null;
                        }
                        else if ($rootScope.diagName == null && $rootScope.diagPastName !== null) {
                            for (var j = 0; j < $rootScope.diagPastName.length; j++) {
                                arrDiagc.push($rootScope.diagPastName[j]);
                                var arr = arrDiagc.join('');
                            } masterCardModel.patientInfo.diagnosisPastName = arr;
                        }
                        else if ($rootScope.diagName !== null && $rootScope.diagPastName !== null) {
                            for (var j = 0; j < $rootScope.diagName.length; j++) {
                                arrDiagc.push($rootScope.diagName[j]);
                            }
                            masterCardModel.patientInfo.diagnosisName = arrDiagc;
                            masterCardModel.patientInfo.diagnosisPastName = null;
                        }
                        masterCardModel.patientInfo.regDate = $rootScope.patient.US_REG_DATE.value;
                        masterCardModel.patientInfo.treatmentStartDate = $rootScope.arvdispenseddate;

                        var statusArray = [{ name: "Pre TARV" }, { name: "TARV" }];
                        var arrStatus = [];
                        for (var k = 0; k < statusArray.length; k++) {
                            if ($rootScope.patient.PATIENT_STATUS.value.display == statusArray[k].name) {
                                arrStatus.push(statusArray[k].name);
                            }
                        }
                        masterCardModel.patientInfo.patientStatus = arrStatus;
                        masterCardModel.patientInfo.patientStatus = arrStatus;
                        if ($rootScope.patient && $rootScope.patient.patientStatus) {
                            masterCardModel.patientInfo.isTARV = $rootScope.patient.patientStatus;
                        }
                        var addressMap = patient.address;
                        masterCardModel.address1 = addressMap.address1;
                        masterCardModel.address2 = addressMap.address2;
                        masterCardModel.address3 = addressMap.address3;
                        masterCardModel.address4 = addressMap.address4;
                        masterCardModel.District = addressMap.cityVillage;
                        masterCardModel.close = addressMap.closeof;
                        masterCardModel.province = addressMap.stateProvince;
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populatePatientWeightAndHeight = function () {
                return new Promise(function (resolve, reject) {
                    var patientWeightConceptName = 'Weight';
                    observationsService.fetch(patientUuid, [patientWeightConceptName]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.weight = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populatePatientLabResults = function () {
                masterCardModel.labOrderResult = {};
                var labResultsToShow = ['ALT', 'AST', 'CD 4', 'CD4 %', 'CD4 Abs', 'HGB', 'CARGA VIRAL (Absoluto-Rotina)', 'CARGA VIRAL(Qualitativo-Rotina)', 'Other', 'Outros'];
                return new Promise(function (resolve, reject) {
                    labOrderResultService.getAllForPatient({patientUuid: patientUuid}).then(function (response) {
                        if (response.labAccessions) {
                            if (response.labAccessions.length > 0) {
                                _.map(response.labAccessions[0], function (currentObj) {
                                    if (_.includes(labResultsToShow, currentObj.testName)) {
                                        var loName;
                                        if (currentObj.testName == 'ALT') { loName = 'LO_ALT'; }
                                        else if (currentObj.testName == 'AST') { loName = 'LO_AST'; }
                                        else if (currentObj.testName == 'CD 4') { loName = 'LO_CD4'; }
                                        else if (currentObj.testName == 'CD4 %') { loName = 'LO_CD4'; }
                                        else if (currentObj.testName == 'CD4 Abs') { loName = 'LO_CD4'; }
                                        else if (currentObj.testName == 'HGB') { loName = 'LO_HGB'; }
                                        else if (currentObj.testName == 'CARGA VIRAL (Absoluto-Rotina)') { loName = 'LO_ViralLoad'; }
                                        else if (currentObj.testName == 'CARGA VIRAL(Qualitativo-Rotina)') { loName = 'LO_ViralLoad'; }
                                        else { loName = currentObj.testName; }
                                        masterCardModel.labOrderResult[loName] = {testDate: currentObj.resultDateTime, testResult: currentObj.result};
                                    }
                                });
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateProf = function () {
                return new Promise(function (resolve, reject) {
                    var patienINH = 'INH_Details';
                    var patientCTZ = 'CTZ_Details';
                    observationsService.fetch(patientUuid, [patienINH, patientCTZ]).then(function (response) {
                        var startDate = "Start Date_Prophylaxis";
                        var endDate = "End Date";

                        if ((response.data.length === 0)) {
                            observationsService.fetch(patientUuid, [startDate, endDate]).then(function (response) {
                                masterCardModel.patientInfo.INH_end = null;
                                masterCardModel.patientInfo.INH_start = null;
                            });
                        }
                        else if (response.data[0].concept.name == "CTZ_Details") {
                            observationsService.fetch(patientUuid, [startDate, endDate]).then(function (response) {
                                masterCardModel.patientInfo.CTZ_end = response.data[1].value;
                                masterCardModel.patientInfo.CTZ_start = response.data[0].value;
                            });
                        }
                        else if ((response.data[0].concept.name == "INH_Details")) {
                            observationsService.fetch(patientUuid, [startDate, endDate]).then(function (response) {
                                masterCardModel.patientInfo.INH_end = response.data[1].value;
                                masterCardModel.patientInfo.INH_start = response.data[0].value;
                            });
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateARV = function () {
                return new Promise(function (resolve, reject) {
                    var arvDrug = 'ARV DRUG';
                    observationsService.fetch(patientUuid, [arvDrug]).then(function (response) {
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };
            var populatePatientHeight = function () {
                return new Promise(function (resolve, reject) {
                    var patientHeightConceptName = 'Height';
                    observationsService.fetch(patientUuid, [patientHeightConceptName]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.height = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateTbDetails = function () {
                return new Promise(function (resolve, reject) {
                    var TbStart = "SP_Treatment Start Date";
                    observationsService.fetch(patientUuid, [TbStart]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.Tb_start = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateTbEndDate = function () {
                return new Promise(function (resolve, reject) {
                    var TbEnd = "SP_Treatment End Date";
                    observationsService.fetch(patientUuid, [TbEnd]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.Tb_end = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };
            var populateTbBackground = function () {
                return new Promise(function (resolve, reject) {
                    var TbEnd = "Has TB Symptoms";
                    observationsService.fetch(patientUuid, [TbEnd]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            var a = response.data[0].value;
                            if (a === true) {
                                masterCardModel.patientInfo.Tb_back = "Sim";
                            }
                            else {
                                masterCardModel.patientInfo.Tb_back = "Não";
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populatePreg = function () {
                return new Promise(function (resolve, reject) {
                    var preg = "Pregnancy_Yes_No";
                    observationsService.fetch(patientUuid, [preg]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.pregStatus = response.data[0].valueAsString;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateBrestFeeding = function () {
                return new Promise(function (resolve, reject) {
                    var brestFeeding = "Breastfeeding_ANA";
                    observationsService.fetch(patientUuid, [brestFeeding]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            var status = response.data[0].valueAsString;
                            if (status == "No") {
                                masterCardModel.patientInfo.breastFeedingStatus = "ANSWER_NO";
                            }
                            else {
                                masterCardModel.patientInfo.breastFeedingStatus = "ANSWER_YES";
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateWhoStage = function () {
                return new Promise(function (resolve, reject) {
                    var WhoStage = "HTC, WHO Staging";
                    observationsService.fetch(patientUuid, [WhoStage]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.whoStaging = response.data[0].valueAsString;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateLabResult = function () {
                var Resultarray = [];
                if ($rootScope.lab === undefined) {
                    Resultarray = null;
                }
                else {
                    var labResult = $rootScope.lab.results.forEach(function (labres) {
                        Resultarray.push(labres);
                    });
                    var temp = [];
                    var temp1 = [];
                    for (var i = 0; i < Resultarray.length; i++) {
                        temp.push(Resultarray[i].orderName);
                        temp1.push(Resultarray[i].result);
                        masterCardModel.patientInfo.labName = temp[i];

                        if (temp[i] == "LO_HB)")
                         {
                            if (temp[i] === null)
                             {
                                masterCardModel.patientInfo.resultHb = null;
                            }
                            else
                            {
                                masterCardModel.patientInfo.resultHb = temp1[i];
                            }
                        }

                        if (temp[i] == "LO_ViralLoad")
                         {
                            if (temp[i] === null)
                            {
                                masterCardModel.patientInfo.resultVl = null;
                            }
                            else
                            {
                                masterCardModel.patientInfo.resultVl = temp1[i];
                            }
                        }

                        if (temp[i] == "LO_CD4")
                         {
                            if (temp[i] === null)
                            {
                                masterCardModel.patientInfo.resultcd = null;
                            }
                            else
                            {
                                masterCardModel.patientInfo.resultcd = temp1[i];
                            }
                        }

                        if (temp[i] == "LO_ALT")
                         {
                            if (temp[i] === null)
                            {
                                masterCardModel.patientInfo.resultAlt = null;
                            }
                            else
                            {
                                masterCardModel.patientInfo.resultAlt = temp1[i];
                            }
                        }

                        if (temp[i] == "LO_AST")
                        {
                            if (temp[i] === null)
                             {
                                masterCardModel.patientInfo.resultAst = null;
                            }
                            else
                            {
                                masterCardModel.patientInfo.resultAst = temp1[i];
                            }
                        }
                    }
                }
            };

            var populateARTDetails = function ()
             {
                return new Promise(function (resolve, reject)
                {
                    treatmentService.getActiveDrugOrders(patientUuid, null, null).then(function (response)
                     {
                        var drugarr = [];
                        for (var i = response.length - 1; i >= 0; i--) {
                            var obj = {};
                            obj[0] = response[i].effectiveStartDate;
                            obj[1] = response[i].concept.name;
                            drugarr.push(obj);
                        }

                        for (var i = drugarr.length; i > 0; i--) {
                            for (var j = 1; j < i; j++) {
                                if (j % 2 !== 0) {
                                    masterCardModel.regimeName = drugarr[i - 1][j];
                                    masterCardModel.regimeChangeName = drugarr[i - 2][j];
                                }
                                masterCardModel.regimeStartDate = drugarr[i - 1][j - 1];
                                masterCardModel.regimeChangeDate = drugarr[i - 2][j - 1];
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateModels = function () {
                return new Promise(function (resolve, reject) {
                    var modelsName = "Apss_Differentiated_Models";
                    observationsService.fetch(patientUuid, [modelsName]).then(function (response) {
                        var modelarray = [];
                        var abc = response.data.forEach(function (res) {
                            var group = res.groupMembers.forEach(function (name) {
                                modelarray.push(name);
                            });
                        });

                        var temp = [];
                        for (var i = 0; i < modelarray.length; i++) {
                            temp.push(modelarray[i].concept.shortName);
                        }

                        if (modelarray.length !== 0) {
                            masterCardModel.patientInfo.mdsYes = "ANSWER_YES";
                        }
                        if (modelarray.length === 0) {
                            masterCardModel.patientInfo.mdsYes = "ANSWER_NO";
                        }
                        masterCardModel.patientInfo.modelTypes = temp;

                        var arrDate = [];
                        var arr = response.data.forEach(function (date) {
                            arrDate.push(date);
                        });

                        if (arrDate === undefined || arrDate.length === 0) {
                            masterCardModel.patientInfo.modelDate = null;
                        }
                        else if (arrDate.length >= 1) {
                            var ddate = arrDate.length - 1;
                            masterCardModel.patientInfo.modelDate = arrDate[ddate].observationDateTime;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateBMI = function () {
                var patientBMIConceptName = 'BMI';
                observationsService.fetch(patientUuid, [patientBMIConceptName]).then(function (response) {
                    if (response.data && response.data.length > 0) {
                        masterCardModel.patientInfo.BMI = response.data[0].value;
                    }
                });
            };

            var populateDrugOrders = function (visitUuid) {
                return new Promise(function (resolve, reject) {
                    treatmentService.getPrescribedDrugOrders(patientUuid, true).then(function (response) {
                        var resarray = [];
                        var arrres = response.forEach(function (Drug) {
                            resarray.push(Drug);
                        });
                        var arrARV = [];
                        var arrNotARV = [];
                        var dateARV = [];
                        var dateNotARV = [];
                        for (var i = 0; i < resarray.length; i++) {
                            if (resarray[i].drug.form !== 'ARV') {
                                resarray[i].concept.name;
                                arrNotARV.push(resarray[i].concept.name);
                                dateNotARV.push(resarray[i].effectiveStartDate);
                                masterCardModel.patientInfo.notARV = arrNotARV;
                            }
                            else {
                                resarray[i].concept.name;
                                arrARV.push(resarray[i].concept.name);
                                dateARV.push(resarray[i].effectiveStartDate);
                                masterCardModel.patientInfo.isARV = resarray[i].concept.name;

                                for (var j = 0; j < arrARV.length; j++) {
                                    if (arrARV.length === 0) {
                                        masterCardModel.patientInfo.currRegARV = null;
                                        masterCardModel.patientInfo.secLast = null;
                                        masterCardModel.patientInfo.thirdLast = null;
                                        masterCardModel.patientInfo.secLastDate = null;
                                        masterCardModel.patientInfo.thirdLastDate = null;
                                    }

                                    else if (arrARV.length === 1) {
                                        masterCardModel.patientInfo.currRegARV = arrARV[j];
                                    }

                                    else if (arrARV.length === 2) {
                                        masterCardModel.patientInfo.currRegARV = arrARV[0];
                                        masterCardModel.patientInfo.secLast = arrARV[1];
                                        masterCardModel.patientInfo.thirdLast = null;
                                        masterCardModel.patientInfo.secLastDate = dateARV[1];
                                        masterCardModel.patientInfo.thirdLastDate = null;
                                    }
                                    else if (arrARV.length >= 3) {
                                        masterCardModel.patientInfo.currRegARV = arrARV[0];
                                        masterCardModel.patientInfo.secLast = arrARV[1];
                                        masterCardModel.patientInfo.thirdLast = arrARV[2];
                                        masterCardModel.patientInfo.secLastDate = dateARV[1];
                                        masterCardModel.patientInfo.thirdLastDate = dateARV[2];
                                    }
                                }
                            }
                        }
                    });
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            };

            var populateLocationAndDrugOrders = function (lastVisit) {
                return new Promise(function (resolve, reject) {
                    patientVisitHistoryService.getVisitHistory(patientUuid, null).then(function (response) {
                        if (response.visits && response.visits.length > 0) {
                            masterCardModel.location = response.visits[lastVisit].location.display;
                            populateDrugOrders(response.visits[lastVisit].uuid);
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateHospitalNameAndLogo = function () {
                return new Promise(function (resolve, reject) {
                    localeService.getLoginText().then(function (response) {
                        masterCardModel.hospitalLogo = response.data.homePage.logo;
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };
        }]);
