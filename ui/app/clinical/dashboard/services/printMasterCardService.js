'use strict';

angular.module('bahmni.clinical')
    .service('printMasterCardService', ['$rootScope', '$stateParams', '$translate', 'patientService', 'observationsService', 'treatmentService', 'treatmentConfig', 'localeService', 'patientVisitHistoryService', 'allergiesService', 'diagnosisService', 'labOrderResultService', '$http', '$q',
        function ($rootScope, $stateParams, $translate, patientService, observationsService, treatmentService, treatmentConfig, localeService, patientVisitHistoryService, allergiesService, diagnosisService, labOrderResultService, $http, $q) {
            var masterCardModel = {

                hospitalLogo: '',
                transference: {
                    date: '',
                    healthFacilityName: '',
                    healthFacilityDistrict: '',
                    healthFacilityProvince: ''
                },
                transferOut: {
                    date: '',
                    healthFacilityName: '',
                    healthFacilityDistrict: '',
                    healthFacilityProvince: ''
                },
                hivTest: {
                    date: '',
                    sector: '',
                    testType: '',
                    healthFacilityName: '',
                    healthFacilityDistrict: '',
                    healthFacilityProvince: ''
                },
                dest: '',
                patientInfo: {
                    mainContact: '',
                    alternativeContact1: '',
                    alternativeContact2: '',
                    username: '',
                    Tb_start: '',
                    INH_start: '',
                    INH_end: '',
                    firstName: '',
                    lastName: '',
                    age: '',
                    gender: '',
                    weight: '',
                    height: '',
                    patientId: '',
                    address: '',
                    birth_date: '',
                    town: '',
                    district: '',
                    block: '',
                    streetHouse: '',
                    province: '',
                    education: '',
                    occupation: '',
                    closeOf: '',
                    registrationDate: '',
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
                    dateofHIVDiagnosis: '',
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
                    vulnerablePopulation: '',
                    psychosocialFactors: '',
                    psychosocialFactorsActualEmpty: [],
                    psychosocialFactorsNextEmpty: [],
                    psychosocialFactorsOther: '',
                    apssPreTARVCounselling: [],
                    apssPreTARVCounsellingComments: '',
                    apssDifferentiatedModelsDate: '',
                    apssPatientCaregiverAgreement: '',
                    apssConfidantAgreement: '',
                    deathDate: '',
                    causeOfDeath: ''
                },
                healthFacilityInfo: {
                    name: '',
                    district: '',
                    province: '',
                    regType: ''
                },
                confident: {
                    name: '',
                    surname: '',
                    relationship: '',
                    telephone1: '',
                    telephone2: '',
                    province: '',
                    district: '',
                    locality: '',
                    street: '',
                    closeOf: ''
                },
                familySituation: [],
                allergyHistory: [],
                medicalConditions: {
                    criptococose: '',
                    hepatitis: '',
                    diabetes: '',
                    kaposi: '',
                    hta: '',
                    tb: '',
                    other: {
                        name: '',
                        date: ''
                    }
                },
                termsOfConsent: {
                    caregiverAgreement: {
                        agrees: '',
                        type: '',
                        date: ''
                    },
                    confidantAgreement: {
                        agrees: '',
                        type: '',
                        date: ''
                    }
                }
            };

            var patientUuid = '';
            var dispensedDrug = [];

            var dispenseddrug = function () {
                $http.get(Bahmni.Common.Constants.dispenseDrugOrderUrl, {
                    params: {
                        locId: 17,
                        patientUuid: patientUuid
                    },
                    withCredentials: true
                }).then(function (results) {
                    var dispensedARVDrugs = results.data;
                    for (let i = 0; i < results.data.length; i++) {
                        var arvDdispensed = dispensedARVDrugs[i].arv_dispensed;
                        if (arvDdispensed === true) {
                            if (dispensedDrug.length === 0) {
                                dispensedDrug.push(results.data[i]);
                            } else {
                                for (let j = 0; j < dispensedDrug.length; j++) {
                                    if (results.data[i].dispensed_date !== dispensedDrug[j].dispensed_date) {
                                        if (j === (dispensedDrug.length - 1)) {
                                            dispensedDrug.push(results.data[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $rootScope.dispensedDrug = dispensedDrug;
                });
            };

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
                    var p20 = populatePsychosocialFactors();
                    var p21 = populateConfidentDetails();
                    var p22 = populateFamilySituation();
                    var p23 = populateAllergyToMedications();
                    var p24 = populateMedicalConditions();
                    var p25 = dispenseddrug();

                    Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25]).then(function () {
                        resolve(masterCardModel);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populatePriorityPopulation = function () {
                var pP = 'Group_Priority_Population_obs_form';
                masterCardModel.patientInfo.keyPopulation = '';
                masterCardModel.patientInfo.vulnerablePopulation = '';

                observationsService.fetch(patientUuid, [pP]).then(function (response) {
                    if (response.data && response.data.length > 0) {
                        var pPValues = response.data[0].value.split(',');

                        pPValues.forEach(function (value) {
                            value = value.trim();
                            if (value === 'PP_Key_population_HSH') {
                                masterCardModel.patientInfo.keyPopulation = value;
                            } else if (value === 'PP_Key_population_PID') {
                                masterCardModel.patientInfo.keyPopulation = value;
                            } else if (value === 'PP_Key_population_REC') {
                                masterCardModel.patientInfo.keyPopulation = value;
                            } else if (value === 'PP_Key_population_MTS') {
                                masterCardModel.patientInfo.keyPopulation = value;
                            } else if (value === 'PP_Key_population_Other') {
                                masterCardModel.patientInfo.keyPopulation = value;
                            }
                        });

                        response.data[0].groupMembers.forEach(function (member) {
                            if (member.value && member.value.name !== 'PP_Vulnerable_Population_Yes' && member.value.name.includes('PP_Vulnerable_Population_Yes')) {
                                masterCardModel.patientInfo.vulnerablePopulation = member.valueAsString;
                            }
                        });
                    }
                });
            };

            var populatePsychosocialFactors = function () {
                var apssdiagnosisDisclosure = 'Apss_Disclosure_Diagnosis_results_child_adolescent';
                var apssPreTARVCounselling = 'Apss_Pre_TARV_counselling';
                var apssPreTARVCounsellingComments = 'Apss_Pre_TARV_counselling_comments';
                var apssSectionIDetails = 'Apss_Psychosocial_factors_Details_apss_section_I';
                var psychosocialFactors = 'Apss_Psychosocial_factors_Reasons';
                var apssSectionIIform = 'Apss_Section_II_form';
                var apssPPSexualBehavior = 'Apss_Positive_prevention_Sexual_behavior';
                var apssPPHIVDisclosure = 'Apss_Positive_prevention_Disclosure_HIV_status_partner_encouragement_test';
                var apssPPImportanceAdherence = 'Apss_Positive_prevention_importance_adherence';
                var apssPPSexuallyTransmittedInfections = 'Apss_Positive_prevention_Sexually_Transmitted_Infections';
                var apssPPFamilyPlanning = 'Apss_Positive_prevention_Family_Planning';
                var apssPPAlcoholOtherDrugsConsumption = 'Apss_Positive_prevention_Alcohol_other_Drugs_consumption';
                var apssPPNeedCommunitySupport = 'Apss_Positive_prevention_Need_community_support';
                var apssPPAdherenceFollowUpHasInformedSomeone = 'Apss_Adherence_follow_up_Has_informed_someone';
                var apssPPAdherenceFollowUpHasInformedSomeoneRelationship = 'Apss_Adherence_follow_up_Has_informed_someone_RELATIONSHIP';
                var apssAdherenceFollowUpWhoAdministersFullName = 'Apss_Adherence_follow_up_Who_administers_Full_Name';
                var apssAdherenceFollowUpWhoAdministersRelationship = 'CONFIDENT_RELATIONSHIP';
                var apssAdherenceFollowUpPlan = 'Apss_Adherence_follow_up_Adherence_Plan';
                var apssAdherenceFollowUpSideEffects = 'Apss_Adherence_follow_up_Side_Effects';
                var apssAdherenceFollowUpTARV = 'Apss_Adherence_follow_up_Adherence_TARV';
                var referenceSectionSupportGroupCR = 'Reference_CR';
                var referenceSectionSupportGroupPC = 'Reference_PC';
                var referenceSectionSupportGroupAR = 'Reference_AR';
                var referenceSectionSupportGroupMPS = 'Reference_MPS';
                var referenceSectionSupportGroup = 'Reference_Other_Specify_Group';
                var referenceSectionSupportGroupOther = 'Reference_Other_Specify_Group_Other';
                var referenceMDCSectionGA = 'Reference_GA';
                var referenceMDCSectionAF = 'Reference_AF';
                var referenceMDCSectionCA = 'Reference_CA';
                var referenceMDCSectionPU = 'Reference_PU';
                var referenceMDCSectionFR = 'Reference_FR';
                var referenceMDCSectionDT = 'Reference_DT';
                var referenceMDCSectionDC = 'Reference_DC';
                var referenceMDCSectionOther = 'Reference_MDC_Other';
                var referenceMDCSectionOtherComments = 'Reference_MDC_Other_comments';
                var apssDifferentiatedModelsDate = 'Apss_Differentiated_Models_Date';
                var apssPatientCaregiverAgreement = 'Apss_Agreement_Terms_Patient_Caregiver_agrees_contacted';
                var apssConfidantAgreement = 'Apss_Agreement_Terms_Confidant_agrees_contacted';
                var apssAgreementContactType = 'Apss_Agreement_Terms_Type_Contact';
                var apssConfidantAgreementContactType = 'Apss_Agreement_Terms_Confidant_agrees_contacted_Type_of_TC_Contact';
                var apssPositivePreventionKeyPopulation = 'Apss_Positive_prevention_Key_Population';
                var apssAdherenceFollowUp = 'Apss_Adherence_follow_up';
                var apssReasonForTheVisit = 'Apss_Reason_For_The_Visit';

                masterCardModel.patientInfo.address = '';
                masterCardModel.patientInfo.labOrderResult = '';
                masterCardModel.patientInfo.pastName = '';
                masterCardModel.patientInfo.keyPopulation = '';
                masterCardModel.patientInfo.psychosocialFactors = '';
                masterCardModel.patientInfo.psychosocialFactorsActualEmpty = [];
                masterCardModel.patientInfo.psychosocialFactorsNextEmpty = [];
                masterCardModel.patientInfo.psychosocialFactorsOther = '';
                masterCardModel.patientInfo.apssPreTARVCounselling = [];
                masterCardModel.patientInfo.apssDifferentiatedModelsDate = '';
                masterCardModel.patientInfo.apssPatientCaregiverAgreement = '';
                masterCardModel.patientInfo.apssConfidantAgreement = '';
                masterCardModel.patientInfo.apssAgreementContactType = '';
                masterCardModel.patientInfo.apssConfidantAgreementContactType = '';
                masterCardModel.patientInfo.apssPreTARVCounsellingComments = '';

                observationsService.fetch(patientUuid, [apssdiagnosisDisclosure, apssPreTARVCounselling, apssPreTARVCounsellingComments,
                    apssSectionIDetails, psychosocialFactors, apssSectionIIform, apssPPSexualBehavior, apssPPHIVDisclosure,
                    apssPPImportanceAdherence, apssPPSexuallyTransmittedInfections, apssPPFamilyPlanning, apssPPAlcoholOtherDrugsConsumption,
                    apssPPNeedCommunitySupport, apssPPAdherenceFollowUpHasInformedSomeone, apssPPAdherenceFollowUpHasInformedSomeoneRelationship,
                    apssAdherenceFollowUpWhoAdministersFullName, apssAdherenceFollowUpWhoAdministersRelationship, apssAdherenceFollowUpPlan,
                    apssAdherenceFollowUpSideEffects, apssAdherenceFollowUpTARV, referenceSectionSupportGroupCR, referenceSectionSupportGroupPC,
                    referenceSectionSupportGroupAR, referenceSectionSupportGroupMPS, referenceSectionSupportGroup, referenceSectionSupportGroupOther,
                    referenceMDCSectionGA, referenceMDCSectionAF, referenceMDCSectionCA, referenceMDCSectionPU, referenceMDCSectionFR,
                    referenceMDCSectionDT, referenceMDCSectionDC, referenceMDCSectionOther, referenceMDCSectionOtherComments, apssDifferentiatedModelsDate,
                    apssPatientCaregiverAgreement, apssConfidantAgreement, apssAgreementContactType, apssConfidantAgreementContactType,
                    apssPositivePreventionKeyPopulation, apssAdherenceFollowUp, apssReasonForTheVisit]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            var obsTable = [];
                            for (var i = 0; i < response.data.length; i++) {
                                var tableStructure = {
                                    actualVisit: '',
                                    nextVisit: '',
                                    values: [],
                                    apssSectionIDetails: '',
                                    apssPreTARVCounsellingComments: '',
                                    apssAdherenceFollowUpRelationship: '',
                                    apssAdherenceFollowUpWhoAdministersFullName: '',
                                    apssAdherenceFollowUpWhoAdministersRelationship: '',
                                    apssDifferentiatedModelsDate: '',
                                    apssPatientCaregiverAgreement: '',
                                    apssConfidantAgreement: '',
                                    referenceSectionSupportGroupCR: '',
                                    referenceSectionSupportGroupPC: '',
                                    referenceSectionSupportGroupAR: '',
                                    referenceSectionSupportGroupMPS: '',
                                    referenceSectionSupportGroup: '',
                                    referenceSectionSupportGroupOther: '',
                                    referenceMDCSectionGA: '',
                                    referenceMDCSectionAF: '',
                                    referenceMDCSectionCA: '',
                                    referenceMDCSectionPU: '',
                                    referenceMDCSectionFR: '',
                                    referenceMDCSectionDT: '',
                                    referenceMDCSectionDC: '',
                                    referenceMDCSectionOther: '',
                                    referenceMDCSectionOtherComments: ''
                                };
                                if (obsTable.length === 0) {
                                    tableStructure.actualVisit = response.data[i].observationDateTime.split('T')[0];
                                    if (response.data[i].concept.name === apssPreTARVCounsellingComments) {
                                        tableStructure.apssPreTARVCounsellingComments = response.data[i].value;
                                    } else if (response.data[i].concept.name === apssSectionIDetails) {
                                        tableStructure.apssSectionIDetails = response.data[i].value;
                                    } else if (response.data[i].concept.name === apssPPAdherenceFollowUpHasInformedSomeoneRelationship) {
                                        tableStructure.apssAdherenceFollowUpRelationship = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === apssAdherenceFollowUpWhoAdministersFullName) {
                                        tableStructure.apssAdherenceFollowUpWhoAdministersFullName = response.data[i].value;
                                    } else if (response.data[i].concept.name === apssAdherenceFollowUpWhoAdministersRelationship) {
                                        tableStructure.apssAdherenceFollowUpWhoAdministersRelationship = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === apssDifferentiatedModelsDate) {
                                        tableStructure.apssDifferentiatedModelsDate = response.data[i].value;
                                    } else if (response.data[i].concept.name === referenceSectionSupportGroupCR) {
                                        tableStructure.referenceSectionSupportGroupCR = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceSectionSupportGroupPC) {
                                        tableStructure.referenceSectionSupportGroupPC = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceSectionSupportGroupAR) {
                                        tableStructure.referenceSectionSupportGroupAR = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceSectionSupportGroupMPS) {
                                        tableStructure.referenceSectionSupportGroupMPS = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceSectionSupportGroupOther) {
                                        tableStructure.referenceSectionSupportGroupOther = response.data[i].value;
                                    } else if (response.data[i].concept.name === referenceSectionSupportGroup) {
                                        tableStructure.referenceSectionSupportGroup = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceMDCSectionGA) {
                                        tableStructure.referenceMDCSectionGA = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceMDCSectionAF) {
                                        tableStructure.referenceMDCSectionAF = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceMDCSectionCA) {
                                        tableStructure.referenceMDCSectionCA = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceMDCSectionPU) {
                                        tableStructure.referenceMDCSectionPU = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceMDCSectionFR) {
                                        tableStructure.referenceMDCSectionFR = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceMDCSectionDT) {
                                        tableStructure.referenceMDCSectionDT = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceMDCSectionDC) {
                                        tableStructure.referenceMDCSectionDC = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceMDCSectionOther) {
                                        tableStructure.referenceMDCSectionOther = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceMDCSectionOtherComments) {
                                        tableStructure.referenceMDCSectionOtherComments = response.data[i].value;
                                    } else if (response.data[i].concept.name === apssPatientCaregiverAgreement) {
                                        masterCardModel.termsOfConsent.caregiverAgreement.agrees = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === apssAgreementContactType) {
                                        masterCardModel.termsOfConsent.caregiverAgreement.type = response.data[i].value.name;
                                        masterCardModel.termsOfConsent.caregiverAgreement.date = response.data[i].visitStartDateTime.split('T')[0];
                                    } else if (response.data[i].concept.name === apssConfidantAgreement) {
                                        masterCardModel.termsOfConsent.confidantAgreement.agrees = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === apssConfidantAgreementContactType) {
                                        masterCardModel.termsOfConsent.confidantAgreement.type = response.data[i].value.name;
                                        masterCardModel.termsOfConsent.confidantAgreement.date = response.data[i].visitStartDateTime.split('T')[0];
                                    } else if (response.data[i].value.name) {
                                        tableStructure.values.push(response.data[i].value.name);
                                    }
                                    obsTable.push(tableStructure);
                                } else {
                                    for (var j = 0; j < obsTable.length; j++) {
                                        if (obsTable[j].actualVisit === response.data[i].observationDateTime.split('T')[0]) {
                                            if (response.data[i].concept.name === apssPreTARVCounsellingComments) {
                                                obsTable[j].apssPreTARVCounsellingComments = response.data[i].value;
                                            } else if (response.data[i].concept.name === apssSectionIDetails) {
                                                obsTable[j].apssSectionIDetails = response.data[i].value;
                                            } else if (response.data[i].concept.name === apssPPAdherenceFollowUpHasInformedSomeoneRelationship) {
                                                obsTable[j].apssAdherenceFollowUpRelationship = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === apssAdherenceFollowUpWhoAdministersFullName) {
                                                obsTable[j].apssAdherenceFollowUpWhoAdministersFullName = response.data[i].value;
                                            } else if (response.data[i].concept.name === apssAdherenceFollowUpWhoAdministersRelationship) {
                                                obsTable[j].apssAdherenceFollowUpWhoAdministersRelationship = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === apssDifferentiatedModelsDate) {
                                                obsTable[j].apssDifferentiatedModelsDate = response.data[i].value;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroupCR) {
                                                obsTable[j].referenceSectionSupportGroupCR = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroupPC) {
                                                obsTable[j].referenceSectionSupportGroupPC = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroupAR) {
                                                obsTable[j].referenceSectionSupportGroupAR = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroupMPS) {
                                                obsTable[j].referenceSectionSupportGroupMPS = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroupOther) {
                                                obsTable[j].referenceSectionSupportGroupOther = response.data[i].value;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroup) {
                                                obsTable[j].referenceSectionSupportGroup = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionGA) {
                                                obsTable[j].referenceMDCSectionGA = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionAF) {
                                                obsTable[j].referenceMDCSectionAF = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionCA) {
                                                obsTable[j].referenceMDCSectionCA = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionPU) {
                                                obsTable[j].referenceMDCSectionPU = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionFR) {
                                                obsTable[j].referenceMDCSectionFR = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionDT) {
                                                obsTable[j].referenceMDCSectionDT = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionDC) {
                                                obsTable[j].referenceMDCSectionDC = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionOther) {
                                                obsTable[j].referenceMDCSectionOther = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionOtherComments) {
                                                obsTable[j].referenceMDCSectionOtherComments = response.data[i].value;
                                            } else if (response.data[i].concept.name === apssPatientCaregiverAgreement) {
                                                masterCardModel.termsOfConsent.caregiverAgreement.agrees = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === apssAgreementContactType) {
                                                masterCardModel.termsOfConsent.caregiverAgreement.type = response.data[i].value.name;
                                                masterCardModel.termsOfConsent.caregiverAgreement.date = response.data[i].visitStartDateTime.split('T')[0];
                                            } else if (response.data[i].concept.name === apssConfidantAgreement) {
                                                masterCardModel.termsOfConsent.confidantAgreement.agrees = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === apssConfidantAgreementContactType) {
                                                masterCardModel.termsOfConsent.confidantAgreement.type = response.data[i].value.name;
                                                masterCardModel.termsOfConsent.confidantAgreement.date = response.data[i].visitStartDateTime.split('T')[0];
                                            } else if (response.data[i].value.name) {
                                                obsTable[j].values.push(response.data[i].value.name);
                                            }
                                        } else if (j === obsTable.length - 1) {
                                            tableStructure.actualVisit = response.data[i].observationDateTime.split('T')[0];
                                            if (response.data[i].concept.name === apssPreTARVCounsellingComments) {
                                                tableStructure.apssPreTARVCounsellingComments = response.data[i].value;
                                            } else if (response.data[i].concept.name === apssSectionIDetails) {
                                                tableStructure.apssSectionIDetails = response.data[i].value;
                                            } else if (response.data[i].concept.name === apssPPAdherenceFollowUpHasInformedSomeoneRelationship) {
                                                tableStructure.apssAdherenceFollowUpRelationship = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === apssAdherenceFollowUpWhoAdministersFullName) {
                                                tableStructure.apssAdherenceFollowUpWhoAdministersFullName = response.data[i].value;
                                            } else if (response.data[i].concept.name === apssAdherenceFollowUpWhoAdministersRelationship) {
                                                tableStructure.apssAdherenceFollowUpWhoAdministersRelationship = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === apssDifferentiatedModelsDate) {
                                                tableStructure.apssDifferentiatedModelsDate = response.data[i].value;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroupCR) {
                                                tableStructure.referenceSectionSupportGroupCR = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroupPC) {
                                                tableStructure.referenceSectionSupportGroupPC = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroupAR) {
                                                tableStructure.referenceSectionSupportGroupAR = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroupMPS) {
                                                tableStructure.referenceSectionSupportGroupMPS = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroupOther) {
                                                tableStructure.referenceSectionSupportGroupOther = response.data[i].value;
                                            } else if (response.data[i].concept.name === referenceSectionSupportGroup) {
                                                tableStructure.referenceSectionSupportGroup = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionGA) {
                                                tableStructure.referenceMDCSectionGA = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionAF) {
                                                tableStructure.referenceMDCSectionAF = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionCA) {
                                                tableStructure.referenceMDCSectionCA = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionPU) {
                                                tableStructure.referenceMDCSectionPU = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionFR) {
                                                tableStructure.referenceMDCSectionFR = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionDT) {
                                                tableStructure.referenceMDCSectionDT = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionDC) {
                                                tableStructure.referenceMDCSectionDC = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionOther) {
                                                tableStructure.referenceMDCSectionOther = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === referenceMDCSectionOtherComments) {
                                                tableStructure.referenceMDCSectionOtherComments = response.data[i].value;
                                            } else if (response.data[i].concept.name === apssPatientCaregiverAgreement) {
                                                masterCardModel.termsOfConsent.caregiverAgreement.agrees = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === apssAgreementContactType) {
                                                masterCardModel.termsOfConsent.caregiverAgreement.type = response.data[i].value.name;
                                                masterCardModel.termsOfConsent.caregiverAgreement.date = response.data[i].visitStartDateTime.split('T')[0];
                                            } else if (response.data[i].concept.name === apssConfidantAgreement) {
                                                masterCardModel.termsOfConsent.confidantAgreement.agrees = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === apssConfidantAgreementContactType) {
                                                masterCardModel.termsOfConsent.confidantAgreement.type = response.data[i].value.name;
                                                masterCardModel.termsOfConsent.confidantAgreement.date = response.data[i].visitStartDateTime.split('T')[0];
                                            } else if (response.data[i].value.name) {
                                                tableStructure.values.push(response.data[i].value.name);
                                            }
                                            obsTable.push(tableStructure);
                                        }
                                    }
                                }
                            }
                            var slicedTable = obsTable.slice(0, 12);

                            masterCardModel.patientInfo.psychosocialFactors = slicedTable.reverse();

                            for (var h = 0; h < masterCardModel.patientInfo.psychosocialFactors.length; h++) {
                                var apssPTCYes = 'Apss_Pre_TARV_counselling_Yes';
                                var apssPTCNo = 'Apss_Pre_TARV_counselling_NO';
                                var apssATPCACYes = "Apss_Agreement_Terms_Patient_Caregiver_agrees_contacted_Yes";
                                var apssATPCACNo = "Apss_Agreement_Terms_Patient_Caregiver_agrees_contacted_No";
                                var apssATCACYes = "Apss_Agreement_Terms_Confidant_agrees_contacted_Yes";
                                var apssATCACNo = "Apss_Agreement_Terms_Confidant_agrees_contacted_No";
                                var apssATTCPhone = "Apss_Agreement_Terms_Type_Contact_Phone_call";
                                var apssATTCSMS = "Apss_Agreement_Terms_Type_Contact_SMS";
                                var apssATTCVisit = "Apss_Agreement_Terms_Type_Contact_House_Visits";
                                var apssATCACTPhone = "Apss_Agreement_Terms_Confidant_agrees_contacted_TC_Phone_call";
                                var apssATCACTSMS = "Apss_Agreement_Terms_Confidant_agrees_contacted_TC_SMS";
                                var apssATCACTVisit = "Apss_Agreement_Terms_Confidant_agrees_contacted_TC_Visits";

                                if (masterCardModel.patientInfo.apssPreTARVCounselling.length < 4) {
                                    if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssPTCYes)) {
                                        masterCardModel.patientInfo.apssPreTARVCounselling.push(apssPTCYes);
                                    } else if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssPTCNo)) {
                                        masterCardModel.patientInfo.apssPreTARVCounselling.push(apssPTCNo);
                                    }
                                }
                                if (masterCardModel.patientInfo.apssPatientCaregiverAgreement.length < 1) {
                                    if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssATPCACYes)) {
                                        masterCardModel.patientInfo.apssPatientCaregiverAgreement = apssATPCACYes;
                                    } else if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssATPCACNo)) {
                                        masterCardModel.patientInfo.apssPatientCaregiverAgreement = apssATPCACNo;
                                    }
                                }
                                if (masterCardModel.patientInfo.apssConfidantAgreement.length < 1) {
                                    if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssATCACYes)) {
                                        masterCardModel.patientInfo.apssConfidantAgreement = apssATCACYes;
                                    } else if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssATCACNo)) {
                                        masterCardModel.patientInfo.apssConfidantAgreement = apssATCACNo;
                                    }
                                }
                                if (!masterCardModel.patientInfo.apssAgreementContactType) {
                                    if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssATTCPhone)) {
                                        masterCardModel.patientInfo.apssAgreementContactType = apssATTCPhone;
                                    } else if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssATTCSMS)) {
                                        masterCardModel.patientInfo.apssAgreementContactType = apssATTCSMS;
                                    } else if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssATTCVisit)) {
                                        masterCardModel.patientInfo.apssAgreementContactType = apssATTCVisit;
                                    }
                                }
                                if (!masterCardModel.patientInfo.apssConfidantAgreementContactType) {
                                    if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssATCACTPhone)) {
                                        masterCardModel.patientInfo.apssConfidantAgreementContactType = apssATCACTPhone;
                                    } else if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssATCACTSMS)) {
                                        masterCardModel.patientInfo.apssConfidantAgreementContactType = apssATCACTSMS;
                                    } else if (masterCardModel.patientInfo.psychosocialFactors[h].values.includes(apssATCACTVisit)) {
                                        masterCardModel.patientInfo.apssConfidantAgreementContactType = apssATCACTVisit;
                                    }
                                }
                            }

                            for (var k = 0; k < masterCardModel.patientInfo.psychosocialFactors.length; k++) {
                                if (masterCardModel.patientInfo.psychosocialFactors[k].apssPreTARVCounsellingComments) {
                                    masterCardModel.patientInfo.apssPreTARVCounsellingComments = masterCardModel.patientInfo.psychosocialFactors[k].apssPreTARVCounsellingComments;
                                }
                            }

                            for (var l = 0; l < masterCardModel.patientInfo.psychosocialFactors.length; l++) {
                                if (masterCardModel.patientInfo.psychosocialFactors[l + 1] && (masterCardModel.patientInfo.psychosocialFactors.length - 1) !== l) {
                                    masterCardModel.patientInfo.psychosocialFactors[l].nextVisit = masterCardModel.patientInfo.psychosocialFactors[l + 1].actualVisit;
                                } else if ((masterCardModel.patientInfo.psychosocialFactors.length - 1) === l) {
                                    masterCardModel.patientInfo.psychosocialFactors[l].nextVisit = '__/__/__';
                                }
                            }
                            if (masterCardModel.patientInfo.psychosocialFactors.length < 12) {
                                masterCardModel.patientInfo.psychosocialFactorsActualEmpty = [];
                                for (var m = 0; m < 12 - masterCardModel.patientInfo.psychosocialFactors.length; m++) {
                                    masterCardModel.patientInfo.psychosocialFactorsActualEmpty.push(m);
                                }
                            }
                            if (masterCardModel.patientInfo.psychosocialFactorsActualEmpty.length === 0) {
                                masterCardModel.patientInfo.psychosocialFactorsNextEmpty = [1];
                            } else {
                                masterCardModel.patientInfo.psychosocialFactorsNextEmpty = [];
                                for (var n = 0; n < masterCardModel.patientInfo.psychosocialFactorsActualEmpty.length; n++) {
                                    masterCardModel.patientInfo.psychosocialFactorsNextEmpty.push(n);
                                }
                            }
                            for (var q = 0; q < masterCardModel.patientInfo.psychosocialFactors.length; q++) {
                                if (masterCardModel.patientInfo.psychosocialFactors[q].apssDifferentiatedModelsDate && !masterCardModel.patientInfo.apssDifferentiatedModelsDate) {
                                    masterCardModel.patientInfo.apssDifferentiatedModelsDate = masterCardModel.patientInfo.psychosocialFactors[q].apssDifferentiatedModelsDate;
                                }
                            }
                        } else {
                            for (var o = 0; o < 12; o++) {
                                masterCardModel.patientInfo.psychosocialFactorsActualEmpty.push(o);
                                masterCardModel.patientInfo.psychosocialFactorsNextEmpty.push(o);
                            }
                        }
                    });
            };

            var populatePatientDemographics = function () {
                masterCardModel.patientInfo.mainContact = '';
                masterCardModel.patientInfo.firstName = '';
                masterCardModel.patientInfo.lastName = '';
                masterCardModel.patientInfo.gender = '';
                masterCardModel.patientInfo.age = '';
                masterCardModel.patientInfo.patientId = '';
                masterCardModel.patientInfo.birth_date = '';
                masterCardModel.patientInfo.stageConditionName = '';
                masterCardModel.patientInfo.username = '';
                masterCardModel.patientInfo.hivDate = '';
                masterCardModel.patientInfo.condName = '';
                masterCardModel.patientInfo.diagnosisPastName = '';
                masterCardModel.patientInfo.diagnosisName = '';
                masterCardModel.patientInfo.regDate = '';
                masterCardModel.patientInfo.treatmentStartDate = '';
                masterCardModel.patientInfo.patientStatus = '';
                masterCardModel.patientInfo.isTARV = '';
                masterCardModel.patientInfo.town = '';
                masterCardModel.patientInfo.district = '';
                masterCardModel.patientInfo.block = '';
                masterCardModel.patientInfo.streetHouse = '';
                masterCardModel.patientInfo.closeOf = '';
                masterCardModel.patientInfo.province = '';
                masterCardModel.patientInfo.registrationDate = '';
                masterCardModel.healthFacilityInfo.regType = '';
                masterCardModel.healthFacilityInfo.name = '';
                masterCardModel.healthFacilityInfo.district = '';
                masterCardModel.healthFacilityInfo.province = '';
                masterCardModel.transference.date = '';
                masterCardModel.transference.healthFacilityName = '';
                masterCardModel.transference.healthFacilityDistrict = '';
                masterCardModel.transference.healthFacilityProvince = '';
                masterCardModel.transferOut.date = '';
                masterCardModel.transferOut.healthFacilityName = '';
                masterCardModel.transferOut.healthFacilityDistrict = '';
                masterCardModel.transferOut.healthFacilityProvince = '';
                masterCardModel.patientInfo.occupation = '';
                masterCardModel.patientInfo.education = '';
                masterCardModel.patientInfo.alternativeContact1 = '';
                masterCardModel.patientInfo.alternativeContact2 = '';
                masterCardModel.patientInfo.dateofHIVDiagnosis = '';
                masterCardModel.patientInfo.deathDate = '';
                masterCardModel.patientInfo.causeOfDeath = '';
                masterCardModel.hivTest.date = '';
                masterCardModel.hivTest.sector = '';
                masterCardModel.hivTest.testType = '';
                masterCardModel.hivTest.healthFacilityName = '';
                masterCardModel.hivTest.healthFacilityDistrict = '';
                masterCardModel.hivTest.healthFacilityProvince = '';

                return new Promise(function (resolve, reject) {
                    patientService.getPatient(patientUuid).then(function (response) {
                        var patientMapper = new Bahmni.PatientMapper($rootScope.patientConfig, $rootScope, $translate);
                        if ($rootScope.patient.PRIMARY_CONTACT_NUMBER_1) {
                            masterCardModel.patientInfo.mainContact = $rootScope.patient.PRIMARY_CONTACT_NUMBER_1.value;
                        }
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
                        } else {
                            if ($rootScope.patient.DateofHIVDiagnosis) {
                                masterCardModel.patientInfo.hivDate = $rootScope.patient.DateofHIVDiagnosis.value;
                            }
                        }
                        masterCardModel.patientInfo.condName = $rootScope.conditionName;

                        var arrDiagc = [];
                        if ($rootScope.diagName == null && $rootScope.diagPastName == null) {
                            $rootScope.diagName = null;
                        } else if ($rootScope.diagName == null && $rootScope.diagPastName !== null) {
                            for (var j = 0; j < $rootScope.diagPastName.length; j++) {
                                arrDiagc.push($rootScope.diagPastName[j]);
                                var arr = arrDiagc.join('');
                            }
                            masterCardModel.patientInfo.diagnosisPastName = arr;
                        } else if ($rootScope.diagName !== null && $rootScope.diagPastName !== null) {
                            for (var j = 0; j < $rootScope.diagName.length; j++) {
                                arrDiagc.push($rootScope.diagName[j]);
                            }
                            masterCardModel.patientInfo.diagnosisName = arrDiagc;
                            masterCardModel.patientInfo.diagnosisPastName = null;
                        }
                        if ($rootScope.patient.US_REG_DATE) {
                            masterCardModel.patientInfo.regDate = $rootScope.patient.US_REG_DATE.value;
                        }
                        masterCardModel.patientInfo.treatmentStartDate = $rootScope.arvdispenseddate;

                        var statusArray = [{ name: "Pre TARV" }, { name: "TARV" }];
                        var arrStatus = [];
                        for (var k = 0; k < statusArray.length; k++) {
                            if ($rootScope.patient.PATIENT_STATUS && $rootScope.patient.PATIENT_STATUS.value.display == statusArray[k].name) {
                                arrStatus.push(statusArray[k].name);
                            }
                        }
                        masterCardModel.patientInfo.patientStatus = arrStatus;
                        if ($rootScope.patient && $rootScope.patient.patientStatus) {
                            masterCardModel.patientInfo.isTARV = $rootScope.patient.patientStatus;
                        }
                        if ($rootScope.healthFacility && $rootScope.healthFacility.name) {
                            masterCardModel.healthFacilityInfo.name = $rootScope.healthFacility.name;
                        }
                        var addressMap = patient.address;
                        masterCardModel.patientInfo.town = addressMap.address1;
                        masterCardModel.patientInfo.district = addressMap.address2;
                        masterCardModel.patientInfo.block = addressMap.address3;
                        masterCardModel.patientInfo.streetHouse = addressMap.address4;
                        masterCardModel.patientInfo.closeOf = response.data.person.preferredAddress.postalCode;
                        masterCardModel.patientInfo.province = addressMap.stateProvince;
                        masterCardModel.patientInfo.registrationDate = response.data.person.auditInfo.dateCreated;
                        response.data.person.attributes.forEach(function (attribute) {
                            if (attribute.attributeType.display === 'TYPE_OF_REGISTRATION') {
                                masterCardModel.healthFacilityInfo.regType = attribute.value.display;
                            }
                            if (attribute.attributeType.display === 'HEALTH_FACILITY_NAME') {
                                masterCardModel.hivTest.healthFacilityName = attribute.value.split(' -')[0];
                            }
                            if (attribute.attributeType.display === 'HEALTH_FACILITY_DISTRICT') {
                                masterCardModel.hivTest.healthFacilityDistrict = attribute.value;
                            }
                            if (attribute.attributeType.display === 'HEALTH_FACILITY_PROVINCE') {
                                masterCardModel.hivTest.healthFacilityProvince = attribute.value;
                            }
                            if (attribute.attributeType.display === 'SECTOR_SELECT') {
                                masterCardModel.hivTest.sector = attribute.value.display;
                            }
                            if (attribute.attributeType.display === 'Typeoftest') {
                                masterCardModel.hivTest.testType = attribute.value.display;
                            }
                            if (attribute.attributeType.display === 'US_REG_DATE') {
                                masterCardModel.transference.date = attribute.value.split('T')[0];
                            }
                            if (attribute.attributeType.display === 'TRANSFERENCE_HF_NAME') {
                                masterCardModel.transference.healthFacilityName = attribute.value.split(' -')[0];
                            }
                            if (attribute.attributeType.display === 'TRANSFERENCE_HF_DISTRICT') {
                                masterCardModel.transference.healthFacilityDistrict = attribute.value;
                            }
                            if (attribute.attributeType.display === 'TRANSFERENCE_HF_PROVINCE') {
                                masterCardModel.transference.healthFacilityProvince = attribute.value;
                            }
                            if (attribute.attributeType.display === 'TRANSFER_OUT_NAME') {
                                if ($rootScope.patient.patientState === 'INACTIVE_TRANSFERRED_OUT') {
                                    masterCardModel.transferOut.healthFacilityName = attribute.value.split(' -')[0];
                                }
                            }
                            if (attribute.attributeType.display === 'TRANSFER_OUT_DISTRICT') {
                                if ($rootScope.patient.patientState === 'INACTIVE_TRANSFERRED_OUT') {
                                    masterCardModel.transferOut.healthFacilityDistrict = attribute.value;
                                }
                            }
                            if (attribute.attributeType.display === 'TRANSFER_OUT_PROVINCE') {
                                if ($rootScope.patient.patientState === 'INACTIVE_TRANSFERRED_OUT') {
                                    masterCardModel.transferOut.healthFacilityProvince = attribute.value;
                                }
                            }
                            if (attribute.attributeType.display === 'Transfer_Date') {
                                masterCardModel.transferOut.date = attribute.value.split('T')[0];
                            }
                            if (attribute.attributeType.display === 'PATIENT_OCCUPATION') {
                                masterCardModel.patientInfo.occupation = attribute.value.display;
                            }
                            if (attribute.attributeType.display === 'PATIENT_EDUCATION') {
                                masterCardModel.patientInfo.education = attribute.value.display;
                            }
                            if (attribute.attributeType.display === 'ALTERNATIVE_CONTACT_NUMBER_1') {
                                masterCardModel.patientInfo.alternativeContact1 = attribute.value;
                            }
                            if (attribute.attributeType.display === 'ALTERNATIVE_CONTACT_NUMBER_2') {
                                masterCardModel.patientInfo.alternativeContact2 = attribute.value;
                            }
                            if (attribute.attributeType.display === 'DateofHIVDiagnosis') {
                                masterCardModel.patientInfo.dateofHIVDiagnosis = attribute.value;
                            }
                            if (attribute.attributeType.display === 'DATE_OF_DEATH') {
                                masterCardModel.patientInfo.deathDate = attribute.value;
                            }
                            if (attribute.attributeType.display === 'CAUSE_OF_DEATH') {
                                masterCardModel.patientInfo.causeOfDeath = attribute.value.display;
                            }
                        });
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populatePatientWeightAndHeight = function () {
                masterCardModel.patientInfo.weight = '';

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
                masterCardModel.patientInfo.INH_start = '';
                masterCardModel.patientInfo.INH_end = '';
                masterCardModel.patientInfo.CTZ_start = '';
                masterCardModel.patientInfo.CTZ_end = '';

                return new Promise(function (resolve, reject) {
                    var patientINH = 'INH_Details';
                    var patientCTZ = 'CTZ_Details';
                    observationsService.fetch(patientUuid, [patientINH, patientCTZ]).then(function (response) {
                        var startDate = "Start Date_Prophylaxis";
                        var endDate = "End Date";

                        if ((response.data.length === 0)) {
                            observationsService.fetch(patientUuid, [startDate, endDate]).then(function (response) {
                                masterCardModel.patientInfo.INH_end = null;
                                masterCardModel.patientInfo.INH_start = null;
                            });
                        }
                        else if (response.data[0].concept.name === "CTZ_Details") {
                            observationsService.fetch(patientUuid, [startDate, endDate]).then(function (response) {
                                if (response.data[1] && response.data[1].value) {
                                    masterCardModel.patientInfo.CTZ_end = response.data[1].value;
                                }
                                if (response.data[0] && response.data[0].value) {
                                    masterCardModel.patientInfo.CTZ_start = response.data[0].value;
                                }
                            });
                        }
                        else if ((response.data[0].concept.name === "INH_Details")) {
                            observationsService.fetch(patientUuid, [startDate, endDate]).then(function (response) {
                                if (response.data[1]) {
                                    masterCardModel.patientInfo.INH_end = response.data[1].value;
                                }
                                if (response.data[0]) {
                                    masterCardModel.patientInfo.INH_start = response.data[0].value;
                                }
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
                masterCardModel.patientInfo.height = '';

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
                masterCardModel.patientInfo.Tb_start = '';
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
                masterCardModel.patientInfo.Tb_end = '';
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
                masterCardModel.patientInfo.Tb_back = '';
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
                masterCardModel.patientInfo.pregStatus = '';
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
                masterCardModel.patientInfo.breastFeedingStatus = '';
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
                masterCardModel.patientInfo.whoStaging = '';
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
                masterCardModel.patientInfo.labName = '';
                masterCardModel.patientInfo.resultHb = '';
                masterCardModel.patientInfo.resultAlt = '';
                masterCardModel.patientInfo.resultAst = '';
                masterCardModel.patientInfo.resultVl = '';
                masterCardModel.patientInfo.resultcd = '';

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
                            } else {
                                masterCardModel.patientInfo.resultHb = temp1[i];
                            }
                        }

                        if (temp[i] === "LO_ViralLoad") {
                            if (temp[i] === null) {
                                masterCardModel.patientInfo.resultVl = null;
                            } else {
                                masterCardModel.patientInfo.resultVl = temp1[i];
                            }
                        }

                        if (temp[i] === "LO_CD4") {
                            if (temp[i] === null) {
                                masterCardModel.patientInfo.resultcd = null;
                            } else {
                                masterCardModel.patientInfo.resultcd = temp1[i];
                            }
                        }

                        if (temp[i] === "LO_ALT") {
                            if (temp[i] === null) {
                                masterCardModel.patientInfo.resultAlt = null;
                            } else {
                                masterCardModel.patientInfo.resultAlt = temp1[i];
                            }
                        }

                        if (temp[i] === "LO_AST") {
                            if (temp[i] === null) {
                                masterCardModel.patientInfo.resultAst = null;
                            } else {
                                masterCardModel.patientInfo.resultAst = temp1[i];
                            }
                        }
                    }
                }
            };

            var populateARTDetails = function () {
                masterCardModel.regimeName = '';
                masterCardModel.regimeChangeName = '';
                masterCardModel.regimeStartDate = '';
                masterCardModel.regimeChangeDate = '';

                return new Promise(function (resolve, reject) {
                    treatmentService.getActiveDrugOrders(patientUuid, null, null).then(function (response) {
                        var drugarr = [];
                        for (var i = response.length - 1; i >= 0; i--) {
                            var obj = {};
                            obj[0] = response[i].effectiveStartDate;
                            obj[1] = response[i].concept.name;
                            drugarr.push(obj);
                        }

                        for (var k = drugarr.length; k > 0; k--) {
                            for (var j = 1; j < k; j++) {
                                if (j % 2 !== 0) {
                                    masterCardModel.regimeName = drugarr[k - 1][j];
                                    masterCardModel.regimeChangeName = drugarr[k - 2][j];
                                }
                                masterCardModel.regimeStartDate = drugarr[k - 1][j - 1];
                                masterCardModel.regimeChangeDate = drugarr[k - 2][j - 1];
                            }
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateModels = function () {
                masterCardModel.patientInfo.mdsYes = '';
                masterCardModel.patientInfo.mdsNo = '';
                masterCardModel.patientInfo.modelTypes = '';
                masterCardModel.patientInfo.modelDate = '';

                return new Promise(function (resolve, reject) {
                    var modelsName = "Apss_Differentiated_Models";
                    observationsService.fetch(patientUuid, [modelsName]).then(function (response) {
                        var modelarray = [];
                        var temp = [];
                        var arrDate = [];

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
                masterCardModel.patientInfo.BMI = '';
                observationsService.fetch(patientUuid, [patientBMIConceptName]).then(function (response) {
                    if (response.data && response.data.length > 0) {
                        masterCardModel.patientInfo.BMI = response.data[0].value;
                    }
                });
            };

            var populateDrugOrders = function (visitUuid) {
                masterCardModel.patientInfo.notARV = '';
                masterCardModel.patientInfo.isARV = '';
                masterCardModel.patientInfo.currRegARV = '';
                masterCardModel.patientInfo.secLast = '';
                masterCardModel.patientInfo.thirdLast = '';
                masterCardModel.patientInfo.secLastDate = '';
                masterCardModel.patientInfo.thirdLastDate = '';
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
                masterCardModel.location = '';
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
                masterCardModel.hospitalLogo = '';
                return new Promise(function (resolve, reject) {
                    localeService.getLoginText().then(function (response) {
                        masterCardModel.hospitalLogo = response.data.homePage.logo;
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateConfidentDetails = function () {
                masterCardModel.confident.name = '';
                masterCardModel.confident.surname = '';
                masterCardModel.confident.relationship = '';
                masterCardModel.confident.telephone1 = '';
                masterCardModel.confident.telephone2 = '';
                masterCardModel.confident.province = '';
                masterCardModel.confident.district = '';
                masterCardModel.confident.locality = '';
                masterCardModel.confident.block = '';
                masterCardModel.confident.street = '';
                masterCardModel.confident.closeOf = '';

                return new Promise(function (resolve, reject) {
                    var confidentDetails = 'CONFIDENT_DETAILS';
                    observationsService.fetch(patientUuid, [confidentDetails]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            response.data[0].groupMembers.forEach(function (detail) {
                                if (detail.concept.name === 'CONFIDENT_NAME') {
                                    masterCardModel.confident.name = detail.value;
                                } else if (detail.concept.name === 'CONFIDENT_SURNAME') {
                                    masterCardModel.confident.surname = detail.value;
                                } else if (detail.concept.name === 'CONFIDENT_RELATIONSHIP') {
                                    masterCardModel.confident.relationship = detail.value.shortName;
                                } else if (detail.concept.name === 'CONFIDENT_TELEPHONE1') {
                                    masterCardModel.confident.telephone1 = detail.value;
                                } else if (detail.concept.name === 'CONFIDENT_TELEPHONE2') {
                                    masterCardModel.confident.telephone2 = detail.value;
                                } else if (detail.concept.name === 'CONFIDENT_PROVINCE') {
                                    masterCardModel.confident.province = detail.value;
                                } else if (detail.concept.name === 'CONFIDENT_DISTRICT') {
                                    masterCardModel.confident.district = detail.value;
                                } else if (detail.concept.name === 'CONFIDENT_LOCALITY') {
                                    masterCardModel.confident.locality = detail.value;
                                } else if (detail.concept.name === 'CONFIDENT_BLOCK') {
                                    masterCardModel.confident.block = detail.value;
                                } else if (detail.concept.name === 'CONFIDENT_STREET') {
                                    masterCardModel.confident.street = detail.value;
                                } else if (detail.concept.name === 'CONFIDENT_POR') {
                                    masterCardModel.confident.closeOf = detail.value;
                                }
                            });
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateFamilySituation = function () {
                masterCardModel.familySituation = '';
                return new Promise(function (resolve, reject) {
                    var confidentFamilySituation = 'CONFIDENT_FAMILY_SITUATION';
                    observationsService.fetch(patientUuid, [confidentFamilySituation]).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.familySituation = [];
                            response.data.forEach(function (element) {
                                var familyMemberDetails = {
                                    name: '',
                                    age: '',
                                    ageType: '',
                                    relationship: '',
                                    hivTest: '',
                                    hivCare: '',
                                    ccr: '',
                                    nid: {
                                        left: '',
                                        right: ''
                                    }
                                };

                                element.groupMembers.forEach(function (detail) {
                                    if (detail.concept.name === 'CONFIDENT_NAME') {
                                        familyMemberDetails.name = detail.value;
                                    } else if (detail.concept.name === 'CONFIDENT_AGE') {
                                        familyMemberDetails.age = detail.value;
                                    } else if (detail.concept.name === 'CONFIDENT_NID') {
                                        var nid = detail.value.split('/');
                                        familyMemberDetails.nid.left = nid[0] + '/' + nid[1];
                                        familyMemberDetails.nid.right = nid[2] + '/' + nid[3];
                                    } else if (detail.concept.name === 'CONFIDENT_AGE_TYPE') {
                                        familyMemberDetails.ageType = detail.value.name;
                                    } else if (detail.concept.name === 'CONFIDENT_RELATIONSHIP') {
                                        familyMemberDetails.relationship = detail.value.shortName;
                                    } else if (detail.concept.name === 'CONFIDENT_HIV_CARE') {
                                        familyMemberDetails.hivCare = detail.value;
                                    } else if (detail.concept.name === 'CONFIDENT_HIV_TEST') {
                                        familyMemberDetails.hivTest = detail.value.name;
                                    } else if (detail.concept.name === 'CONFIDENT_CCR') {
                                        familyMemberDetails.ccr = detail.value.name;
                                    }
                                });
                                masterCardModel.familySituation.push(familyMemberDetails);
                            });
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateAllergyToMedications = function () {
                masterCardModel.allergyHistory = '';
                return new Promise(function (resolve, reject) {
                    allergiesService.getAllergyHistory(patientUuid).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.allergyHistory = [];
                            response.data.forEach(function (element) {
                                element.allergies.forEach(function (allergy) {
                                    masterCardModel.allergyHistory.push({name: allergy.concept.name, date: allergy.dateCreated});
                                });
                            });
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };

            var populateMedicalConditions = function () {
                masterCardModel.medicalConditions = {};
                masterCardModel.medicalConditions.hepatitis = '';
                masterCardModel.medicalConditions.diabetes = '';
                masterCardModel.medicalConditions.tb = '';
                masterCardModel.medicalConditions.hta = '';
                masterCardModel.medicalConditions.kaposi = '';
                masterCardModel.medicalConditions.criptococose = '';
                return new Promise(function (resolve, reject) {
                    diagnosisService.getDiagnoses(patientUuid).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.medicalConditions = [];
                            response.data.forEach(function (condition) {
                                if (condition.codedAnswer.name.toUpperCase().includes('HEPATITE')) {
                                    masterCardModel.medicalConditions.hepatitis = condition.diagnosisDateTime;
                                } else if (condition.codedAnswer.name.toUpperCase().includes('DIABETES')) {
                                    masterCardModel.medicalConditions.diabetes = condition.diagnosisDateTime;
                                } else if (condition.codedAnswer.name.toUpperCase().includes('TUBERCULOSE')) {
                                    masterCardModel.medicalConditions.tb = condition.diagnosisDateTime;
                                } else if (condition.codedAnswer.name.toUpperCase().includes('?????')) {
                                    masterCardModel.medicalConditions.hta = condition.diagnosisDateTime;
                                } else if (condition.codedAnswer.name.toUpperCase().includes('KAPOSI')) {
                                    masterCardModel.medicalConditions.kaposi = condition.diagnosisDateTime;
                                } else if (condition.codedAnswer.name.toUpperCase().includes('CRIPTOCOCOSE')) {
                                    masterCardModel.medicalConditions.criptococose = condition.diagnosisDateTime;
                                } else {
                                    var other = {
                                        name: '',
                                        date: ''
                                    };
                                    other.name = condition.codedAnswer.name;
                                    other.date = condition.diagnosisDateTime;
                                    masterCardModel.medicalConditions.other = other;
                                }
                            });
                        }
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };
        }]);
