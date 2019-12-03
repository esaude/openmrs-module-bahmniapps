'use strict';

angular.module('bahmni.clinical')
    .service('printMasterCardService', ['$rootScope', '$translate', 'patientService', 'observationsService', 'treatmentService', 'localeService', 'patientVisitHistoryService', 'labOrderResultService', 'allergiesService', 'diagnosisService', '$http', '$q',
        function ($rootScope, $translate, patientService, observationsService, treatmentService, localeService, patientVisitHistoryService, labOrderResultService, allergiesService, diagnosisService, $http, $q) {
            var masterCardModel = {

                hospitalLogo: '',
                transference: {
                    healthFacilityName: '',
                    healthFacilityDistrict: '',
                    healthFacilityProvince: ''
                },
                transferOut: {
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
                    sectorSelect: '',
                    typeOfTest: '',
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
                    province: ''
                },
                confident: {
                    name: '',
                    surname: '',
                    relationship: '',
                    telehone1: '',
                    telehone2: '',
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
                    var p26 = populateVulPopulation();

                    Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26]).then(function () {
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
                var bloodPressureSystolicVitalS = 'Blood_Pressure_–_Systolic_VitalS';
                var bloodPressureDiastolicVSNew = 'Blood_Pressure_–_Diastolic_VSNew';
                var familyPlanning = 'Group_VIII_Family_Planning_obs_form';
                var nutritionalState = 'Nutritional_States_new';
                var lastMenstruationDate = 'Last Menstruation Date';
                var pregnancyYesNo = 'Pregnancy_Yes_No';
                var breastFeeding = 'Breastfeeding_ANA';
                var familyPlanningMethods = 'Family_Planning_Methods';
                var whoStaging = 'HTC, WHO Staging';
                var infantsOdemaProphylaxis = 'Infants Odema_Prophylaxis';
                var weight = 'WEIGHT';
                var height = 'HEIGHT';
                var brachialPerimeter = 'Brachial_perimeter_new';
                var bmi = 'BMI';
                var receivedNutritionalSupport = 'Received nutritional support';
                var receivedNutritionalEducation = 'Received nutritional education';
                var nutritionSupplement = 'Nutrition Supplement';
                var nutritionalSupplementQt = 'Quantity of Nutritional Supplement';
                var nutritionalSupplementMeasurementUnit = 'SP_Measurement_Unit';
                var hasTBSymptoms = 'Has TB Symptoms';
                var prophylaxisSymptoms = 'Symptoms Prophylaxis_New';
                var dateOfDiagnosis = 'Date of Diagnosis';
                var tbTreatmentStartDate = 'SP_Treatment Start Date';
                var tbTreatmentState = 'SP_Treatment State';
                var tbTreatmentEndDate = 'SP_Treatment End Date';
                var typeOfProphylaxis = 'Type_Prophylaxis';
                var startDateProphylaxisINH = 'Start_Date_Prophylaxis_INH';
                var stateProphylaxisINH = 'State_Prophylaxis_INH';
                var endDateProphylaxisINH = 'End_Date_Prophylaxis_INH';
                var spSideEffectsINH = 'SP_Side_Effects_INH';
                var secondaryEffectsINH = 'Secondary effects_INH';
                var startDateProphylaxisCTZ = 'Start_Date_Prophylaxis_CTZ';
                var stateProphylaxisCTZ = 'State_Prophylaxis_CTZ';
                var endDateProphylaxisCTZ = 'End_Date_Prophylaxis_CTZ';
                var spSideEffectsCTZ = 'SP_Side_Effects_CTZ';
                var secondaryEffectsCTZ = 'Secondary effects_CTZ';
                var hasSTISymptoms = 'Has STI Symptoms';
                var stiDiagnosisProphylaxis = 'STI Diagnosis_Prophylaxis';
                var syndromicApproachSTIM = 'Syndromic Approach_STI_M';
                var syndromicApproachSTIF = 'Syndromic Approach_STI_F';
                var CD4 = 'CD4';
                var referenceSectionOtherServices = 'Reference_Other_Services';
                var tarvAdherence = 'Adherence_ana';
                var tarvSideEffects = 'Side_Effects_ana';
                var tarvSevereType = 'Severas_ana_type';
                var tarveNotSevereType = 'Geralmente_não Severas_ana_type';
                var tarvLifeRisk = 'Com_risco_de_Vida_type';
                var TBdateDiag = 'Date of Diagnosis';

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
                    apssPositivePreventionKeyPopulation, apssAdherenceFollowUp, apssReasonForTheVisit, bloodPressureSystolicVitalS,
                    bloodPressureDiastolicVSNew, familyPlanning, nutritionalState, lastMenstruationDate, pregnancyYesNo, breastFeeding,
                    familyPlanningMethods, whoStaging, infantsOdemaProphylaxis, weight, height, brachialPerimeter, bmi,
                    receivedNutritionalSupport, receivedNutritionalEducation, nutritionSupplement, nutritionalSupplementQt, nutritionalSupplementMeasurementUnit,
                    hasTBSymptoms, prophylaxisSymptoms, dateOfDiagnosis, tbTreatmentStartDate, tbTreatmentState, tbTreatmentEndDate, typeOfProphylaxis,
                    startDateProphylaxisINH, stateProphylaxisINH, endDateProphylaxisINH, spSideEffectsINH, secondaryEffectsINH,
                    startDateProphylaxisCTZ, stateProphylaxisCTZ, endDateProphylaxisCTZ, spSideEffectsCTZ, secondaryEffectsCTZ,
                    hasSTISymptoms, stiDiagnosisProphylaxis, syndromicApproachSTIM, syndromicApproachSTIF, CD4, referenceSectionOtherServices, tarvAdherence,
                    tarvSideEffects, tarvSevereType, tarveNotSevereType, tarvLifeRisk, TBdateDiag]).then(function (response) {
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
                                    referenceMDCSectionOtherComments: '',
                                    bloodPressureDiastolicVSNew: '',
                                    bloodPressureSystolicVitalS: '',
                                    familyPlanning: '',
                                    nutritionalState: '',
                                    lastMenstruationDate: '',
                                    pregnancyYesNo: '',
                                    breastFeeding: '',
                                    familyPlanningMethods: '',
                                    whoStaging: '',
                                    infantsOdemaProphylaxis: '',
                                    weight: '',
                                    height: '',
                                    brachialPerimeter: '',
                                    bmi: '',
                                    receivedNutritionalSupport: '',
                                    receivedNutritionalEducation: '',
                                    nutritionSupplement: '',
                                    nutritionalSupplementQt: '',
                                    nutritionalSupplementMeasurementUnit: '',
                                    hasTBSymptoms: '',
                                    prophylaxisSymptoms: '',
                                    dateOfDiagnosis: '',
                                    tbTreatmentStartDate: '',
                                    tbTreatmentState: '',
                                    tbTreatmentEndDate: '',
                                    typeOfProphylaxis: '',
                                    startDateProphylaxisINH: '',
                                    stateProphylaxisINH: '',
                                    endDateProphylaxisINH: '',
                                    spSideEffectsINH: '',
                                    secondaryEffectsINH: '',
                                    startDateProphylaxisCTZ: '',
                                    stateProphylaxisCTZ: '',
                                    endDateProphylaxisCTZ: '',
                                    spSideEffectsCTZ: '',
                                    secondaryEffectsCTZ: '',
                                    hasSTISymptoms: '',
                                    stiDiagnosisProphylaxis: '',
                                    syndromicApproachSTIM: '',
                                    syndromicApproachSTIF: '',
                                    cd4: '',
                                    viralLoad: '',
                                    hgb: '',
                                    alt: '',
                                    ast: '',
                                    referenceSectionOtherServices: [],
                                    statusState: '',
                                    tarvAdherence: '',
                                    tarvSideEffects: '',
                                    tarvSevereType: [],
                                    tarveNotSevereType: [],
                                    tarvLifeRisk: [],
                                    TBdateDiag: '',
                                    gl: '',
                                    cr: '',
                                    am: '',
                                    indicator: '',
                                    ageAtVisit: '',
                                    otherPerscribedDrugs: [],
                                    otherCondition: [],
                                    provider: ''
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
                                        tableStructure.referenceSectionSupportGroupOther = response.data[i].value.name;
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
                                        tableStructure.referenceMDCSectionDC = response.data[i].value;
                                    } else if (response.data[i].concept.name === referenceMDCSectionOther) {
                                        tableStructure.referenceMDCSectionOther = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === referenceMDCSectionOtherComments) {
                                        tableStructure.referenceMDCSectionOtherComments = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === bloodPressureSystolicVitalS) {
                                        tableStructure.bloodPressureSystolicVitalS = response.data[i].value;
                                    } else if (response.data[i].concept.name === bloodPressureDiastolicVSNew) {
                                        tableStructure.bloodPressureDiastolicVSNew = response.data[i].value;
                                    } else if (response.data[i].concept.name === familyPlanning) {
                                        tableStructure.familyPlanning = response.data[i].value;
                                    } else if (response.data[i].concept.name === nutritionalState) {
                                        tableStructure.nutritionalState = response.data[i].value;
                                    } else if (response.data[i].concept.name === lastMenstruationDate) {
                                        tableStructure.lastMenstruationDate = response.data[i].value;
                                    } else if (response.data[i].concept.name === pregnancyYesNo) {
                                        tableStructure.pregnancyYesNo = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === breastFeeding) {
                                        tableStructure.breastFeeding = response.data[i].value;
                                    } else if (response.data[i].concept.name === familyPlanningMethods) {
                                        tableStructure.familyPlanningMethods = response.data[i].valueAsString;
                                    } else if (response.data[i].concept.name === whoStaging) {
                                        tableStructure.whoStaging = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === infantsOdemaProphylaxis) {
                                        tableStructure.infantsOdemaProphylaxis = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === weight) {
                                        tableStructure.weight = response.data[i].value;
                                    } else if (response.data[i].concept.name === height) {
                                        tableStructure.height = response.data[i].value;
                                    } else if (response.data[i].concept.name === brachialPerimeter) {
                                        tableStructure.brachialPerimeter = response.data[i].value;
                                    } else if (response.data[i].concept.name === bmi) {
                                        tableStructure.bmi = response.data[i].value;
                                    } else if (response.data[i].concept.name === receivedNutritionalSupport) {
                                        tableStructure.receivedNutritionalSupport = response.data[i].value;
                                    } else if (response.data[i].concept.name === receivedNutritionalEducation) {
                                        tableStructure.receivedNutritionalEducation = response.data[i].value;
                                    } else if (response.data[i].concept.name === nutritionSupplement) {
                                        tableStructure.nutritionSupplement = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === nutritionalSupplementQt) {
                                        tableStructure.nutritionalSupplementQt = response.data[i].value;
                                    } else if (response.data[i].concept.name === nutritionalSupplementMeasurementUnit) {
                                        tableStructure.nutritionalSupplementMeasurementUnit = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === hasTBSymptoms) {
                                        tableStructure.hasTBSymptoms = response.data[i].value;
                                    } else if (response.data[i].concept.name === prophylaxisSymptoms) {
                                        tableStructure.prophylaxisSymptoms = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === dateOfDiagnosis) {
                                        tableStructure.dateOfDiagnosis = response.data[i].value;
                                    } else if (response.data[i].concept.name === tbTreatmentStartDate) {
                                        tableStructure.tbTreatmentStartDate = response.data[i].value;
                                    } else if (response.data[i].concept.name === tbTreatmentState) {
                                        tableStructure.tbTreatmentState = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === tbTreatmentEndDate) {
                                        tableStructure.tbTreatmentEndDate = response.data[i].value;
                                    } else if (response.data[i].concept.name === typeOfProphylaxis) {
                                        tableStructure.typeOfProphylaxis = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === startDateProphylaxisINH) {
                                        tableStructure.startDateProphylaxisINH = response.data[i].value;
                                    } else if (response.data[i].concept.name === stateProphylaxisINH) {
                                        tableStructure.stateProphylaxisINH = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === endDateProphylaxisINH) {
                                        tableStructure.endDateProphylaxisINH = response.data[i].value;
                                    } else if (response.data[i].concept.name === spSideEffectsINH) {
                                        tableStructure.spSideEffectsINH = response.data[i].value;
                                    } else if (response.data[i].concept.name === secondaryEffectsINH) {
                                        tableStructure.secondaryEffectsINH = response.data[i].value;
                                    } else if (response.data[i].concept.name === startDateProphylaxisCTZ) {
                                        tableStructure.startDateProphylaxisCTZ = response.data[i].value;
                                    } else if (response.data[i].concept.name === stateProphylaxisCTZ) {
                                        tableStructure.stateProphylaxisCTZ = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === endDateProphylaxisCTZ) {
                                        tableStructure.endDateProphylaxisCTZ = response.data[i].value;
                                    } else if (response.data[i].concept.name === spSideEffectsCTZ) {
                                        tableStructure.spSideEffectsCTZ = response.data[i].value;
                                    } else if (response.data[i].concept.name === secondaryEffectsCTZ) {
                                        tableStructure.secondaryEffectsCTZ = response.data[i].value;
                                    } else if (response.data[i].concept.name === hasSTISymptoms) {
                                        tableStructure.hasSTISymptoms = response.data[i].value;
                                    } else if (response.data[i].concept.name === stiDiagnosisProphylaxis) {
                                        tableStructure.stiDiagnosisProphylaxis = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === syndromicApproachSTIM) {
                                        tableStructure.syndromicApproachSTIM = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === syndromicApproachSTIF) {
                                        tableStructure.syndromicApproachSTIF = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === CD4) {
                                        tableStructure.CD4 = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === referenceSectionOtherServices && tableStructure.referenceSectionOtherServices.indexOf(response.data[i].value.shortName) === -1) {
                                        tableStructure.referenceSectionOtherServices.push(response.data[i].value.shortName);
                                    } else if (response.data[i].concept.name === tarvAdherence) {
                                        tableStructure.tarvAdherence = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === tarvSideEffects) {
                                        tableStructure.tarvSideEffects = response.data[i].value.shortName;
                                    } else if (response.data[i].concept.name === tarvSevereType && tableStructure.tarvSevereType.indexOf(response.data[i].value.shortName) === -1) {
                                        tableStructure.tarvSevereType.push(response.data[i].value.shortName);
                                        tableStructure.tarveNotSevereType = [];
                                        tableStructure.tarvLifeRisk = [];
                                    } else if (response.data[i].concept.name === tarveNotSevereType && tableStructure.tarveNotSevereType.indexOf(response.data[i].value.shortName) === -1) {
                                        tableStructure.tarveNotSevereType.push(response.data[i].value.shortName);
                                        tableStructure.tarvSevereType = [];
                                        tableStructure.tarvLifeRisk = [];
                                    } else if (response.data[i].concept.name === tarvLifeRisk && tableStructure.tarvLifeRisk.indexOf(response.data[i].value.shortName) === -1) {
                                        tableStructure.tarvLifeRisk.push(response.data[i].value.shortName);
                                        tableStructure.tarvSevereType = [];
                                        tableStructure.tarveNotSevereType = [];
                                    } else if (response.data[i].concept.name === TBdateDiag) {
                                        if (response.data[i].value) {
                                            tableStructure.TBdateDiag = true;
                                        } else if (!response.data[i].value) {
                                            tableStructure.TBdateDiag = false;
                                        }
                                    } else if (response.data[i].value.shortName) {
                                        tableStructure.values.push(response.data[i].value.shortName);
                                    }
                                    obsTable.push(tableStructure);

                                    obsTable.forEach(function (obs) {
                                        if (masterCardModel.patientInfo.age > 5) {
                                            obs.ageAtVisit = new Date(obs.actualVisit).getFullYear() - new Date(masterCardModel.patientInfo.birth_date).getFullYear();
                                            obs.indicator = 'BMI';
                                        } else {
                                            var age = new Date(obs.actualVisit).getFullYear() - new Date(masterCardModel.patientInfo.birth_date).getFullYear();
                                            obs.ageAtVisit = age * 12;
                                            obs.indicator = 'BP';
                                        }
                                    });
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
                                            } else if (response.data[i].concept.name === bloodPressureSystolicVitalS) {
                                                obsTable[j].bloodPressureSystolicVitalS = response.data[i].value;
                                            } else if (response.data[i].concept.name === bloodPressureDiastolicVSNew) {
                                                obsTable[j].bloodPressureDiastolicVSNew = response.data[i].value;
                                            } else if (response.data[i].concept.name === familyPlanning) {
                                                obsTable[j].familyPlanning = response.data[i].value;
                                            } else if (response.data[i].concept.name === nutritionalState) {
                                                obsTable[j].nutritionalState = response.data[i].valueAsString;
                                            } else if (response.data[i].concept.name === lastMenstruationDate) {
                                                obsTable[j].lastMenstruationDate = response.data[i].valueAsString;
                                            } else if (response.data[i].concept.name === pregnancyYesNo) {
                                                obsTable[j].pregnancyYesNo = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === breastFeeding) {
                                                obsTable[j].breastFeeding = response.data[i].value;
                                            } else if (response.data[i].concept.name === familyPlanningMethods) {
                                                obsTable[j].familyPlanningMethods = response.data[i].valueAsString;
                                            } else if (response.data[i].concept.name === whoStaging) {
                                                obsTable[j].whoStaging = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === infantsOdemaProphylaxis) {
                                                obsTable[j].infantsOdemaProphylaxis = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === weight) {
                                                obsTable[j].weight = response.data[i].value;
                                            } else if (response.data[i].concept.name === height) {
                                                obsTable[j].height = response.data[i].value;
                                            } else if (response.data[i].concept.name === brachialPerimeter) {
                                                obsTable[j].brachialPerimeter = response.data[i].value;
                                            } else if (response.data[i].concept.name === bmi) {
                                                obsTable[j].bmi = response.data[i].value;
                                            } else if (response.data[i].concept.name === receivedNutritionalSupport) {
                                                obsTable[j].receivedNutritionalSupport = response.data[i].value;
                                            } else if (response.data[i].concept.name === receivedNutritionalEducation) {
                                                obsTable[j].receivedNutritionalEducation = response.data[i].value;
                                            } else if (response.data[i].concept.name === nutritionSupplement) {
                                                obsTable[j].nutritionSupplement = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === nutritionalSupplementQt) {
                                                obsTable[j].nutritionalSupplementQt = response.data[i].value;
                                            } else if (response.data[i].concept.name === nutritionalSupplementMeasurementUnit) {
                                                obsTable[j].nutritionalSupplementMeasurementUnit = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === hasTBSymptoms) {
                                                obsTable[j].hasTBSymptoms = response.data[i].value;
                                            } else if (response.data[i].concept.name === prophylaxisSymptoms) {
                                                obsTable[j].prophylaxisSymptoms = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === dateOfDiagnosis) {
                                                obsTable[j].dateOfDiagnosis = response.data[i].value;
                                            } else if (response.data[i].concept.name === tbTreatmentStartDate) {
                                                obsTable[j].tbTreatmentStartDate = response.data[i].value;
                                            } else if (response.data[i].concept.name === tbTreatmentState) {
                                                obsTable[j].tbTreatmentState = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === tbTreatmentEndDate) {
                                                obsTable[j].tbTreatmentEndDate = response.data[i].value;
                                            } else if (response.data[i].concept.name === typeOfProphylaxis) {
                                                obsTable[j].typeOfProphylaxis = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === startDateProphylaxisINH) {
                                                obsTable[j].startDateProphylaxisINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === stateProphylaxisINH) {
                                                obsTable[j].stateProphylaxisINH = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === endDateProphylaxisINH) {
                                                obsTable[j].endDateProphylaxisINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === spSideEffectsINH) {
                                                obsTable[j].spSideEffectsINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === secondaryEffectsINH) {
                                                obsTable[j].secondaryEffectsINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === startDateProphylaxisCTZ) {
                                                obsTable[j].startDateProphylaxisCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === stateProphylaxisCTZ) {
                                                obsTable[j].stateProphylaxisCTZ = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === endDateProphylaxisCTZ) {
                                                obsTable[j].endDateProphylaxisCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === spSideEffectsCTZ) {
                                                obsTable[j].spSideEffectsCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === secondaryEffectsCTZ) {
                                                obsTable[j].secondaryEffectsCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === hasSTISymptoms) {
                                                obsTable[j].hasSTISymptoms = response.data[i].value;
                                            } else if (response.data[i].concept.name === stiDiagnosisProphylaxis) {
                                                obsTable[j].stiDiagnosisProphylaxis = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === syndromicApproachSTIM) {
                                                obsTable[j].syndromicApproachSTIM = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === syndromicApproachSTIF) {
                                                obsTable[j].syndromicApproachSTIF = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === CD4) {
                                                obsTable[j].CD4 = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === referenceSectionOtherServices && obsTable[j].referenceSectionOtherServices.indexOf(response.data[i].value.shortName) === -1) {
                                                obsTable[j].referenceSectionOtherServices.push(response.data[i].value.shortName);
                                            } else if (response.data[i].concept.name === tarvAdherence) {
                                                obsTable[j].tarvAdherence = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === tarvSideEffects) {
                                                obsTable[j].tarvSideEffects = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === tarvSevereType && obsTable[j].tarvSevereType.indexOf(response.data[i].value.shortName) === -1) {
                                                obsTable[j].tarvSevereType.push(response.data[i].value.shortName);
                                                obsTable[j].tarveNotSevereType = [];
                                                obsTable[j].tarvLifeRisk = [];
                                            } else if (response.data[i].concept.name === tarveNotSevereType && obsTable[j].tarveNotSevereType.indexOf(response.data[i].value.shortName) === -1) {
                                                obsTable[j].tarveNotSevereType.push(response.data[i].value.shortName);
                                                obsTable[j].tarvSevereType = [];
                                                obsTable[j].tarvLifeRisk = [];
                                            } else if (response.data[i].concept.name === tarvLifeRisk && obsTable[j].tarvLifeRisk.indexOf(response.data[i].value.shortName) === -1) {
                                                obsTable[j].tarvLifeRisk.push(response.data[i].value.shortName);
                                                obsTable[j].tarvSevereType = [];
                                                obsTable[j].tarveNotSevereType = [];
                                            } else if (response.data[i].concept.name === TBdateDiag) {
                                                if (response.data[i].value !== undefined) {
                                                    obsTable[j].TBdateDiag = true;
                                                } else if (response.data[i].value === undefined) {
                                                    obsTable[j].TBdateDiag = false;
                                                }
                                            } else if (response.data[i].value.shortName) {
                                                obsTable[j].values.push(response.data[i].value.shortName);
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
                                            } else if (response.data[i].concept.name === bloodPressureSystolicVitalS) {
                                                tableStructure.bloodPressureSystolicVitalS = response.data[i].value;
                                            } else if (response.data[i].concept.name === bloodPressureDiastolicVSNew) {
                                                tableStructure.bloodPressureDiastolicVSNew = response.data[i].value;
                                            } else if (response.data[i].concept.name === familyPlanning) {
                                                tableStructure.familyPlanning = response.data[i].value;
                                            } else if (response.data[i].concept.name === nutritionalState) {
                                                tableStructure.nutritionalState = response.data[i].valueAsString;
                                            } else if (response.data[i].concept.name === lastMenstruationDate) {
                                                tableStructure.lastMenstruationDate = response.data[i].valueAsString;
                                            } else if (response.data[i].concept.name === pregnancyYesNo) {
                                                tableStructure.pregnancyYesNo = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === breastFeeding) {
                                                tableStructure.breastFeeding = response.data[i].value;
                                            } else if (response.data[i].concept.name === familyPlanningMethods) {
                                                tableStructure.familyPlanningMethods = response.data[i].valueAsString;
                                            } else if (response.data[i].concept.name === whoStaging) {
                                                tableStructure.whoStaging = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === infantsOdemaProphylaxis) {
                                                tableStructure.infantsOdemaProphylaxis = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === weight) {
                                                tableStructure.weight = response.data[i].value;
                                            } else if (response.data[i].concept.name === height) {
                                                tableStructure.height = response.data[i].value;
                                            } else if (response.data[i].concept.name === brachialPerimeter) {
                                                tableStructure.brachialPerimeter = response.data[i].value;
                                            } else if (response.data[i].concept.name === bmi) {
                                                tableStructure.bmi = response.data[i].value;
                                            } else if (response.data[i].concept.name === receivedNutritionalSupport) {
                                                tableStructure.receivedNutritionalSupport = response.data[i].value;
                                            } else if (response.data[i].concept.name === receivedNutritionalEducation) {
                                                tableStructure.receivedNutritionalEducation = response.data[i].value;
                                            } else if (response.data[i].concept.name === nutritionSupplement) {
                                                tableStructure.nutritionSupplement = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === nutritionalSupplementQt) {
                                                tableStructure.nutritionalSupplementQt = response.data[i].value;
                                            } else if (response.data[i].concept.name === nutritionalSupplementMeasurementUnit) {
                                                tableStructure.nutritionalSupplementMeasurementUnit = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === hasTBSymptoms) {
                                                tableStructure.hasTBSymptoms = response.data[i].value;
                                            } else if (response.data[i].concept.name === prophylaxisSymptoms) {
                                                tableStructure.prophylaxisSymptoms = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === dateOfDiagnosis) {
                                                tableStructure.dateOfDiagnosis = response.data[i].value;
                                            } else if (response.data[i].concept.name === tbTreatmentStartDate) {
                                                tableStructure.tbTreatmentStartDate = response.data[i].value;
                                            } else if (response.data[i].concept.name === tbTreatmentState) {
                                                tableStructure.tbTreatmentState = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === tbTreatmentEndDate) {
                                                tableStructure.tbTreatmentEndDate = response.data[i].value;
                                            } else if (response.data[i].concept.name === typeOfProphylaxis) {
                                                tableStructure.typeOfProphylaxis = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === startDateProphylaxisINH) {
                                                tableStructure.startDateProphylaxisINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === stateProphylaxisINH) {
                                                tableStructure.stateProphylaxisINH = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === endDateProphylaxisINH) {
                                                tableStructure.endDateProphylaxisINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === spSideEffectsINH) {
                                                tableStructure.spSideEffectsINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === secondaryEffectsINH) {
                                                tableStructure.secondaryEffectsINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === startDateProphylaxisCTZ) {
                                                tableStructure.startDateProphylaxisCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === stateProphylaxisCTZ) {
                                                tableStructure.stateProphylaxisCTZ = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === endDateProphylaxisCTZ) {
                                                tableStructure.endDateProphylaxisCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === spSideEffectsCTZ) {
                                                tableStructure.spSideEffectsCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === secondaryEffectsCTZ) {
                                                tableStructure.secondaryEffectsCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === hasSTISymptoms) {
                                                tableStructure.hasSTISymptoms = response.data[i].value;
                                            } else if (response.data[i].concept.name === stiDiagnosisProphylaxis) {
                                                tableStructure.stiDiagnosisProphylaxis = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === syndromicApproachSTIM) {
                                                tableStructure.syndromicApproachSTIM = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === syndromicApproachSTIF) {
                                                tableStructure.syndromicApproachSTIF = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === CD4) {
                                                tableStructure.CD4 = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === referenceSectionOtherServices && tableStructure.referenceSectionOtherServices.indexOf(response.data[i].value.shortName) === -1) {
                                                tableStructure.referenceSectionOtherServices.push(response.data[i].value.shortName);
                                            } else if (response.data[i].concept.name === tarvAdherence) {
                                                tableStructure.tarvAdherence = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === tarvSideEffects) {
                                                tableStructure.tarvSideEffects = response.data[i].value.shortName;
                                            } else if (response.data[i].concept.name === tarvSevereType && tableStructure.tarvSevereType.indexOf(response.data[i].value.shortName) === -1) {
                                                tableStructure.tarvSevereType.push(response.data[i].value.shortName);
                                                tableStructure.tarveNotSevereType = [];
                                                tableStructure.tarvLifeRisk = [];
                                            } else if (response.data[i].concept.name === tarveNotSevereType && tableStructure.tarveNotSevereType.indexOf(response.data[i].value.shortName) === -1) {
                                                tableStructure.tarveNotSevereType.push(response.data[i].value.shortName);
                                                tableStructure.tarvSevereType = [];
                                                tableStructure.tarvLifeRisk = [];
                                            } else if (response.data[i].concept.name === tarvLifeRisk && tableStructure.tarvLifeRisk.indexOf(response.data[i].value.shortName) === -1) {
                                                tableStructure.tarvLifeRisk.push(response.data[i].value.shortName);
                                                tableStructure.tarvSevereType = [];
                                                tableStructure.tarveNotSevereType = [];
                                            } else if (response.data[i].concept.name === TBdateDiag) {
                                                if (response.data[i].value !== undefined) {
                                                    tableStructure.TBdateDiag = true;
                                                } else if (response.data[i].value == undefined) {
                                                    tableStructure.TBdateDiag = false;
                                                }
                                            } else if (response.data[i].value.shortName) {
                                                tableStructure.values.push(response.data[i].value.shortName);
                                            }
                                            obsTable.push(tableStructure);

                                            obsTable.forEach(function (obs) {
                                                if (masterCardModel.patientInfo.age > 5) {
                                                    obs.ageAtVisit = new Date(obs.actualVisit).getFullYear() - new Date(masterCardModel.patientInfo.birth_date).getFullYear();
                                                    obs.indicator = 'BMI';
                                                } else {
                                                    var age = new Date(obs.actualVisit).getFullYear() - new Date(masterCardModel.patientInfo.birth_date).getFullYear();
                                                    obs.ageAtVisit = age * 12;
                                                    obs.indicator = 'BP';
                                                }
                                            });
                                        }
                                    }
                                }
                            }

                            labOrderResultService.getAllForPatient({ patientUuid: patientUuid }).then(function (response) {
                                if (response.labAccessions && response.labAccessions.length > 0) {
                                    response.labAccessions.forEach(function (accession) {
                                        accession.forEach(function (accession2) {
                                            if (accession2.tests) {
                                                accession2.tests.forEach(function (test) {
                                                    if (test.testName === 'CD4 %') {
                                                        obsTable.forEach(function (observation) {
                                                            if (observation.actualVisit === new Date(test.visitStartTime).getFullYear() + '-' + (new Date(test.visitStartTime).getMonth() + 1) + '-' + new Date(test.visitStartTime).getDate()) {
                                                                observation.cd4 = test.result;
                                                            }
                                                        });
                                                    } else if (test.testName === 'ALT') {
                                                        obsTable.forEach(function (observation) {
                                                            if (observation.actualVisit === new Date(test.visitStartTime).getFullYear() + '-' + (new Date(test.visitStartTime).getMonth() + 1) + '-' + new Date(test.visitStartTime).getDate()) {
                                                                observation.alt = test.result;
                                                            }
                                                        });
                                                    } else if (test.testName === 'AST') {
                                                        obsTable.forEach(function (observation) {
                                                            if (observation.actualVisit === new Date(test.visitStartTime).getFullYear() + '-' + (new Date(test.visitStartTime).getMonth() + 1) + '-' + new Date(test.visitStartTime).getDate()) {
                                                                observation.ast = test.result;
                                                            }
                                                        });
                                                    } else if (test.testName === 'HGB') {
                                                        obsTable.forEach(function (observation) {
                                                            if (observation.actualVisit === new Date(test.visitStartTime).getFullYear() + '-' + (new Date(test.visitStartTime).getMonth() + 1) + '-' + new Date(test.visitStartTime).getDate()) {
                                                                observation.hgb = test.result;
                                                            }
                                                        });
                                                    } else if (test.testName === 'CARGA VIRAL (Absoluto-Rotina)' || test.testName === 'CARGA VIRAL(Qualitativo-Rotina)') {
                                                        obsTable.forEach(function (observation) {
                                                            if (observation.actualVisit === new Date(test.visitStartTime).getFullYear() + '-' + (new Date(test.visitStartTime).getMonth() + 1) + '-' + new Date(test.visitStartTime).getDate()) {
                                                                observation.viralLoad = test.result;
                                                            }
                                                        });
                                                    } else if (test.testName === 'GLYCEMIA(3.05-6.05mmol/L)') {
                                                        obsTable.forEach(function (observation) {
                                                            if (observation.actualVisit === new Date(test.visitStartTime).getFullYear() + '-' + (new Date(test.visitStartTime).getMonth() + 1) + '-' + new Date(test.visitStartTime).getDate()) {
                                                                observation.gl = test.result;
                                                            }
                                                        });
                                                    }
                                                    else if (test.testName === 'CREATININE(4.2-132Hmol/L)') {
                                                        obsTable.forEach(function (observation) {
                                                            if (observation.actualVisit === new Date(test.visitStartTime).getFullYear() + '-' + (new Date(test.visitStartTime).getMonth() + 1) + '-' + new Date(test.visitStartTime).getDate()) {
                                                                observation.cr = test.result;
                                                            }
                                                        });
                                                    }
                                                    else if (test.testName === 'AMILASE(600-1600/UL)') {
                                                        obsTable.forEach(function (observation) {
                                                            if (observation.actualVisit === new Date(test.visitStartTime).getFullYear() + '-' + (new Date(test.visitStartTime).getMonth() + 1) + '-' + new Date(test.visitStartTime).getDate()) {
                                                                observation.am = test.result;
                                                            }
                                                        });
                                                    }
                                                });
                                            } else if (accession2.testName === 'ALT') {
                                                obsTable.forEach(function (observation) {
                                                    if (observation.actualVisit === new Date(accession2.visitStartTime).getFullYear() + '-' + (new Date(accession2.visitStartTime).getMonth() + 1) + '-' + new Date(accession2.visitStartTime).getDate()) {
                                                        observation.alt = accession2.result;
                                                    }
                                                });
                                            } else if (accession2.testName === 'AST') {
                                                obsTable.forEach(function (observation) {
                                                    if (observation.actualVisit === new Date(accession2.visitStartTime).getFullYear() + '-' + (new Date(accession2.visitStartTime).getMonth() + 1) + '-' + new Date(accession2.visitStartTime).getDate()) {
                                                        observation.ast = accession2.result;
                                                    }
                                                });
                                            } else if (accession2.testName === 'HGB') {
                                                obsTable.forEach(function (observation) {
                                                    if (observation.actualVisit === new Date(accession2.visitStartTime).getFullYear() + '-' + (new Date(accession2.visitStartTime).getMonth() + 1) + '-' + new Date(accession2.visitStartTime).getDate()) {
                                                        observation.hgb = accession2.result;
                                                    }
                                                });
                                            } else if (accession2.testName === 'CARGA VIRAL (Absoluto-Rotina)' || accession2.testName === 'CARGA VIRAL(Qualitativo-Rotina)') {
                                                obsTable.forEach(function (observation) {
                                                    if (observation.actualVisit === new Date(accession2.visitStartTime).getFullYear() + '-' + (new Date(accession2.visitStartTime).getMonth() + 1) + '-' + new Date(accession2.visitStartTime).getDate()) {
                                                        observation.viralLoad = accession2.result;
                                                    }
                                                });
                                            } else if (accession2.testName === 'Carga Viral Suspeita') {
                                                obsTable.forEach(function (observation) {
                                                    if (observation.actualVisit === new Date(accession2.visitStartTime).getFullYear() + '-' + (new Date(accession2.visitStartTime).getMonth() + 1) + '-' + new Date(accession2.visitStartTime).getDate()) {
                                                        observation.viralLoad = accession2.result;
                                                    }
                                                });
                                            } else if (accession2.testName === 'GLYCEMIA(3.05-6.05mmol/L)') {
                                                obsTable.forEach(function (observation) {
                                                    if (observation.actualVisit === new Date(accession2.visitStartTime).getFullYear() + '-' + (new Date(accession2.visitStartTime).getMonth() + 1) + '-' + new Date(accession2.visitStartTime).getDate()) {
                                                        observation.gl = accession2.result;
                                                    }
                                                });
                                            }
                                            else if (accession2.testName === 'CREATININE(4.2-132Hmol/L)') {
                                                obsTable.forEach(function (observation) {
                                                    if (observation.actualVisit === new Date(accession2.visitStartTime).getFullYear() + '-' + (new Date(accession2.visitStartTime).getMonth() + 1) + '-' + new Date(accession2.visitStartTime).getDate()) {
                                                        observation.cr = accession2.result;
                                                    }
                                                });
                                            }
                                            else if (accession2.testName === 'AMILASE(600-1600/UL)') {
                                                obsTable.forEach(function (observation) {
                                                    if (observation.actualVisit === new Date(accession2.visitStartTime).getFullYear() + '-' + (new Date(accession2.visitStartTime).getMonth() + 1) + '-' + new Date(accession2.visitStartTime).getDate()) {
                                                        observation.am = accession2.result;
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                            });

                            var populateEncounterProvider = function () {
                                var params = {
                                    q: "bahmni.sqlGet.patientEncounterProvider",
                                    v: "full",
                                    patientUuid: patientUuid
                                };
                                return $http.get('/openmrs/ws/rest/v1/bahmnicore/sql', {
                                    method: "GET",
                                    params: params,
                                    withCredentials: true
                                });
                            };
                            $q.all([populateEncounterProvider()]).then(function (response) {
                                if (response[0] && response[0].data.length > 0) {
                                    for (var i = 0; i < response[0].data.length; i++) {
                                        var encounterProvider = response[0].data[i];
                                        var actualVisit = new Date(encounterProvider.date_created).getFullYear() + '-' + (new Date(encounterProvider.date_created).getMonth() + 1) + '-' + ('0' + (new Date(encounterProvider.date_created).getDate())).slice(-2);
                                        console.log(actualVisit);
                                        obsTable.forEach(function (obs) {
                                            if (obs.actualVisit === actualVisit) {
                                                obs.provider = encounterProvider.given_name + '-' + encounterProvider.family_name;
                                            }
                                        });
                                    }
                                }
                            });

                            var populatePatientStatusStateHist = function () {
                                var params = {
                                    q: "bahmni.sqlGet.getPatientStatusState",
                                    v: "full",
                                    patientUuid: patientUuid
                                };
                                return $http.get('/openmrs/ws/rest/v1/bahmnicore/sql', {
                                    method: "GET",
                                    params: params,
                                    withCredentials: true
                                });
                            };
                            $q.all([populatePatientStatusStateHist()]).then(function (response) {
                                for (var i = 0; i < response[0].data.length; i++) {
                                    var statusState = response[0].data[i];
                                    var actualVisit = new Date(statusState.date_created).getFullYear() + '-' + (new Date(statusState.date_created).getMonth() + 1) + '-' + ('0' + (new Date(statusState.date_created).getDate())).slice(-2);
                                    var lastState = response[0].data[0];
                                    var lastObs = obsTable[0];

                                    obsTable.forEach(function (obs) {
                                        if (obs.actualVisit === actualVisit) {
                                            obs.statusState = statusState.patient_state + '-' + statusState.patient_status;
                                        } else { obs.statusState = lastState.patient_state + '-' + lastState.patient_status; }
                                    });
                                    if (lastObs.statusState.length === 0) {
                                        lastObs.statusState = lastState.patient_state + '-' + lastState.patient_status;
                                    }
                                }
                            });

                            var getUpcomingAppointments = function () {
                                var params = {
                                    q: "bahmni.sqlGet.upComingAppointments",
                                    v: "full",
                                    patientUuid: patientUuid
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
                                    patientUuid: patientUuid
                                };
                                return $http.get('/openmrs/ws/rest/v1/bahmnicore/sql', {
                                    method: "GET",
                                    params: params,
                                    withCredentials: true
                                });
                            };
                            $q.all([getUpcomingAppointments(), getPastAppointments()]).then(function (response) {
                                var upcomingAppointments = response[0].data;
                                var pastAppointments = response[1].data;
                                for (let i = 0; i < upcomingAppointments.length; i++) {
                                    if (upcomingAppointments[i].DASHBOARD_APPOINTMENTS_SERVICE_KEY === 'Consulta Clínica') {
                                        obsTable.forEach(function (obs) {
                                            var observationDate = (new Date(obs.actualVisit).getDate() + '/' + (new Date(obs.actualVisit).getMonth() + 1) + '/' + new Date(obs.actualVisit).getFullYear());

                                            if (observationDate === upcomingAppointments[i].DASHBOARD_APPOINTMENTS_DATE_CREATED) {
                                                var newDate = upcomingAppointments[i].DASHBOARD_APPOINTMENTS_DATE_KEY.split("/");
                                                obs.nextVisit = newDate[0] + '/' + newDate[1] + '/' + newDate[2].slice(-2);
                                            } else /* if (upcomingAppointments[i].DASHBOARD_APPOINTMENTS_DATE_KEY > observationDate) */ {
                                                obs.nextVisit = upcomingAppointments[i].DASHBOARD_APPOINTMENTS_DATE_KEY;
                                                var newDate = upcomingAppointments[i].DASHBOARD_APPOINTMENTS_DATE_KEY.split("/");
                                                obs.nextVisit = newDate[0] + '/' + newDate[1] + '/' + newDate[2].slice(-2);
                                            }
                                        });
                                    }
                                }
                                for (let i = 0; i < pastAppointments.length; i++) {
                                    if (pastAppointments[i].DASHBOARD_APPOINTMENTS_SERVICE_KEY === 'Consulta Clínica') {
                                        obsTable.forEach(function (obs) {
                                            var observationDate = (new Date(obs.actualVisit).getDate() + '/' + (new Date(obs.actualVisit).getMonth() + 1) + '/' + new Date(obs.actualVisit).getFullYear());

                                            if (observationDate === pastAppointments[i].DASHBOARD_APPOINTMENTS_DATE_CREATED) {
                                                var newDate = pastAppointments[i].DASHBOARD_APPOINTMENTS_DATE_KEY.split("/");
                                                obs.nextVisit = newDate[0] + '/' + newDate[1] + '/' + newDate[2].slice(-2);
                                            }
                                        });
                                    }
                                }
                            });

                            var getDrugLine = function () {
                                var params = {
                                    q: "bahmni.sqlGet.patientPrescriptions",
                                    v: "full",
                                    lang_unit: "en",
                                    lang_route: "en",
                                    lang_treatmentLine: "en",
                                    patientUuid: patientUuid
                                };
                                return $http.get('/openmrs/ws/rest/v1/bahmnicore/sql', {
                                    method: "GET",
                                    params: params,
                                    withCredentials: true
                                });
                            };

                            $q.all([getDrugLine()]).then(function (response) {
                                if (response && response.length > 0) {
                                    response.forEach(function (prescriptions) {
                                        if (prescriptions.data && prescriptions.data.length > 0) {
                                            prescriptions.data.forEach(function (prescription) {
                                                for (var i = 0; i < obsTable.length; i++) {
                                                    var actualVisit = new Date(prescription.date_created).getFullYear() + '-' + (new Date(prescription.date_created).getMonth() + 1) + '-' + ('0' + (new Date(prescription.date_created).getDate())).slice(-2);

                                                    if (obsTable[i].actualVisit === actualVisit) {
                                                        if (prescription.category === 'ARV') {
                                                            obsTable[i].prescribedDrugs = {};
                                                            obsTable[i].prescribedDrugs.dose = prescription.dose;
                                                            obsTable[i].prescribedDrugs.name = prescription.name;
                                                            obsTable[i].prescribedDrugs.unit = prescription.unit;
                                                            obsTable[i].prescribedDrugs.route = prescription.route;
                                                            obsTable[i].prescribedDrugs.category = prescription.category;
                                                            obsTable[i].prescribedDrugs.first_arv = prescription.first_arv;
                                                            obsTable[i].prescribedDrugs.line = prescription.line_treatment[0];
                                                            obsTable[i].prescribedDrugs.arv_dispensed = prescription.arv_dispensed;
                                                            obsTable[i].prescribedDrugs.drug_dispensed = prescription.drug_dispensed;
                                                            obsTable[i].prescribedDrugs.dispensed_date = prescription.dispensed_date;
                                                            obsTable[i].prescribedDrugs.dosing = angular.fromJson(prescription.dosing_instructions).instructions;
                                                            obsTable[i].prescribedDrugs.frequency = prescription.frequency;
                                                            break;
                                                        } else if (prescription.category !== 'ARV' && prescription.category !== 'Prophylaxis') {
                                                            if (obsTable[i].otherPerscribedDrugs) {
                                                                obsTable[i].otherPerscribedDrugs.push(prescription.name);
                                                            }
                                                        }
                                                    } else if (i === (obsTable.length - 1)) {
                                                        if (prescription.category === 'ARV') {
                                                            obsTable.push({
                                                                actualVisit: new Date(prescription.date_created).getFullYear() + '-' + (new Date(prescription.date_created).getMonth() + 1) + '-' + ('0' + (new Date(prescription.date_created).getDate())).slice(-2),
                                                                prescribedDrugs: {
                                                                    dose: prescription.dose,
                                                                    name: prescription.name,
                                                                    unit: prescription.unit,
                                                                    route: prescription.route,
                                                                    category: prescription.category,
                                                                    first_arv: prescription.first_arv,
                                                                    line: prescription.line_treatment[0],
                                                                    arv_dispensed: prescription.arv_dispensed,
                                                                    drug_dispensed: prescription.drug_dispensed,
                                                                    dispensed_date: prescription.dispensed_date,
                                                                    dosing: angular.fromJson(prescription.dosing_instructions).instructions,
                                                                    frequency: prescription.frequency
                                                                },
                                                                values: []
                                                            });
                                                        } else if (prescription.category !== 'ARV' && prescription.category !== 'Prophylaxis') {
                                                            if (obsTable.otherPerscribedDrugs) {
                                                                obsTable.otherPerscribedDrugs.push(prescription.name);
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                            populateMedicalConditions().then(function (otherCon) {

                                obsTable.forEach(function (obs) {
                                    var observationDate = (new Date(obs.actualVisit).getFullYear() + '-' + (new Date(obs.actualVisit).getMonth() + 1) + '-' + ('0' + (new Date(obs.actualVisit).getDate())).slice(-2));
                                    var diagnosisDate = (new Date(otherCon.date).getFullYear() + '-' + (new Date(otherCon.date).getMonth() + 1) + '-' + ('0' + (new Date(otherCon.date).getDate())).slice(-2));

                                    if (observationDate === diagnosisDate) {
                                        obs.otherCondition.push(otherCon.name);
                                    }
                                });
                            });

                            console.log(obsTable);
                            var slicedTable = obsTable.slice(0, 12);

                            masterCardModel.patientInfo.psychosocialFactors = slicedTable.reverse();
                            masterCardModel.patientInfo.apssPreTARVCounselling = [];
                            masterCardModel.patientInfo.apssPreTARVCounsellingComments = '';
                            masterCardModel.patientInfo.apssDifferentiatedModelsDate = '';

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
                                        masterCardModel.patientInfo.apssAgreementContactType = apssATCACTVisit;
                                    }
                                }

                                for (var k = 0; k < masterCardModel.patientInfo.psychosocialFactors.length; k++) {
                                    if (masterCardModel.patientInfo.psychosocialFactors[k].apssPreTARVCounsellingComments) {
                                        masterCardModel.patientInfo.apssPreTARVCounsellingComments = masterCardModel.patientInfo.psychosocialFactors[k].apssPreTARVCounsellingComments;
                                    }
                                } if (masterCardModel.patientInfo.psychosocialFactors.length < 12) {
                                    masterCardModel.patientInfo.psychosocialFactorsActualEmpty = [];
                                    for (var m = 0; m < 12 - masterCardModel.patientInfo.psychosocialFactors.length; m++) {
                                        masterCardModel.patientInfo.psychosocialFactorsActualEmpty.push(m);
                                    }
                                }
                                if (masterCardModel.patientInfo.psychosocialFactorsActualEmpty.length === 0) {
                                    masterCardModel.patientInfo.psychosocialFactorsNextEmpty = [1];
                                } else {
                                    for (var n = 0; n < masterCardModel.patientInfo.psychosocialFactorsActualEmpty.length; n++) {
                                        masterCardModel.patientInfo.psychosocialFactorsNextEmpty.push(n);
                                    }
                                    masterCardModel.patientInfo.psychosocialFactorsNextEmpty = masterCardModel.patientInfo.psychosocialFactorsNextEmpty;
                                }
                                for (var q = 0; q < masterCardModel.patientInfo.psychosocialFactors.length; q++) {
                                    if (masterCardModel.patientInfo.psychosocialFactors[q].apssDifferentiatedModelsDate && !masterCardModel.patientInfo.apssDifferentiatedModelsDate) {
                                        masterCardModel.patientInfo.apssDifferentiatedModelsDate = masterCardModel.patientInfo.psychosocialFactors[q].apssDifferentiatedModelsDate;
                                    }
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

                        if ($rootScope.patient.PRIMARY_CONTACT_NUMBER_1 !== undefined) {
                            masterCardModel.patientInfo.mainContact = $rootScope.patient.PRIMARY_CONTACT_NUMBER_1.value;
                        }

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
                            } masterCardModel.patientInfo.diagnosisPastName = arr;
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
                        var addressMap = patient.address;
                        masterCardModel.patientInfo.town = addressMap.address1;
                        masterCardModel.patientInfo.district = addressMap.address2;
                        masterCardModel.patientInfo.block = addressMap.address3;
                        masterCardModel.patientInfo.streetHouse = addressMap.address4;
                        masterCardModel.patientInfo.closeOf = response.data.person.preferredAddress.postalCode;
                        masterCardModel.patientInfo.province = addressMap.stateProvince;
                        masterCardModel.patientInfo.registrationDate = response.data.person.auditInfo.dateCreated;

                        response.data.person.attributes.forEach(function (attribute) {
                            if (attribute.attributeType.display === 'HEALTH_FACILITY_NAME') {
                                masterCardModel.healthFacilityInfo.name = attribute.value.split(' -')[0];
                            }
                            if (attribute.attributeType.display === 'HEALTH_FACILITY_DISTRICT') {
                                masterCardModel.healthFacilityInfo.district = attribute.value;
                            }
                            if (attribute.attributeType.display === 'HEALTH_FACILITY_PROVINCE') {
                                masterCardModel.healthFacilityInfo.province = attribute.value;
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
                                masterCardModel.transferOut.healthFacilityName = attribute.value.split(' -')[0];
                            }
                            if (attribute.attributeType.display === 'TRANSFER_OUT_DISTRICT') {
                                masterCardModel.transferOut.healthFacilityDistrict = attribute.value;
                            }
                            if (attribute.attributeType.display === 'TRANSFER_OUT_PROVINCE') {
                                masterCardModel.transferOut.healthFacilityProvince = attribute.value;
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
                            if (attribute.attributeType.display === 'SECTOR_SELECT') {
                                masterCardModel.patientInfo.sectorSelect = attribute.value.display;
                            }
                            if (attribute.attributeType.display === 'Typeoftest') {
                                masterCardModel.patientInfo.typeOfTest = attribute.value.display;
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
                                        if (currentObj.testName === 'ALT') { loName = 'LO_ALT'; }
                                        else if (currentObj.testName === 'AST') { loName = 'LO_AST'; }
                                        else if (currentObj.testName === 'CD 4') { loName = 'LO_CD4'; }
                                        else if (currentObj.testName === 'CD4 %') { loName = 'LO_CD4'; }
                                        else if (currentObj.testName === 'CD4 Abs') { loName = 'LO_CD4'; }
                                        else if (currentObj.testName === 'HGB') { loName = 'LO_HGB'; }
                                        else if (currentObj.testName === 'CARGA VIRAL (Absoluto-Rotina)') { loName = 'LO_ViralLoad'; }
                                        else if (currentObj.testName === 'CARGA VIRAL(Qualitativo-Rotina)') { loName = 'LO_ViralLoad'; }
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
                                if (response.data[1]) {
                                    masterCardModel.patientInfo.CTZ_end = response.data[1].value;
                                }
                                if (response.data[0]) {
                                    masterCardModel.patientInfo.CTZ_start = response.data[0].value;
                                }
                            });
                        }
                        else if ((response.data[0].concept.name == "INH_Details")) {
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

            var populateConfidentDetails = function () {
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
                                    masterCardModel.confident.telehone1 = detail.value;
                                } else if (detail.concept.name === 'CONFIDENT_TELEPHONE2') {
                                    masterCardModel.confident.telehone2 = detail.value;
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
                return new Promise(function (resolve, reject) {
                    allergiesService.getAllergyHistory(patientUuid).then(function (response) {
                        if (response.data && response.data.length > 0) {
                            masterCardModel.allergyHistory = [];
                            response.data.forEach(function (element) {
                                element.allergies.forEach(function (allergy) {
                                    masterCardModel.allergyHistory.push({ name: allergy.concept.name, date: allergy.dateCreated });
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
                        resolve(masterCardModel.medicalConditions.other);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };
        }]);
