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
                    var p30 = populateVulPopulation();
                    // var p31 = populateEncounterDetails();
                    var p31 = visitHist();
                    //var p25 = populatePastAndUpcomingAppointments();

                    Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25]).then(function () {
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
                var brestFeeding = 'Breastfeeding_ANA';
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
                    bloodPressureDiastolicVSNew, familyPlanning, nutritionalState, lastMenstruationDate, pregnancyYesNo, brestFeeding,
                    familyPlanningMethods, whoStaging, infantsOdemaProphylaxis, weight, height, brachialPerimeter, bmi,
                    receivedNutritionalSupport, receivedNutritionalEducation, nutritionSupplement, nutritionalSupplementQt, nutritionalSupplementMeasurementUnit,
                    hasTBSymptoms, prophylaxisSymptoms, dateOfDiagnosis, tbTreatmentStartDate, tbTreatmentState, tbTreatmentEndDate, typeOfProphylaxis,
                    startDateProphylaxisINH, stateProphylaxisINH, endDateProphylaxisINH, spSideEffectsINH, secondaryEffectsINH,
                    startDateProphylaxisCTZ, stateProphylaxisCTZ, endDateProphylaxisCTZ, spSideEffectsCTZ, secondaryEffectsCTZ,
                    hasSTISymptoms, stiDiagnosisProphylaxis, syndromicApproachSTIM, syndromicApproachSTIF, CD4]).then(function (response) {
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
                                    brestFeeding: '',
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
                                    ast: ''
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
                                        tableStructure.pregnancyYesNo = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === brestFeeding) {
                                        tableStructure.brestFeeding = response.data[i].value;
                                    } else if (response.data[i].concept.name === familyPlanningMethods) {
                                        tableStructure.familyPlanningMethods = response.data[i].value;
                                    } else if (response.data[i].concept.name === whoStaging) {
                                        tableStructure.whoStaging = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === infantsOdemaProphylaxis) {
                                        tableStructure.infantsOdemaProphylaxis = response.data[i].value.name;
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
                                        tableStructure.nutritionSupplement = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === nutritionalSupplementQt) {
                                        tableStructure.nutritionalSupplementQt = response.data[i].value;
                                    } else if (response.data[i].concept.name === nutritionalSupplementMeasurementUnit) {
                                        tableStructure.nutritionalSupplementMeasurementUnit = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === hasTBSymptoms) {
                                        tableStructure.hasTBSymptoms = response.data[i].value;
                                    } else if (response.data[i].concept.name === prophylaxisSymptoms) {
                                        tableStructure.prophylaxisSymptoms = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === dateOfDiagnosis) {
                                        tableStructure.dateOfDiagnosis = response.data[i].value;
                                    } else if (response.data[i].concept.name === tbTreatmentStartDate) {
                                        tableStructure.tbTreatmentStartDate = response.data[i].value;
                                    } else if (response.data[i].concept.name === tbTreatmentState) {
                                        tableStructure.tbTreatmentState = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === tbTreatmentEndDate) {
                                        tableStructure.tbTreatmentEndDate = response.data[i].value;
                                    } else if (response.data[i].concept.name === typeOfProphylaxis) {
                                        tableStructure.typeOfProphylaxis = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === startDateProphylaxisINH) {
                                        tableStructure.startDateProphylaxisINH = response.data[i].value;
                                    } else if (response.data[i].concept.name === stateProphylaxisINH) {
                                        tableStructure.stateProphylaxisINH = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === endDateProphylaxisINH) {
                                        tableStructure.endDateProphylaxisINH = response.data[i].value;
                                    } else if (response.data[i].concept.name === spSideEffectsINH) {
                                        tableStructure.spSideEffectsINH = response.data[i].value;
                                    } else if (response.data[i].concept.name === secondaryEffectsINH) {
                                        tableStructure.secondaryEffectsINH = response.data[i].value;
                                    } else if (response.data[i].concept.name === startDateProphylaxisCTZ) {
                                        tableStructure.startDateProphylaxisCTZ = response.data[i].value;
                                    } else if (response.data[i].concept.name === stateProphylaxisCTZ) {
                                        tableStructure.stateProphylaxisCTZ = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === endDateProphylaxisCTZ) {
                                        tableStructure.endDateProphylaxisCTZ = response.data[i].value;
                                    } else if (response.data[i].concept.name === spSideEffectsCTZ) {
                                        tableStructure.spSideEffectsCTZ = response.data[i].value;
                                    } else if (response.data[i].concept.name === secondaryEffectsCTZ) {
                                        tableStructure.secondaryEffectsCTZ = response.data[i].value;
                                    } else if (response.data[i].concept.name === hasSTISymptoms) {
                                        tableStructure.hasSTISymptoms = response.data[i].value;
                                    } else if (response.data[i].concept.name === stiDiagnosisProphylaxis) {
                                        tableStructure.stiDiagnosisProphylaxis = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === syndromicApproachSTIM) {
                                        tableStructure.syndromicApproachSTIM = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === syndromicApproachSTIF) {
                                        tableStructure.syndromicApproachSTIF = response.data[i].value.name;
                                    } else if (response.data[i].concept.name === CD4) {
                                        tableStructure.CD4 = response.data[i].value.name;
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
                                                obsTable[j].pregnancyYesNo = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === brestFeeding) {
                                                obsTable[j].brestFeeding = response.data[i].value;
                                            } else if (response.data[i].concept.name === familyPlanningMethods) {
                                                obsTable[j].familyPlanningMethods = response.data[i].valueAsString;
                                            } else if (response.data[i].concept.name === whoStaging) {
                                                obsTable[j].whoStaging = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === infantsOdemaProphylaxis) {
                                                obsTable[j].infantsOdemaProphylaxis = response.data[i].value.name;
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
                                                obsTable[j].nutritionSupplement = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === nutritionalSupplementQt) {
                                                obsTable[j].nutritionalSupplementQt = response.data[i].value;
                                            } else if (response.data[i].concept.name === nutritionalSupplementMeasurementUnit) {
                                                obsTable[j].nutritionalSupplementMeasurementUnit = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === hasTBSymptoms) {
                                                obsTable[j].hasTBSymptoms = response.data[i].value;
                                            } else if (response.data[i].concept.name === prophylaxisSymptoms) {
                                                obsTable[j].prophylaxisSymptoms = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === dateOfDiagnosis) {
                                                obsTable[j].dateOfDiagnosis = response.data[i].value;
                                            } else if (response.data[i].concept.name === tbTreatmentStartDate) {
                                                obsTable[j].tbTreatmentStartDate = response.data[i].value;
                                            } else if (response.data[i].concept.name === tbTreatmentState) {
                                                obsTable[j].tbTreatmentState = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === tbTreatmentEndDate) {
                                                obsTable[j].tbTreatmentEndDate = response.data[i].value;
                                            } else if (response.data[i].concept.name === typeOfProphylaxis) {
                                                obsTable[j].typeOfProphylaxis = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === startDateProphylaxisINH) {
                                                obsTable[j].startDateProphylaxisINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === stateProphylaxisINH) {
                                                obsTable[j].stateProphylaxisINH = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === endDateProphylaxisINH) {
                                                obsTable[j].endDateProphylaxisINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === spSideEffectsINH) {
                                                obsTable[j].spSideEffectsINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === secondaryEffectsINH) {
                                                obsTable[j].secondaryEffectsINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === startDateProphylaxisCTZ) {
                                                obsTable[j].startDateProphylaxisCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === stateProphylaxisCTZ) {
                                                obsTable[j].stateProphylaxisCTZ = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === endDateProphylaxisCTZ) {
                                                obsTable[j].endDateProphylaxisCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === spSideEffectsCTZ) {
                                                obsTable[j].spSideEffectsCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === secondaryEffectsCTZ) {
                                                obsTable[j].secondaryEffectsCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === hasSTISymptoms) {
                                                obsTable[j].hasSTISymptoms = response.data[i].value;
                                            } else if (response.data[i].concept.name === stiDiagnosisProphylaxis) {
                                                obsTable[j].stiDiagnosisProphylaxis = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === syndromicApproachSTIM) {
                                                obsTable[j].syndromicApproachSTIM = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === syndromicApproachSTIF) {
                                                obsTable[j].syndromicApproachSTIF = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === CD4) {
                                                obsTable[j].CD4 = response.data[i].value.name;
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
                                                tableStructure.pregnancyYesNo = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === brestFeeding) {
                                                tableStructure.brestFeeding = response.data[i].value;
                                            } else if (response.data[i].concept.name === familyPlanningMethods) {
                                                tableStructure.familyPlanningMethods = response.data[i].valueAsString;
                                            } else if (response.data[i].concept.name === whoStaging) {
                                                tableStructure.whoStaging = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === infantsOdemaProphylaxis) {
                                                tableStructure.infantsOdemaProphylaxis = response.data[i].value.name;
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
                                                tableStructure.nutritionSupplement = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === nutritionalSupplementQt) {
                                                tableStructure.nutritionalSupplementQt = response.data[i].value;
                                            } else if (response.data[i].concept.name === nutritionalSupplementMeasurementUnit) {
                                                tableStructure.nutritionalSupplementMeasurementUnit = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === hasTBSymptoms) {
                                                tableStructure.hasTBSymptoms = response.data[i].value;
                                            } else if (response.data[i].concept.name === prophylaxisSymptoms) {
                                                tableStructure.prophylaxisSymptoms = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === dateOfDiagnosis) {
                                                tableStructure.dateOfDiagnosis = response.data[i].value;
                                            } else if (response.data[i].concept.name === tbTreatmentStartDate) {
                                                tableStructure.tbTreatmentStartDate = response.data[i].value;
                                            } else if (response.data[i].concept.name === tbTreatmentState) {
                                                tableStructure.tbTreatmentState = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === tbTreatmentEndDate) {
                                                tableStructure.tbTreatmentEndDate = response.data[i].value;
                                            } else if (response.data[i].concept.name === typeOfProphylaxis) {
                                                tableStructure.typeOfProphylaxis = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === startDateProphylaxisINH) {
                                                tableStructure.startDateProphylaxisINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === stateProphylaxisINH) {
                                                tableStructure.stateProphylaxisINH = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === endDateProphylaxisINH) {
                                                tableStructure.endDateProphylaxisINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === spSideEffectsINH) {
                                                tableStructure.spSideEffectsINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === secondaryEffectsINH) {
                                                tableStructure.secondaryEffectsINH = response.data[i].value;
                                            } else if (response.data[i].concept.name === startDateProphylaxisCTZ) {
                                                tableStructure.startDateProphylaxisCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === stateProphylaxisCTZ) {
                                                tableStructure.stateProphylaxisCTZ = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === endDateProphylaxisCTZ) {
                                                tableStructure.endDateProphylaxisCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === spSideEffectsCTZ) {
                                                tableStructure.spSideEffectsCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === secondaryEffectsCTZ) {
                                                tableStructure.secondaryEffectsCTZ = response.data[i].value;
                                            } else if (response.data[i].concept.name === hasSTISymptoms) {
                                                tableStructure.hasSTISymptoms = response.data[i].value;
                                            } else if (response.data[i].concept.name === stiDiagnosisProphylaxis) {
                                                tableStructure.stiDiagnosisProphylaxis = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === syndromicApproachSTIM) {
                                                tableStructure.syndromicApproachSTIM = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === syndromicApproachSTIF) {
                                                tableStructure.syndromicApproachSTIF = response.data[i].value.name;
                                            } else if (response.data[i].concept.name === CD4) {
                                                tableStructure.CD4 = response.data[i].value.name;
                                            } else if (response.data[i].value.name) {
                                                tableStructure.values.push(response.data[i].value.name);
                                            }
                                            obsTable.push(tableStructure);
                                        }
                                    }
                                }
                            }

                            labOrderResultService.getAllForPatient({patientUuid: patientUuid}).then(function (response) {
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
                                            }
                                        });
                                    });
                                }
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
                                }

                                for (var k = 0; k < masterCardModel.patientInfo.psychosocialFactors.length; k++) {
                                    if (masterCardModel.patientInfo.psychosocialFactors[k].apssPreTARVCounsellingComments) {
                                        masterCardModel.patientInfo.apssPreTARVCounsellingComments = masterCardModel.patientInfo.psychosocialFactors[k].apssPreTARVCounsellingComments;
                                    }
                                }

                                for (var l = 0; l < masterCardModel.patientInfo.psychosocialFactors.length; l++) {
                                    if (masterCardModel.patientInfo.psychosocialFactors[l + 1]) {
                                        masterCardModel.patientInfo.psychosocialFactors[l].nextVisit = masterCardModel.patientInfo.psychosocialFactors[l + 1].actualVisit;
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
                            }).catch(function (error) {
                            });
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
