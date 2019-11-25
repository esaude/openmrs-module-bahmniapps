'use strict';

angular.module('bahmni.clinical')
    .service('printMasterCardService', ['$rootScope', '$translate', 'patientService', 'observationsService', 'programService', 'treatmentService', 'localeService', 'patientVisitHistoryService', 'conceptSetService', 'labOrderResultService', 'diagnosisService', 'orderService', 'encounterService',
        function ($rootScope, $translate, patientService, observationsService, programService, treatmentService, localeService, patientVisitHistoryService, conceptSetService, labOrderResultService, diagnosisService, orderService, encounterService) {
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
                    resultcd: ''
                },
                encounterArr: [],
                encountersInfo: [],
                encounterTemp: {
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
                    encINHState: '',
                    encCTZState: '',
                    encINHSideEffects: '',
                    encCTZSideEffects: '',
                    encITS: '',
                    encITSDiag: '',
                    encITSSAM: '',
                    encITSSAF: '',
                    encDiag: '',
                    encLabReq: '',
                    encRef: '',
                    encSG: '',
                    encMDC: '',
                    encCR: '',
                    encPC: '',
                    encAR: '',
                    encMPS: '',
                    encGroupOther: '',
                    encGA: '',
                    encAF: '',
                    encCA: '',
                    encPU: '',
                    encFR: '',
                    encDT: '',
                    encDC: '',
                    encMDCOther: ''
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
                    // var p31 = populateEncounterDetails();
                    var p31 = visitHist();

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
                            if (value === 'PP_Vulnerable_Population_Yes_Female_youths') { masterCardModel.patientInfo.vulPopulation = 'Rapariga entre 10-14 anos'; }
                            else if (value === 'PP_Vulnerable_Population_Yes_Young woman') { masterCardModel.patientInfo.vulPopulation = 'Mulher jovem entre 15-24 anos'; }
                            else if (value === 'PP_Vulnerable_Population_Yes_Serodiscordant_couples') { masterCardModel.patientInfo.vulPopulation = 'Casais serodiscordantes'; }
                            else if (value === 'PP_Vulnerable_Population_Yes_Orphans') { masterCardModel.patientInfo.vulPopulation = 'Criança Órfã'; }
                            else if (value === 'PP_Vulnerable_Population_Yes_Person_Disability') { masterCardModel.patientInfo.vulPopulation = 'Pessoa com deficiência'; }
                            else if (value === 'PP_Vulnerable_Population_Yes_Seasonal_Workers') { masterCardModel.patientInfo.vulPopulation = 'Trabalhadores sazonais'; }
                            else if (value === 'PP_Vulnerable_Population_Yes_Miner') { masterCardModel.patientInfo.vulPopulation = 'Mineiro'; }
                            else if (value === 'PP_Vulnerable_Population_Yes_Truck_driver') { masterCardModel.patientInfo.vulPopulation = 'Camionista'; }
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
                            if (value === 'PP_Key_population_PID') { masterCardModel.patientInfo.keyPopulation = value; }
                            else if (value === 'PP_Key_population_HSH') { masterCardModel.patientInfo.keyPopulation = value; }
                            else if (value === 'PP_Key_population_REC') { masterCardModel.patientInfo.keyPopulation = value; }
                            else if (value === 'PP_Key_population_MTS') { masterCardModel.patientInfo.keyPopulation = value; }
                            else if (value === 'PP_Key_population_Other') { masterCardModel.patientInfo.keyPopulation = value; }
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

            var populatePatientLabResults = function (visitUuid) {
                masterCardModel.labOrderResult = {};
                var labResultsToShow = ['ALT', 'AST', 'CD 4', 'CD4 %', 'CD4 Abs', 'HGB', 'CARGA VIRAL (Absoluto-Rotina)', 'CARGA VIRAL(Qualitativo-Rotina)', 'Other', 'Outros'];
                return new Promise(function (resolve, reject) {
                    labOrderResultService.getAllForPatient({ patientUuid: patientUuid, visitUuids: visitUuid }).then(function (response) {
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

            var populatePatientBloodPressureS = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientBPSConcept = 'Blood_Pressure_–_Systolic_VS1';
                    // masterCardModel.encountersInfo.bPressure = '';
                    // masterCardModel.encountersInfo.bPressureS = '';
                    // masterCardModel.encountersInfo.bPressureD = '';
                    // var bPressureS = '';

                    observationsService.fetchForEncounter(encUuid, patientBPSConcept).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.bPressureS = response.data[0].value;
                            // bPressureS = response.data[0].value;
                            masterCardModel.encounterTemp.bPressureS = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populatePatientBloodPressureD = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientBPDConcept = 'BP_Diastolic_VSNormal';
                    // masterCardModel.encountersInfo.bPressure = '';
                    // masterCardModel.encountersInfo.bPressureS = '';
                    // masterCardModel.encountersInfo.bPressureD = '';
                    var bPressureD = '';

                    observationsService.fetchForEncounter(encUuid, patientBPDConcept).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.bPressureD = response.data[0].value;
                            // bPressureD = response.data[0].value;
                            masterCardModel.encounterTemp.bPressureD = response.data[0].value;
                        }
                        resolve();
                        // masterCardModel.encountersInfo.bPressure = masterCardModel.encountersInfo.bPressureS + '/' + masterCardModel.encountersInfo.bPressureD;
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncPatientPregnancy = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientPreg = 'Pregnancy_Yes_No';
                    var encPregnancy = '';

                    observationsService.fetchForEncounter(encUuid, patientPreg).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encPregnancy = response.data[0].value.shortName;
                            // encPregnancy = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encPregnancy = response.data[0].value.shortName;
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
                    var encLastMenstrual = '';

                    observationsService.fetchForEncounter(encUuid, patientMest).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encLastMenstrual = response.data[0].value;
                            // encLastMenstrual = response.data[0].value;
                            masterCardModel.encounterTemp.encLastMenstrual = response.data[0].value;
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
                    var encLact = '';

                    observationsService.fetchForEncounter(encUuid, patientLact).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            if (response.data[0].value === true) {
                                // masterCardModel.encountersInfo.encLact = 'Sim';
                                // encLact = 'Sim';
                                masterCardModel.encounterTemp.encLact = 'Sim';
                            }
                            else if (response.data[0].value === false) {
                                // masterCardModel.encountersInfo.encLact = 'Não';
                                // encLact = 'Não';
                                masterCardModel.encounterTemp.encLact = 'Não';
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFamPlaningC = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFPCondom = 'Family_Planning_Contraceptive_Methods_PRES_Condom_button';
                    var encFPCondom = '';

                    observationsService.fetchForEncounter(encUuid, patientFPCondom).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encFPCondom = response.data[0].value.shortName;
                            // encFPCondom = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encFPCondom = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFamPlaningV = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFPVas = 'Family_Planning_Contraceptive_Methods_VAS_Vasectomy_button';
                    var encFPVas = '';

                    observationsService.fetchForEncounter(encUuid, patientFPVas).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encFPVas = response.data[0].value.shortName;
                            // encFPVas = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encFPVas = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFamPlaningP = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFPPil = 'Family_Planning_Contraceptive_Methods_PIL_Oral_Contraceptive_button';
                    var encFPPil = '';

                    observationsService.fetchForEncounter(encUuid, patientFPPil).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encFPPil = response.data[0].value.shortName;
                            // encFPPil = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encFPPil = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFamPlaningI = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFPInj = 'Family_Planning_Contraceptive_Methods_INJ_Injection_button';
                    var encFPInj = '';

                    observationsService.fetchForEncounter(encUuid, patientFPInj).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encFPInj = response.data[0].value.shortName;
                            // encFPInj = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encFPInj = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFamPlaningImp = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFPImp = 'Family_Planning_Contraceptive_Methods_IMP_Implant_button';
                    var encFPImp = '';

                    observationsService.fetchForEncounter(encUuid, patientFPImp).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encFPImp = response.data[0].value.shortName;
                            // encFPImp = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encFPImp = response.data[0].value.shortName;
                        }
                        resolve(encFPImp);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFamPlaningD = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFPDiu = 'Family_Planning_Contraceptive_Methods_DIU_Intra_button';
                    var encFPDui = '';
                    observationsService.fetchForEncounter(encUuid, patientFPDiu).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encFPDui = response.data[0].value.shortName;
                            // encFPDui = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encFPDui = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFamPlaningLT = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFPLT = 'Family_Planning_Contraceptive_Methods_LT_Tubal_Ligation_button';
                    var encFPLT = '';
                    observationsService.fetchForEncounter(encUuid, patientFPLT).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encFPLT = response.data[0].value.shortName;
                            // encFPLT = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encFPLT = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFamPlaningM = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFPMal = 'Family_Planning_Contraceptive_Methods_MAL_Lactational_Amenorrhea_Method_button';
                    var encFPMal = '';
                    observationsService.fetchForEncounter(encUuid, patientFPMal).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encFPMal = response.data[0].value.shortName;
                            // encFPMal = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encFPMal = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFamPlaningO = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFPOut = 'Family_Planning_Contraceptive_Methods_OUT_Other_button';
                    var encFPOut = '';
                    observationsService.fetchForEncounter(encUuid, patientFPOut).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encFPOut = response.data[0].value.shortName;
                            // encFPOut = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encFPOut = response.data[0].value.shortName;
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
                    var encStaging = '';

                    observationsService.fetchForEncounter(encUuid, patientStage).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encStaging = response.data[0].value.shortName;
                            // encStaging = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encStaging = response.data[0].value.shortName;
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
                    var encEdema = '';

                    observationsService.fetchForEncounter(encUuid, patientEdema).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encEdema = response.data[0].value.shortName;
                            // encEdema = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encEdema = response.data[0].value.shortName;
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
                    var encWeight = '';

                    observationsService.fetchForEncounter(encUuid, patientWeight).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encWeight = response.data[0].value;
                            // encWeight = response.data[0].value;
                            masterCardModel.encounterTemp.encWeight = response.data[0].value;
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
                    var encHeight = '';

                    observationsService.fetchForEncounter(encUuid, patientHeight).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encHeight = response.data[0].value;
                            // encHeight = response.data[0].value;
                            masterCardModel.encounterTemp.encHeight = response.data[0].value;
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
                    var encBP = '';

                    observationsService.fetchForEncounter(encUuid, patientBP).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encBP = response.data[0].value;
                            // encBP = response.data[0].value;
                            masterCardModel.encounterTemp.encBP = response.data[0].value;
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
                    var encIMC = '';

                    observationsService.fetchForEncounter(encUuid, patientIMC).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encIMC = response.data[0].value;
                            // encIMC = response.data[0].value;
                            masterCardModel.encounterTemp.encIMC = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            /* if (masterCardModel.encountersInfo.encIMC !== undefined) {
                masterCardModel.encountersInfo.encIndicador = 'IMC';
            }
            else if (masterCardModel.encountersInfo.encBP !== undefined) {
                masterCardModel.encountersInfo.encIndicador = 'PB';
            } */

            var populateEncEstadoNutricional = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientEstadoNutricional = 'Nutritional_States_new';
                    var encEstadoNutricional = '';
                    observationsService.fetchForEncounter(encUuid, patientEstadoNutricional).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encEstadoNutricional = response.data[0].value.shortName;
                            // encEstadoNutricional = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encEstadoNutricional = response.data[0].value.shortName;
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
                    var encNutriEd = '';
                    observationsService.fetchForEncounter(encUuid, patientNutriEd).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            if (response.data[0].value === true) {
                                // masterCardModel.encountersInfo.encNutriEd = 'Sim';
                                // encNutriEd = "Sim";
                                masterCardModel.encounterTemp.encNutriEd = 'Sim';
                            }
                            else if (response.data[0].value === false) {
                                // masterCardModel.encountersInfo.encNutriEd = 'Não';
                                // encNutriEd = "Não";
                                masterCardModel.encounterTemp.encNutriEd = 'Não';
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncNutriEdTipo = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientNutriEdTipo = 'Nutrition Supplement';
                    var encNutriEdTipo = '';
                    observationsService.fetchForEncounter(encUuid, patientNutriEdTipo).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encNutriEdTipo = response.data[0].value.shortName;
                            // encNutriEdTipo = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encNutriEdTipo = response.data[0].value.shortName;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncNutriEdQty = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientNutriEdQty = 'Quantity of Nutritional Supplement';
                    var encNutriEdQty = '';
                    observationsService.fetchForEncounter(encUuid, patientNutriEdQty).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encNutriEdQty = response.data[0].value;
                            // encNutriEdQty = response.data[0].value;
                            masterCardModel.encounterTemp.encNutriEdQty = response.data[0].value;
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncNutriEdQtyUnit = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientNutriEdQtyUnit = 'SP_Measurement_Unit';
                    var encNutriEdQtyUnit = '';
                    observationsService.fetchForEncounter(encUuid, patientNutriEdQtyUnit).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encNutriEdQtyUnit = response.data[0].value.shortName;
                            // encNutriEdQtyUnit = response.data[0].value.shortName;
                            masterCardModel.encounterTemp.encNutriEdQtyUnit = response.data[0].value.shortName;
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
                    var encTB = '';

                    observationsService.fetchForEncounter(encUuid, patientTB).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encTB = response.data[0].value;
                            encTB = response.data[0].value;
                        }
                        resolve(encTB);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncTBDiag = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientTBDiag = 'Date of Diagnosis';
                    var encTBDiag = '';

                    observationsService.fetchForEncounter(encUuid, patientTBDiag).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            if (response.data[0].value !== undefined) {
                                // masterCardModel.encountersInfo.encTBDiag = true;
                                encTBDiag = true;
                            }
                            else {
                                // masterCardModel.encountersInfo.encTBDiag = false;
                                encTBDiag = false;
                            }
                        }
                        resolve(encTBDiag);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncTBSym = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientTBSym = 'Symptoms Prophylaxis_New';
                    var encTBSym = '';

                    observationsService.fetchForEncounter(encUuid, patientTBSym).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encTBSym = response.data[0].value.shortName;
                            encTBSym = response.data[0].value.shortName;
                        }
                        resolve(encTBSym);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncTBStartDate = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientTBStartDate = 'SP_Treatment Start Date';
                    var encTBStartDate = '';
                    observationsService.fetchForEncounter(encUuid, patientTBStartDate).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encTBStartDate = response.data[0].value;
                            encTBStartDate = response.data[0].value.name;
                        }
                        resolve(encTBStartDate);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncTBStatus = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientTBStatus = 'SP_Treatment State';
                    var encTBStatus = '';
                    observationsService.fetchForEncounter(encUuid, patientTBStatus).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encTBStatus = response.data[0].value.name;
                            encTBStatus = response.data[0].value.name;
                        }
                        resolve(encTBStatus);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncINHState = function (patientUuid, visitUuid) {
                return new Promise(function (resolve, reject) {
                    var patientINHState = 'INH_Details';
                    var encINHState = '';
                    observationsService.fetch(patientUuid, [patientINHState], null, null, visitUuid).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            var pPValues = response.data[0].value.split(',');
                            pPValues.forEach(function (value) {
                                value = value.trim();
                                if (value === 'Inicio_Prophylaxis') {
                                    // masterCardModel.encountersInfo.encINHState = value;
                                    encINHState = value;
                                } else if (value === 'Em Curso_Prophylaxis') {
                                    // masterCardModel.encountersInfo.encINHState = value;
                                    encINHState = value;
                                } else if (value === 'Fim_Prophylaxis') {
                                    // masterCardModel.encountersInfo.encINHState = value;
                                    encINHState = value;
                                }
                            });
                        }
                    });
                    resolve(encINHState);
                });
            };

            var populateEncCTZState = function (patientUuid, visitUuid) {
                return new Promise(function (resolve, reject) {
                    var patientCTZState = 'CTZ_Details';
                    var encCTZState = '';
                    observationsService.fetch(patientUuid, [patientCTZState], null, null, visitUuid).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            var pPValues = response.data[0].value.split(',');
                            pPValues.forEach(function (value) {
                                value = value.trim();
                                if (value === 'Inicio_Prophylaxis') {
                                    // masterCardModel.encountersInfo.encCTZState = value;
                                    encCTZState = value;
                                } else if (value === 'Em Curso_Prophylaxis') {
                                    // masterCardModel.encountersInfo.encCTZState = value;
                                    encCTZState = value;
                                } else if (value === 'Fim_Prophylaxis') {
                                    // masterCardModel.encountersInfo.encCTZState = value;
                                    encCTZState = value;
                                }
                            });
                        }
                    });
                    resolve(encCTZState);
                });
            };

            var populateEncINHSideEffect = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientINHSideEffects = 'SP_Side_Effects_INH';
                    var encINHSideEffects = '';
                    observationsService.fetchForEncounter(encUuid, patientINHSideEffects).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encINHSideEffects = response.data[0].value;
                            encINHSideEffects = response.data[0].value;
                        }
                        resolve(encINHSideEffects);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncCTZSideEffect = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientCTZSideEffects = 'SP_Side_Effects_CTZ';
                    var encCTZSideEffects = '';
                    observationsService.fetchForEncounter(encUuid, patientCTZSideEffects).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encCTZSideEffects = response.data[0].value;
                            encCTZSideEffects = response.data[0].value;
                        }
                        resolve(encCTZSideEffects);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncITS = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientITS = 'Has STI Symptoms';
                    var encITS = '';
                    observationsService.fetchForEncounter(encUuid, patientITS).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encITS = response.data[0].value;
                            encITS = response.data[0].value;
                        }
                        resolve(encITS);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncITSDiag = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientITSDiag = 'STI Diagnosis_Prophylaxis';
                    var encITSDiag = '';
                    observationsService.fetchForEncounter(encUuid, patientITSDiag).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encITSDiag = response.data[0].value.shortName;
                            encITSDiag = response.data[0].value.shortName;
                        }
                        resolve(encITSDiag);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncITSSAM = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientSAM = 'Syndromic Approach_STI_M';
                    var encITSSAM = '';
                    observationsService.fetchForEncounter(encUuid, patientSAM).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encITSSAM = response.data[0].value.shortName;
                            encITSSAM = response.data[0].value.shortName;
                        }
                        resolve(encITSSAM);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncITSSAF = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientSAF = 'Syndromic Approach_STI_F';
                    var encITSSAF = '';
                    observationsService.fetchForEncounter(encUuid, patientSAF).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encITSSAF = response.data[0].value.shortName;
                            encITSSAF = response.data[0].value.shortName;
                        }
                        resolve(encITSSAF);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncDiagnosis = function (patientUuid, visitUuid) {
                return new Promise(function (resolve, reject) {
                    var encDiag = [];
                    diagnosisService.getDiagnoses(patientUuid, visitUuid).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            for (var i = 0; i <= response.data.length; i++) {
                                if (response.data[i] !== undefined) {
                                    encDiag.push(response.data[i].codedAnswer.shortName);
                                    // masterCardModel.encountersInfo.encDiag = valArr;
                                }
                            }
                        }
                        resolve(encDiag);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncInvestigations = function (data) {
                /* // masterCardModel.encountersInfo.encLabReq = []; */
                var encLabReq = [];
                for (var i = 0; i <= data.orders.length; i++) {
                    if (data.orders[i] !== undefined) {
                        encLabReq.push(data.orders[i].display);
                        // masterCardModel.encountersInfo.encLabReq.push(data.orders[i].display);
                        // masterCardModel.encountersInfo.encLabReq = orderArr;
                    }
                }
                return encLabReq;
            };

            var populateEncRef = function (patientUuid, visitUuid) {
                return new Promise(function (resolve, reject) {
                    var patientRef = 'Reference_Other_Services';
                    var encRef = [];
                    observationsService.fetch(patientUuid, [patientRef], null, null, visitUuid).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            for (var i = 0; i <= response.data.length; i++) {
                                if (response.data[i] !== undefined && encRef.indexOf(response.data[i].valueAsString) === -1) {
                                    encRef.push(response.data[i].valueAsString);
                                }
                            }
                            // masterCardModel.encountersInfo.encRef = refArr;
                            resolve(encRef);
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncSG = function (visitUuid) {
                return new Promise(function (resolve, reject) {
                    var patientSG = 'Reference_Section_Support_Group';
                    var encSG = [];
                    observationsService.fetch(patientUuid, [patientSG], null, null, visitUuid).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            for (var i = 0; i <= response.data.length; i++) {
                                if (response.data[i] !== undefined) {
                                    var pGroup = response.data[i].groupMembers;
                                    for (var i = 0; i <= pGroup.length; i++) {
                                        if (pGroup[i] !== undefined && pGroup[i].concept.name !== 'Reference_Other_Specify_Group_Other') {
                                            encSG.push(pGroup[i].conceptNameToDisplay);
                                        }
                                    }
                                }
                            }
                            // masterCardModel.encountersInfo.encSG = sGArr;
                            resolve(encSG);
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncMDC = function (patientUuid, visitUuid) {
                return new Promise(function (resolve, reject) {
                    var patientMDC = 'Reference_MDC_Section';
                    var encMDC = [];
                    observationsService.fetch(patientUuid, [patientMDC], null, null, visitUuid).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            for (var i = 0; i <= response.data.length; i++) {
                                if (response.data[i] !== undefined) {
                                    var pGroup = response.data[i].groupMembers;
                                    for (var i = 0; i <= pGroup.length; i++) {
                                        if (pGroup[i] !== undefined && pGroup[i].concept.name !== 'Reference_Eligible' && pGroup[i].concept.name !== 'Reference_MDC_Other_comments') {
                                            encMDC.push(pGroup[i].conceptNameToDisplay);
                                        }
                                    }
                                }
                            }
                            // masterCardModel.encountersInfo.encMDC = mDCArr;
                            resolve(encMDC);
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncCR = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientCR = 'Reference_CR';
                    var encCR = '';
                    observationsService.fetchForEncounter(encUuid, patientCR).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encCR = response.data[0].value.name;
                            encCR = response.data[0].value.name;
                        }
                        resolve(encCR);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncPC = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientPC = 'Reference_PC';
                    var encPC = '';
                    observationsService.fetchForEncounter(encUuid, patientPC).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encPC = response.data[0].value.name;
                            encPC = response.data[0].value.name;
                        }
                        resolve(encPC);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncAR = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientAR = 'Reference_AR';
                    var encAR = '';
                    observationsService.fetchForEncounter(encUuid, patientAR).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encAR = response.data[0].value.name;
                            encAR = response.data[0].value.name;
                        }
                        resolve(encAR);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncMPS = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientMPS = 'Reference_MPS';
                    var encMPS = '';
                    observationsService.fetchForEncounter(encUuid, patientMPS).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encMPS = response.data[0].value.name;
                            encMPS = response.data[0].value.name;
                        }
                        resolve(encMPS);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncGroupOther = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientOther = 'Reference_Other_Specify_Group';
                    var encGroupOther = '';
                    observationsService.fetchForEncounter(encUuid, patientOther).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encGroupOther = response.data[0].value.name;
                            encGroupOther = response.data[0].value.name;
                        }
                        resolve(encGroupOther);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncGA = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientGA = 'Reference_GA';
                    var encGA = '';
                    observationsService.fetchForEncounter(encUuid, patientGA).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encGA = response.data[0].value.name;
                            encGA = response.data[0].value.name;
                        }
                        resolve(encGA);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncAF = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientAF = 'Reference_AF';
                    var encAF = '';
                    observationsService.fetchForEncounter(encUuid, patientAF).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encAF = response.data[0].value.name;
                            encAF = response.data[0].value.name;
                        }
                        resolve(encAF);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncCA = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientCA = 'Reference_CA';
                    var encCA = '';
                    observationsService.fetchForEncounter(encUuid, patientCA).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encCA = response.data[0].value.name;
                            encCA = response.data[0].value.name;
                        }
                        resolve(encCA);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncPU = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientPU = 'Reference_PU';
                    var encPU = '';
                    observationsService.fetchForEncounter(encUuid, patientPU).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encPU = response.data[0].value.name;
                            encPU = response.data[0].value.name;
                        }
                        resolve(encPU);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncFR = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientFR = 'Reference_FR';
                    var encFR = '';
                    observationsService.fetchForEncounter(encUuid, patientFR).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encFR = response.data[0].value.name;
                            encFR = response.data[0].value.name;
                        }
                        resolve(encFR);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncDT = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientDT = 'Reference_DT';
                    var encDT = '';
                    observationsService.fetchForEncounter(encUuid, patientDT).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encDT = response.data[0].value.name;
                            encDT = response.data[0].value.name;
                        }
                        resolve(encDT);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncDC = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientDC = 'Reference_DC';
                    var encDC = '';
                    observationsService.fetchForEncounter(encUuid, patientDC).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encDC = response.data[0].value.name;
                            encDC = response.data[0].value.name;
                        }
                        resolve(encDC);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncMDCOther = function (encUuid) {
                return new Promise(function (resolve, reject) {
                    var patientMDCother = 'Reference_MDC_Other';
                    var encMDCOther = '';
                    observationsService.fetchForEncounter(encUuid, patientMDCother).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            // masterCardModel.encountersInfo.encMDCOther = response.data[0].value.name;
                            encMDCOther = response.data[0].value.name;
                        }
                        resolve(encMDCOther);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var visitHist = function () {
                masterCardModel.encounterArr = [];
                return new Promise(function (resolve, reject) {
                    patientVisitHistoryService.getVisitHistory(patientUuid, null).then(function (response) {
                        if (response.visits && response.visits.length > 0) {
                            var visitVar = '';
                            var encoVar = '';
                            // var encounterArr = []; // encounter data used for all info
                            for (var i = 0; i <= response.visits.length; i++) {
                                if (response.visits[i] !== undefined) {
                                    visitVar = response.visits[i];
                                    if (visitVar.encounters.length > 0) {
                                        for (var y = 0; y <= visitVar.encounters.length; y++) {
                                            if (visitVar.encounters[y] !== undefined) {
                                                encoVar = visitVar.encounters[y];
                                                masterCardModel.encounterArr.push(encoVar);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        resolve();
                        populateEncounterDetails(masterCardModel.encounterArr);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateEncounterDetails = function (enc) {
                masterCardModel.encountersInfo = [];
                var patientUuid = $rootScope.patient.uuid;
                for (var i = 0; i <= enc.length; i++) {
                    /* masterCardModel.encounterTemp = {
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
                        encINHState: '',
                        encCTZState: '',
                        encINHSideEffects: '',
                        encCTZSideEffects: '',
                        encITS: '',
                        encITSDiag: '',
                        encITSSAM: '',
                        encITSSAF: '',
                        encDiag: '',
                        encLabReq: '',
                        encRef: '',
                        encSG: '',
                        encMDC: '',
                        encCR: '',
                        encPC: '',
                        encAR: '',
                        encMPS: '',
                        encGroupOther: '',
                        encGA: '',
                        encAF: '',
                        encCA: '',
                        encPU: '',
                        encFR: '',
                        encDT: '',
                        encDC: '',
                        encMDCOther: ''
                    }; */
                    var flattenObject = function (ob) {
                        var toReturn = {};

                        for (var i in ob) {
                            if (!ob.hasOwnProperty(i)) continue;

                            if ((typeof ob[i]) == 'object') {
                                var flatObject = flattenObject(ob[i]);
                                for (var x in flatObject) {
                                    if (!flatObject.hasOwnProperty(x)) continue;

                                    toReturn[i + '.' + x] = flatObject[x];
                                    if (ob[i].concept !== undefined) {
                                        if (ob[i].concept.name === 'Blood_Pressure_–_Systolic_VS1' && ob[i].value !== undefined) { masterCardModel.encounterTemp.bPressureS = ob[i].value; }
                                        else if (ob[i].concept.name === 'BP_Diastolic_VSNormal' && ob[i].value !== undefined) { masterCardModel.encounterTemp.bPressureD = ob[i].value; }
                                        else if (ob[i].concept.name === 'Pregnancy_Yes_No' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encPregnancy = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Last Menstruation Date' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encLastMenstrual = ob[i].value; }
                                        else if (ob[i].concept.name === 'Breastfeeding_ANA' && ob[i].value !== undefined) {
                                            if (ob[i].value === true) { masterCardModel.encounterTemp.encLact = "Sim"; }
                                            if (ob[i].value === false) { masterCardModel.encounterTemp.encLact = "Não"; }
                                        }
                                        else if (ob[i].concept.name === 'Family_Planning_Contraceptive_Methods_PRES_Condom_button' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encFPCondom = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Family_Planning_Contraceptive_Methods_VAS_Vasectomy_button' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encFPVas = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Family_Planning_Contraceptive_Methods_PIL_Oral_Contraceptive_button' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encFPPil = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Family_Planning_Contraceptive_Methods_INJ_Injection_button' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encFPInj = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Family_Planning_Contraceptive_Methods_IMP_Implant_button' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encFPImp = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Family_Planning_Contraceptive_Methods_DIU_Intra_button' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encFPDui = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Family_Planning_Contraceptive_Methods_LT_Tubal_Ligation_button' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encFPLT = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Family_Planning_Contraceptive_Methods_MAL_Lactational_Amenorrhea_Method_button' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encFPMal = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Family_Planning_Contraceptive_Methods_OUT_Other_button' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encFPOut = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'HTC, WHO Staging' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encStaging = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Infants Odema_Prophylaxis' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encEdema = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'WEIGHT' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encWeight = ob[i].value; }
                                        else if (ob[i].concept.name === 'HEIGHT' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encHeight = ob[i].value; }
                                        else if (ob[i].concept.name === 'Brachial_perimeter_new' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encBP = ob[i].value; }
                                        else if (ob[i].concept.name === 'BMI' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encIMC = ob[i].value; }
                                        else if (ob[i].concept.name === 'Nutritional_States_new' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encEstadoNutricional = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Received nutritional education' && ob[i].value !== undefined) {
                                            if (ob[i].value === true) { masterCardModel.encounterTemp.encNutriEd = "Sim"; }
                                            if (ob[i].value === false) { masterCardModel.encounterTemp.encNutriEd = "Não"; }
                                        }
                                        else if (ob[i].concept.name === 'Nutrition Supplement' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encNutriEdTipo = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Quantity of Nutritional Supplement' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encNutriEdQty = ob[i].value; }
                                        else if (ob[i].concept.name === 'SP_Measurement_Unit' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encNutriEdQtyUnit = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Has TB Symptoms' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encTB = ob[i].value; }
                                        else if (ob[i].concept.name === 'Date of Diagnosis' && ob[i].value !== undefined) {
                                            if (ob[i].value !== undefined) { masterCardModel.encounterTemp.encTBDiag = true; }
                                            else { masterCardModel.encounterTemp.encTBDiag = false; }
                                        }
                                        else if (ob[i].concept.name === 'Symptoms Prophylaxis_New' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encTBSym = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'SP_Treatment Start Date' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encTBStartDate = ob[i].value; }
                                        else if (ob[i].concept.name === 'SP_Treatment State' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encTBStatus = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'INH_Details' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encINHState = ob[i].value; }
                                        else if (ob[i].concept.name === 'CTZ_Details' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encCTZState = ob[i].value; }
                                        else if (ob[i].concept.name === 'SP_Side_Effects_INH' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encINHSideEffects = ob[i].value; }
                                        else if (ob[i].concept.name === 'SP_Side_Effects_CTZ' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encCTZSideEffects = ob[i].value; }
                                        else if (ob[i].concept.name === 'Has STI Symptoms' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encITS = ob[i].value; }
                                        else if (ob[i].concept.name === 'STI Diagnosis_Prophylaxis' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encITSDiag = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Syndromic Approach_STI_M' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encITSSAM = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Syndromic Approach_STI_F' && ob[i].shortName !== undefined) { masterCardModel.encounterTemp.encITSSAF = ob[i].shortName; }
                                        else if (ob[i].concept.name === 'Reference_CR' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encCR = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_PC' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encPC = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_AR' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encAR = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_MPS' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encMPS = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_Other_Specify_Group' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encGroupOther = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_GA' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encGA = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_AF' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encAF = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_CA' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encCA = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_PU' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encPU = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_FR' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encFR = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_DT' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encDT = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_DC' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encDC = ob[i].value.name; }
                                        else if (ob[i].concept.name === 'Reference_MDC_Other' && ob[i].value !== undefined) { masterCardModel.encounterTemp.encMDCOther = ob[i].value.name; }
                                    }
                                }
                            } else {
                                toReturn[i] = ob[i];
                            }
                        }
                        console.log(toReturn);
                        return toReturn;
                    };

                    var promise = new Promise(function (resolve, reject) {
                        if (enc[i] !== undefined) {
                             encounterService.findByEncounterUuid(enc[i].uuid).then(function (response) {
                                for (var i = 0; i <= response.data.observations.length; i++) {
                                    var obs = response.data.observations[i];
                                    // console.log(obs);
                                    flattenObject(obs);
                                    console.log(masterCardModel.encounterTemp);
                                }
                                resolve();
                            }).catch(function (error) {
                                reject(error);
                            });
                            masterCardModel.encounterTemp.actualEncounter = enc[i].encounterDatetime;
                            // populatePatientBloodPressureS(enc[i].uuid).then(values => { masterCardModel.encounterTemp.bPressureS = values; console.log(masterCardModel.encounterTemp.bPressureS); return masterCardModel.encounterTemp.bPressureS; });
                            // populatePatientBloodPressureS(enc[i].uuid).then(function (result) { masterCardModel.encounterTemp.bPressureS = result; console.log(masterCardModel.encounterTemp.bPressureS); return masterCardModel.encounterTemp.bPressureS; });
                            // populatePatientBloodPressureS(enc[i].uuid);
                            /* console.log(masterCardModel.encounterTemp.bPressureS);
                            masterCardModel.encounterTemp.bPressureD = populatePatientBloodPressureD(enc[i].uuid);
                            masterCardModel.encounterTemp.bPressure = masterCardModel.encounterTemp.bPressureS + '/' + masterCardModel.encounterTemp.bPressureD;

                            masterCardModel.encounterTemp.encPregnancy = populateEncPatientPregnancy(enc[i].uuid);
                            masterCardModel.encounterTemp.encLastMenstrual = populateEncLastMenstrual(enc[i].uuid);
                            masterCardModel.encounterTemp.encLact = populateEncLact(enc[i].uuid);
                            masterCardModel.encounterTemp.encFPCondom = populateEncFamPlaningC(enc[i].uuid);
                            masterCardModel.encounterTemp.encFPVas = populateEncFamPlaningV(enc[i].uuid);
                            masterCardModel.encounterTemp.encFPPil = populateEncFamPlaningP(enc[i].uuid);
                            masterCardModel.encounterTemp.encFPInj = populateEncFamPlaningI(enc[i].uuid);
                            masterCardModel.encounterTemp.encFPImp = populateEncFamPlaningImp(enc[i].uuid);
                            masterCardModel.encounterTemp.encFPDui = populateEncFamPlaningD(enc[i].uuid);
                            masterCardModel.encounterTemp.encFPLT = populateEncFamPlaningLT(enc[i].uuid);
                            masterCardModel.encounterTemp.encFPMal = populateEncFamPlaningM(enc[i].uuid);
                            masterCardModel.encounterTemp.encFPOut = populateEncFamPlaningO(enc[i].uuid);
                            masterCardModel.encounterTemp.encStaging = populateEncStaging(enc[i].uuid);
                            masterCardModel.encounterTemp.encEdema = populateEncEdema(enc[i].uuid);
                            masterCardModel.encounterTemp.encWeight = populateEncWeight(enc[i].uuid);
                            masterCardModel.encounterTemp.encHeight = populateEncHeight(enc[i].uuid);
                            masterCardModel.encounterTemp.encBP = populateEncBP(enc[i].uuid);
                            masterCardModel.encounterTemp.encIMC = populateEncIMC(enc[i].uuid);
                            if (masterCardModel.encounterTemp.encIMC !== undefined) {
                                masterCardModel.encounterTemp.encIndicador = 'IMC';
                            } else if (masterCardModel.encounterTemp.encBP !== undefined) {
                                masterCardModel.encounterTemp.encIndicador = 'PB';
                            }
                            masterCardModel.encounterTemp.encEstadoNutricional = populateEncEstadoNutricional(enc[i].uuid);
                            masterCardModel.encounterTemp.encNutriEd = populateEncNutriEd(enc[i].uuid);
                            masterCardModel.encounterTemp.encNutriEdTipo = populateEncNutriEdTipo(enc[i].uuid);
                            masterCardModel.encounterTemp.encNutriEdQty = populateEncNutriEdQty(enc[i].uuid);
                            masterCardModel.encounterTemp.encNutriEdQtyUnit = populateEncNutriEdQtyUnit(enc[i].uuid);
                            masterCardModel.encounterTemp.encTB = populateEncTB(enc[i].uuid);
                            masterCardModel.encounterTemp.encTBDiag = populateEncTBDiag(enc[i].uuid);
                            masterCardModel.encounterTemp.encTBSym = populateEncTBSym(enc[i].uuid);
                            masterCardModel.encounterTemp.encTBStartDate = populateEncTBStartDate(enc[i].uuid);
                            masterCardModel.encounterTemp.encTBStatus = populateEncTBStatus(enc[i].uuid);
                            masterCardModel.encounterTemp.encINHState = populateEncINHState(patientUuid, enc[i].visit.uuid);
                            masterCardModel.encounterTemp.encCTZState = populateEncCTZState(patientUuid, enc[i].visit.uuid);
                            masterCardModel.encounterTemp.encINHSideEffects = populateEncINHSideEffect(enc[i].uuid);
                            masterCardModel.encounterTemp.encCTZSideEffects = populateEncCTZSideEffect(enc[i].uuid);
                            masterCardModel.encounterTemp.encITS = populateEncITS(enc[i].uuid);
                            masterCardModel.encounterTemp.encITSDiag = populateEncITSDiag(enc[i].uuid);
                            masterCardModel.encounterTemp.encITSSAM = populateEncITSSAM(enc[i].uuid);
                            masterCardModel.encounterTemp.encITSSAF = populateEncITSSAF(enc[i].uuid);
                            masterCardModel.encounterTemp.encDiag = populateEncDiagnosis(patientUuid, enc[i].visit.uuid);
                            masterCardModel.encounterTemp.encLabReq = populateEncInvestigations(enc[i]);
                            masterCardModel.encounterTemp.encRef = populateEncRef(patientUuid, enc[i].visit.uuid);
                            masterCardModel.encounterTemp.encSG = populateEncSG(enc[i].visit.uuid);
                            masterCardModel.encounterTemp.encMDC = populateEncMDC(patientUuid, enc[i].visit.uuid);
                            masterCardModel.encounterTemp.encCR = populateEncCR(enc[i].uuid);
                            masterCardModel.encounterTemp.encPC = populateEncPC(enc[i].uuid);
                            masterCardModel.encounterTemp.encAR = populateEncAR(enc[i].uuid);
                            masterCardModel.encounterTemp.encMPS = populateEncMPS(enc[i].uuid);
                            masterCardModel.encounterTemp.encGroupOther = populateEncGroupOther(enc[i].uuid);
                            masterCardModel.encounterTemp.encGA = populateEncGA(enc[i].uuid);
                            masterCardModel.encounterTemp.encAF = populateEncAF(enc[i].uuid);
                            masterCardModel.encounterTemp.encCA = populateEncCA(enc[i].uuid);
                            masterCardModel.encounterTemp.encPU = populateEncPU(enc[i].uuid);
                            masterCardModel.encounterTemp.encFR = populateEncFR(enc[i].uuid);
                            masterCardModel.encounterTemp.encDT = populateEncDT(enc[i].uuid);
                            masterCardModel.encounterTemp.encDC = populateEncDC(enc[i].uuid);
                            masterCardModel.encounterTemp.encMDCOther = populateEncMDCOther(enc[i].uuid); */

                            /* populatePatientBloodPressureS(enc[i].uuid);
                            populatePatientBloodPressureD(enc[i].uuid);
                            masterCardModel.encounterTemp.bPressure = masterCardModel.encounterTemp.bPressureS + '/' + masterCardModel.encounterTemp.bPressureD;
                            populateEncPatientPregnancy(enc[i].uuid);
                            populateEncLastMenstrual(enc[i].uuid);
                            populateEncLact(enc[i].uuid);
                            populateEncFamPlaningC(enc[i].uuid);
                            populateEncFamPlaningV(enc[i].uuid);
                            populateEncFamPlaningP(enc[i].uuid);
                            populateEncFamPlaningI(enc[i].uuid);
                            populateEncFamPlaningImp(enc[i].uuid);
                            populateEncFamPlaningD(enc[i].uuid);
                            populateEncFamPlaningLT(enc[i].uuid);
                            populateEncFamPlaningM(enc[i].uuid);
                            populateEncFamPlaningO(enc[i].uuid);
                            populateEncStaging(enc[i].uuid);
                            populateEncEdema(enc[i].uuid);
                            populateEncWeight(enc[i].uuid);
                            populateEncHeight(enc[i].uuid);
                            populateEncBP(enc[i].uuid);
                            populateEncIMC(enc[i].uuid);
                            if (masterCardModel.encounterTemp.encIMC !== undefined) {
                                masterCardModel.encounterTemp.encIndicador = 'IMC';
                            } else if (masterCardModel.encounterTemp.encBP !== undefined) {
                                masterCardModel.encounterTemp.encIndicador = 'PB';
                            }
                            populateEncEstadoNutricional(enc[i].uuid);
                            populateEncNutriEd(enc[i].uuid);
                            populateEncNutriEdTipo(enc[i].uuid);
                            populateEncNutriEdQty(enc[i].uuid);
                            populateEncNutriEdQtyUnit(enc[i].uuid);
                            populateEncTB(enc[i].uuid);
                            populateEncTBDiag(enc[i].uuid);
                            populateEncTBSym(enc[i].uuid);
                            populateEncTBStartDate(enc[i].uuid);
                            populateEncTBStatus(enc[i].uuid);
                            populateEncINHState(patientUuid, enc[i].visit.uuid);
                            populateEncCTZState(patientUuid, enc[i].visit.uuid);
                            populateEncINHSideEffect(enc[i].uuid);
                            populateEncCTZSideEffect(enc[i].uuid);
                            populateEncITS(enc[i].uuid);
                            populateEncITSDiag(enc[i].uuid);
                            populateEncITSSAM(enc[i].uuid);
                            populateEncITSSAF(enc[i].uuid);
                            populateEncDiagnosis(patientUuid, enc[i].visit.uuid);
                            populateEncInvestigations(enc[i]);
                            populateEncRef(patientUuid, enc[i].visit.uuid);
                            populateEncSG(enc[i].visit.uuid);
                            populateEncMDC(patientUuid, enc[i].visit.uuid);
                            populateEncCR(enc[i].uuid);
                            populateEncPC(enc[i].uuid);
                            populateEncAR(enc[i].uuid);
                            populateEncMPS(enc[i].uuid);
                            populateEncGroupOther(enc[i].uuid);
                            populateEncGA(enc[i].uuid);
                            populateEncAF(enc[i].uuid);
                            populateEncCA(enc[i].uuid);
                            populateEncPU(enc[i].uuid);
                            populateEncFR(enc[i].uuid);
                            populateEncDT(enc[i].uuid);
                            populateEncDC(enc[i].uuid);
                            populateEncMDCOther(enc[i].uuid);
                            resolve(masterCardModel.encounterTemp);
                            masterCardModel.encounterTemp = {}; */
                        }
                    });
                    promise.then(value => {
                        console.log(value);
                        masterCardModel.encountersInfo.push(value);
                    });
                }
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
