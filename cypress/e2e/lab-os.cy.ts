import { Page } from "../enums/pages";
import { dashboard } from "../pages/dashboard-comp";
import { loginPage } from "../pages/login-page";
import { orderPage } from "../pages/order-page";
import { tooltip } from "../pages/tooltip-comp";
import { demoPassword, demoUsername } from "../support/env";
import {
  RouteAlias,
  interceptRequest,
  interceptRoutes,
  routes,
} from "../support/routes";
import {
  verifyElementFocus,
  verifyInputValue,
} from "../verifications/ui-verifications";
import { OrderTestData } from "../types/order-types";
import { orderWorkflows } from "../workflows/order-workflows";
import { errorPopup } from "../pages/error-popup-comp";

const testDataFilePath = "order-test-data.json";

describe("LabOS tests", () => {
  const orderTestDataAlias = "orderTestData";

  beforeEach(() => {
    interceptRoutes(
      RouteAlias.postAuth,
      RouteAlias.getTestPage,
      RouteAlias.getPhysician,
      RouteAlias.getOrder,
      RouteAlias.postOrder,
      RouteAlias.getPatient,
      RouteAlias.getTest,
      RouteAlias.postDynamicParameters,
      RouteAlias.getDisplaySetting
    );

    cy.visit("/");
    loginPage.login(demoUsername, demoPassword);
    interceptRequest(routes.postAuth.alias);
    cy.url().should("include", "/dashboard");

    cy.fixture(testDataFilePath).then((testData: OrderTestData) => {
      cy.wrap(testData).as(orderTestDataAlias);
    });

    // Search & Go to Order page
    dashboard.goToPage(Page.order);
    interceptRequest(routes.getTestPage.alias);

    // Verify page initial state
    orderWorkflows.verifyInputsEmpty();
    orderPage.getSaveButton().should("be.enabled");

    // Verify focus on Facility input
    verifyElementFocus(orderPage.getInputFormField(orderPage.getFacilityInput));
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getPhysicianInput),
      false
    );
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getPatientInput),
      false
    );
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getMedicalTestInput),
      false
    );
  });

  it("Should fill order form & save order successfully", function () {
    const { facility, physician, patient, medicalTest } = this[
      orderTestDataAlias
    ] as OrderTestData;
    const expectedPhysicianText = `${physician.name} (${physician.code.value})`;

    // Add Facility
    orderWorkflows.addFacility(facility);

    // Verify expected Physician added
    orderWorkflows.verifyPhysicianResponse(physician);

    // Verify Physician on hover tooltip text
    verifyInputValue(orderPage.getPhysicianInput, expectedPhysicianText);
    orderPage.getPhysicianInput().realHover();
    tooltip.verifyText(expectedPhysicianText);

    // Verify focus moved to Patient input
    verifyElementFocus(orderPage.getInputFormField(orderPage.getPatientInput));
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getFacilityInput),
      false
    );
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getPhysicianInput),
      false
    );
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getMedicalTestInput),
      false
    );

    // Add Patient
    orderWorkflows.addPatient(patient);

    // Verify focus moved to Add medical test input
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getMedicalTestInput)
    );
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getFacilityInput),
      false
    );
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getPhysicianInput),
      false
    );
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getPatientInput),
      false
    );

    // Verify star on hover tooltip text
    orderPage.getMedicalTestStar(medicalTest.name).realHover();
    tooltip.verifyText(medicalTest.starTooltip);

    // Select test
    orderPage.selectTest(medicalTest.name);
    interceptRequest(routes.getTest.alias);

    // Verify selected test
    orderPage.getSelectedTest(` ${medicalTest.selectedText} `);

    // Save order
    orderPage.saveOrder();

    // Verify toaster order name matches backend response
    orderWorkflows.verifyOrderNameResponse();

    // Verify Order page input fields are empty
    orderWorkflows.verifyInputsEmpty();

    // Verify focus moved to Facility
    verifyElementFocus(orderPage.getInputFormField(orderPage.getFacilityInput));
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getPhysicianInput),
      false
    );
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getPatientInput),
      false
    );
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getMedicalTestInput),
      false
    );
  });

  it("Should partially fill order form, missing selected medical test", function () {
    const { facility, physician, patient } = this[
      orderTestDataAlias
    ] as OrderTestData;

    // Add Facility
    orderWorkflows.addFacility(facility);

    // Verify expected Physician added
    orderWorkflows.verifyPhysicianResponse(physician);

    // Add Patient
    orderWorkflows.addPatient(patient);

    // Verify focus moved to Medical Test input
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getMedicalTestInput)
    );

    // Click outside of Medical test input
    orderPage.getFacilityInput().click();

    // Verify focus removed from Medical Test input
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getMedicalTestInput),
      false
    );

    // Save order
    orderPage.saveOrder();

    // Verify focus moved to Medical Test input
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getMedicalTestInput)
    );
  });

  it("Should partially fill order form, missing patient", function () {
    const { facility, physician, medicalTest } = this[
      orderTestDataAlias
    ] as OrderTestData;

    // Add Facility
    orderWorkflows.addFacility(facility);

    // Verify expected Physician added
    orderWorkflows.verifyPhysicianResponse(physician);

    // Select test
    orderPage.selectTest(medicalTest.name);
    interceptRequest(routes.getTest.alias);

    // Click outside of Patient input
    orderPage.getFacilityInput().click();

    // Verify no focus on Patient input
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getPatientInput),
      false
    );

    // Save order
    orderPage.saveOrder();

    // Verify focus moved to Medical Test input
    verifyElementFocus(orderPage.getInputFormField(orderPage.getPatientInput));
  });

  it("Should partially fill order form, missing physician", function () {
    const { facility, physician, patient, medicalTest } = this[
      orderTestDataAlias
    ] as OrderTestData;

    // Add Facility
    orderWorkflows.addFacility(facility);

    // Verify expected Physician added
    orderWorkflows.verifyPhysicianResponse(physician);

    // Add Patient
    orderWorkflows.addPatient(patient);

    // Select test
    orderPage.selectTest(medicalTest.name);
    interceptRequest(routes.getTest.alias);

    // Clear Physician
    orderPage.getPhysicianInput().clear();
    interceptRequest(routes.getPhysician.alias);

    // Click outside of Physician input
    orderPage.getFacilityInput().click();

    // Verify no focus on Physician input
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getPhysicianInput),
      false
    );

    // Save order
    orderPage.saveOrder();

    // Verify error popup on missing Physician input
    errorPopup.getPopup().should("be.visible");
    errorPopup.getDetails().should("have.text", "Unknown Physician");
  });

  it("Should partially fill order form, missing facility & patient", function () {
    const { facility, physician, patient, medicalTest } = this[
      orderTestDataAlias
    ] as OrderTestData;

    // Add Physician
    orderWorkflows.addPhysician(physician.name.replace("Dr. ", ""));

    // Verify expected Physician added
    orderWorkflows.verifyPhysicianResponse(physician);

    // Select test
    orderPage.selectTest(medicalTest.name);
    interceptRequest(routes.getTest.alias);

    // Verify no focus on Facility input
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getFacilityInput),
      false
    );

    // Save order
    orderPage.saveOrder();

    // Verify focus moved to Facility input
    verifyElementFocus(orderPage.getInputFormField(orderPage.getFacilityInput));
  });
});