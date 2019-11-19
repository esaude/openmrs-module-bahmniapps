'use strict';

angular.module('bahmni.clinical')
    .service('printMasterCardService', ['$rootScope', '$translate', 'patientService', 'observationsService', 'programService', 'treatmentService', 'localeService', 'patientVisitHistoryService', 'conceptSetService', 'labOrderResultService', 'diagnosisService', 'orderService',
        function ($rootScope, $translate, patientService, observationsService, programService, treatmentService, localeService, patientVisitHistoryService, conceptSetService, labOrderResultService, diagnosisService, orderService) {
            var masterCardModel = {

                hospitalLogo: '',
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
                    resultcd: '',
                    keyPopulation: '',
                    vulPopulation: '',
                    actualEncounter: '',
                    bPressureS: '',
                    bPressureD: '',
                    bPressure: '',
                    encPregnancy: '',
                    encLastMenstrual: '',
                    encLact: '',
                    encFPCondom: '',
                    encFPVas: '',
                    encFPPil: '',
                    encFPInj: '',
                    encFPImp: '',
                    encFPDui: '',
                    encFPLT: '',
                    encFPMal: '',
                    encFPOut: '',
                    encStaging: '',
                    encEdema: '',
                    encWeight: '',
                    encHeight: '',
                    encBP: '',
                    encIMC: '',
                    encIndicador: '',
                    encEstadoNutricional: '',
                    encNutriEd: '',
                    encNutriEdTipo: '',
                    encNutriEdQty: '',
                    encNutriEdQtyUnit: '',
                    encTB: '',
                    encTBDiag: '',
                    encTBSym: '',
                    encTBStartDate: '',
                    encTBStatus: '',
                    encINHSideEffects: '',
                    encCTZSideEffects: '',
                    encITS: '',
                    encITSDiag: '',
                    encITSSAM: '',
                    encITSSAF: '',
                    encDiag: '',
                    encLabReq: '',
                    encViralLoad: '',
                    encCDCount: ''
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
                    var p30 = populateVulPopulation();
                    var p31 = populateEncounterDetails();

                    Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p30, p31]).then(function () {
                        resolve(masterCardModel);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateVulPopulation = function () {
                var pP = 'Group_Priority_Population_obs_form';
                observationsService.fetch(patientUuid, [pP]).then(function (response) {
                    if (response.data && response.data.length > 0) {
                        var pPValues = response.data[0].value.split(',');
                        pPValues.forEach(function (value) {
                            value = value.trim();
                            if (value == 'PP_Vulnerable_Population_Yes_Female_youths') { masterCardModel.patientInfo.vulPopulation = value; }
                            else if (value == 'PP_Vulnerable_Population_Yes_Young woman') { masterCardModel.patientInfo.vulPopulation = value; }
                            else if (value == 'PP_Vulnerable_Population_Yes_Serodiscordant_couples') { masterCardModel.patientInfo.vulPopulation = value; }
                            else if (value == 'PP_Vulnerable_Population_Yes_Orphans') { masterCardModel.patientInfo.vulPopulation = value; }
                            else if (value == 'PP_Vulnerable_Population_Yes_Person_Disability') { masterCardModel.patientInfo.vulPopulation = value; }
                            else if (value == 'PP_Vulnerable_Population_Yes_Seasonal_Workers') { masterCardModel.patientInfo.vulPopulation = value; }
                            else if (value == 'PP_Vulnerable_Population_Yes_Miner') { masterCardModel.patientInfo.vulPopulation = value; }
                            else if (value == 'PP_Vulnerable_Population_Yes_Truck_driver') { masterCardModel.patientInfo.vulPopulation = value; }
                        });
                    }
                });
            };

            var populatePriorityPopulation = function () {
                var pP = 'Group_Priority_Population_obs_form';
                observationsService.fetch(patientUuid, [pP]).then(function (response) {
                    if (response.data && response.data.length > 0) {
                        var pPValues = response.data[0].value.split(',');
                        pPValues.forEach(function (value) {
                            value = value.trim();
                            if (value == 'PP_Key_population_PID') { masterCardModel.patientInfo.keyPopulation = value; }
                            else if (value == 'PP_Key_population_HSH') { masterCardModel.patientInfo.keyPopulation = value; }
                            else if (value == 'PP_Key_population_REC') { masterCardModel.patientInfo.keyPopulation = value; }
                            else if (value == 'PP_Key_population_MTS') { masterCardModel.patientInfo.keyPopulation = value; }
                            else if (value == 'PP_Key_population_Other') { masterCardModel.patientInfo.keyPopulation = value; }
                        });
                    }
                });
            };

            var populatePatientDemographics = function () {
                return new Promise(function (resolve, reject) {
                    patientService.getPatient(patientUuid).then(function (response) {
                        var patientMapper = new Bahmni.PatientMapper($rootScope.patientConfig, $rootScope, $translate);
                        var contact = response.data.person.attributes[0].value;
                        var patient = patientMapper.map(response.data);
                        masterCardModel.patientInfo.firstName = patient.givenName;
                        masterCardModel.patientInfo.lastName = patient.familyName;
                        masterCardModel.patientInfo.gender = patient.gender;

                        if ($rootScope.patient.PRIMARY_CONTACT_NUMBER_1 !== undefined) {
                            masterCardModel.patientInfo.mainContact = $rootScope.patient.PRIMARY_CONTACT_NUMBER_1.value;
                        }
                        if (patient.age <= 5) {
                            masterCardModel.patientInfo.age = patient.age * 12;
                        } else {
                            masterCardModel.patientInfo.age = patient.age;
                        }

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
                    labOrderResultService.getAllForPatient({ patientUuid: patientUuid }).then(function (response) {
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
                                        masterCardModel.labOrderResult[loName] = { testDate: currentObj.resultDateTime, testResult: currentObj.result };
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

                        if (temp[i] == "LO_HB)") {
                            if (temp[i] === null) {
                                masterCardModel.patientInfo.resultHb = null;
                            }
                            else {
                                masterCardModel.patientInfo.resultHb = temp1[i];
                            }
                        }

                        if (temp[i] == "LO_ViralLoad") {
                            if (temp[i] === null) {
                                masterCardModel.patientInfo.resultVl = null;
                            }
                            else {
                                masterCardModel.patientInfo.resultVl = temp1[i];
                            }
                        }

                        if (temp[i] == "LO_CD4") {
                            if (temp[i] === null) {
                                masterCardModel.patientInfo.resultcd = null;
                            }
                            else {
                                masterCardModel.patientInfo.resultcd = temp1[i];
                            }
                        }

                        if (temp[i] == "LO_ALT") {
                            if (temp[i] === null) {
                                masterCardModel.patientInfo.resultAlt = null;
                            }
                            else {
                                masterCardModel.patientInfo.resultAlt = temp1[i];
                            }
                        }

                        if (temp[i] == "LO_AST") {
                            if (temp[i] === null) {
                                masterCardModel.patientInfo.resultAst = null;
                            }
                            else {
                                masterCardModel.patientInfo.resultAst = temp1[i];
                            }
                        }
                    }
                }
            };

            var populateARTDetails = function () {
                return new Promise(function (resolve, reject) {
                    treatmentService.getActiveDrugOrders(patientUuid, null, null).then(function (response) {
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

            var populatePatientBloodPressure = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientBPSConcept = 'Blood_Pressure_–_Systolic_VS1';
                    var patientBPDConcept = 'BP_Diastolic_VSNormal';

                    observationsService.fetchForEncounter(encUuid, patientBPSConcept).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.bPressureS = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientBPDConcept).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.bPressureD = response.data[0].value;
                        }
                        resolve();
                        masterCardModel.patientInfo.bPressure = masterCardModel.patientInfo.bPressureS + '/' + masterCardModel.patientInfo.bPressureD;
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncPatientPregnancy = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientPreg = 'Pregnancy_Yes_No';

                    observationsService.fetchForEncounter(encUuid, patientPreg).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encPregnancy = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncLastMenstrual = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientMest = 'Last Menstruation Date';

                    observationsService.fetchForEncounter(encUuid, patientMest).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encLastMenstrual = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncLact = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientLact = 'Breastfeeding_ANA';

                    observationsService.fetchForEncounter(encUuid, patientLact).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            if (response.data[0].value == true) {
                                masterCardModel.patientInfo.encLact = 'Sim';
                            }
                            else if (response.data[0].value == false) {
                                masterCardModel.patientInfo.encLact = 'Não';
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFamPlaning = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFPCondom = 'Family_Planning_Contraceptive_Methods_PRES_Condom_button';
                    var patientFPVas = 'Family_Planning_Contraceptive_Methods_VAS_Vasectomy_button';
                    var patientFPPil = 'Family_Planning_Contraceptive_Methods_PIL_Oral_Contraceptive_button';
                    var patientFPInj = 'Family_Planning_Contraceptive_Methods_INJ_Injection_button';
                    var patientFPImp = 'Family_Planning_Contraceptive_Methods_IMP_Implant_button';
                    var patientFPDiu = 'Family_Planning_Contraceptive_Methods_DIU_Intra_button';
                    var patientFPLT = 'Family_Planning_Contraceptive_Methods_LT_Tubal_Ligation_button';
                    var patientFPMal = 'Family_Planning_Contraceptive_Methods_MAL_Lactational_Amenorrhea_Method_button';
                    var patientFPOut = 'Family_Planning_Contraceptive_Methods_OUT_Other_button';

                    observationsService.fetchForEncounter(encUuid, patientFPCondom).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encFPCondom = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientFPVas).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encFPVas = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientFPPil).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encFPPil = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientFPInj).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encFPInj = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientFPImp).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encFPImp = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientFPDiu).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encFPDui = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientFPLT).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encFPLT = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientFPMal).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encFPMal = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientFPOut).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encFPOut = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncStaging = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientStage = 'HTC, WHO Staging';

                    observationsService.fetchForEncounter(encUuid, patientStage).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encStaging = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncEdema = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientEdema = 'Infants Odema_Prophylaxis';

                    observationsService.fetchForEncounter(encUuid, patientEdema).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encEdema = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncWeight = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientWeight = 'WEIGHT';

                    observationsService.fetchForEncounter(encUuid, patientWeight).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encWeight = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncHeight = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientHeight = 'HEIGHT';

                    observationsService.fetchForEncounter(encUuid, patientHeight).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encHeight = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncBP = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientBP = 'Brachial_perimeter_new';

                    observationsService.fetchForEncounter(encUuid, patientBP).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encBP = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncIMC = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientIMC = 'BMI';

                    observationsService.fetchForEncounter(encUuid, patientIMC).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encIMC = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            if (masterCardModel.patientInfo.encIMC !== undefined) {
                masterCardModel.patientInfo.encIndicador = 'IMC';
            }
            else if (masterCardModel.patientInfo.encBP !== undefined) {
                masterCardModel.patientInfo.encIndicador = 'PB';
            }

            var populateEncEstadoNutricional = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientEstadoNutricional = 'Nutritional_States_new';

                    observationsService.fetchForEncounter(encUuid, patientEstadoNutricional).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encEstadoNutricional = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncNutriEd = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientNutriEd = 'Received nutritional education';
                    var patientNutriEdTipo = 'Nutrition Supplement';
                    var patientNutriEdQty = 'Quantity of Nutritional Supplement';
                    var patientNutriEdQtyUnit = 'SP_Measurement_Unit';

                    observationsService.fetchForEncounter(encUuid, patientNutriEd).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            if (response.data[0].value == true) {
                                masterCardModel.patientInfo.encNutriEd = 'Sim';
                            }
                            else if (response.data[0].value == false) {
                                masterCardModel.patientInfo.encNutriEd = 'Não';
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientNutriEdTipo).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encNutriEdTipo = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientNutriEdQty).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encNutriEdQty = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientNutriEdQtyUnit).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encNutriEdQtyUnit = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncTB = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientTB = 'Has TB Symptoms';
                    var patientTBDiag = 'Date of Diagnosis';
                    var patientTBSym = 'Symptoms Prophylaxis_New';
                    var patientTBStartDate = 'SP_Treatment Start Date';
                    var patientTBStatus = 'SP_Treatment State';
                    var patientINHSideEffects = 'SP_Side_Effects_INH';
                    var patientCTZSideEffects = 'SP_Side_Effects_CTZ';

                    observationsService.fetchForEncounter(encUuid, patientTB).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encTB = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientTBDiag).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            if (response.data[0].value !== undefined) {
                                masterCardModel.patientInfo.encTBDiag = true;
                            }
                            else {
                                masterCardModel.patientInfo.encTBDiag = false;
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientTBSym).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encTBSym = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientTBStartDate).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encTBStartDate = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientTBStatus).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encTBStatus = response.data[0].value.name;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientINHSideEffects).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encINHSideEffects = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientCTZSideEffects).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encCTZSideEffects = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncITS = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientITS = 'Has STI Symptoms';
                    var patientITSDiag = 'STI Diagnosis_Prophylaxis';
                    var patientSAM = 'Syndromic Approach_STI_M';
                    var patientSAF = 'Syndromic Approach_STI_F';

                    observationsService.fetchForEncounter(encUuid, patientITS).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encITS = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientITSDiag).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encITSDiag = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientSAM).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encITSSAM = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });

                    observationsService.fetchForEncounter(encUuid, patientSAF).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.patientInfo.encITSSAF = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncDiagnosis = function (visitUuid) {
                return new Promise(function (resolve, reject) {
                    var valArr = [];
                    diagnosisService.getDiagnoses(patientUuid, visitUuid).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            for (var i = 0; i <= response.data.length; i++) {
                                if (response.data[i] !== undefined) {
                                    valArr.push(response.data[i].codedAnswer.shortName);
                                    masterCardModel.patientInfo.encDiag = valArr;
                                }
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncInvestigations = function (data) {
                /* masterCardModel.patientInfo.encLabReq = []; */
                var orderArr = [];
                for (var i = 0; i <= data.orders.length; i++) {
                    if (data.orders[i] !== undefined) {
                        orderArr.push(data.orders[i].display);
                        // masterCardModel.patientInfo.encLabReq.push(data.orders[i].display);
                        masterCardModel.patientInfo.encLabReq = orderArr;
                        console.log(masterCardModel.patientInfo.encLabReq);
                    }
                }
            };

            var populateEncounterDetails = function () {
                return new Promise(function (resolve, reject) {
                    patientVisitHistoryService.getVisitHistory(patientUuid, null).then(function (response) {
                        if (response.visits && response.visits.length > 0) {
                            var visitVar = '';
                            var encoVar = '';
                            var encoArr = []; // encounter data used for all info
                            var encoUuidArr = []; // encounter uuid for ng repeat
                            for (var i = 0; i <= response.visits.length; i++) {
                                if (response.visits[i] !== undefined) {
                                    visitVar = response.visits[i];
                                    if (visitVar.encounters.length > 0) {
                                        for (var y = 0; y <= visitVar.encounters.length; y++) {
                                            if (visitVar.encounters[y] !== undefined) {
                                                encoVar = visitVar.encounters[y];
                                                encoArr.push(encoVar);
                                                encoUuidArr.push(encoVar.uuid);
                                                console.log(encoVar);
                                                console.log(encoArr);
                                                masterCardModel.patientInfo.actualEncounter = encoVar.encounterDatetime;
                                                masterCardModel.patientInfo.bPressure = '';
                                                masterCardModel.patientInfo.bPressureS = '';
                                                masterCardModel.patientInfo.bPressureD = '';

                                                populatePatientBloodPressure(encoVar.uuid);

                                                populateEncPatientPregnancy(encoVar.uuid);

                                                populateEncLastMenstrual(encoVar.uuid);

                                                populateEncLact(encoVar.uuid);

                                                populateEncFamPlaning(encoVar.uuid);

                                                populateEncStaging(encoVar.uuid);

                                                populateEncEdema(encoVar.uuid);

                                                populateEncWeight(encoVar.uuid);

                                                populateEncHeight(encoVar.uuid);

                                                populateEncBP(encoVar.uuid);

                                                populateEncIMC(encoVar.uuid);

                                                populateEncEstadoNutricional(encoVar.uuid);

                                                populateEncNutriEd(encoVar.uuid);

                                                populateEncTB(encoVar.uuid);

                                                populateEncITS(encoVar.uuid);

                                                populateEncDiagnosis(encoVar.visit.uuid);

                                                populateEncInvestigations(encoVar);
                                            }
                                        }
                                    }
                                }
                            }
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
