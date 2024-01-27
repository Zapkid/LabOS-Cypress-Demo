import { Page } from "../../lab-os/enums/pages";
import { dashboard } from "../../lab-os/pages/dashboard-comp";
import { loginPage } from "../../lab-os/pages/login-page";
import { orderPage } from "../../lab-os/pages/order-page";
import { tooltip } from "../../lab-os/pages/tooltip-comp";
import { demoPassword, demoUsername } from "../../support/env";
import {
  RouteAlias,
  interceptRequest,
  interceptRoutes,
  routes,
} from "../../lab-os/api/routes";
import {
  verifyElementFocus,
  verifyInputValue,
} from "../../verifications/ui-verifications";
import { OrderTestData } from "../../lab-os/types/order-types";
import { orderWorkflows } from "../../lab-os/workflows/order-workflows";
import { baseDom } from "../../lab-os/dom/base-dom";
import { errorPopup } from "../pages/error-popup-comp";

export function saveOrderSuccessTests(testDataFilePath: string) {
  describe("LabOS save Order success tests", () => {
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
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getFacilityInput),
        baseDom.focused
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
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getPatientInput),
        baseDom.focused
      );

      // Add Patient
      orderWorkflows.addPatient(patient);

      // Verify focus moved to Add medical test input
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getMedicalTestInput),
        baseDom.focused
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
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getFacilityInput),
        baseDom.focused
      );
    });
  });
}

// TODO - Add assertion on input fields that should not be red.

export function saveOrderFailTests(testDataFilePath: string) {
  describe("LabOS save Order fail tests", () => {
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
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getFacilityInput),
        baseDom.focused
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
        orderPage.getInputFormField(orderPage.getMedicalTestInput),
        baseDom.focused
      );

      // Click outside of Medical test input
      orderPage.getFacilityInput().click();

      // Verify input has red color to signal invalidity
      orderPage
        .getMedicalTestInput()
        .should("have.css", "caret-color", "rgb(210, 0, 0)");

      // Verify focus removed from Medical Test input
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getMedicalTestInput),
        baseDom.focused,
        false
      );

      // Save order
      orderPage.saveOrder();

      // Verify focus moved to Medical Test input
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getMedicalTestInput),
        baseDom.focused
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

      // Verify input has red color to signal invalidity
      orderPage
        .getPatientInput()
        .should("have.css", "caret-color", "rgb(210, 0, 0)");

      // Verify focus removed from Patient input
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getPatientInput),
        baseDom.focused,
        false
      );

      // Save order
      orderPage.saveOrder();

      // Verify focus moved to Medical Test input
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getPatientInput),
        baseDom.focused
      );
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

      // Verify input has red color to signal invalidity
      orderPage
        .getPhysicianInput()
        .should("have.css", "caret-color", "rgb(210, 0, 0)");

      // Verify focus removed from Physician input
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getPhysicianInput),
        baseDom.focused,
        false
      );

      // Save order
      orderPage.saveOrder();

      // Verify error popup on missing Physician input
      errorPopup.getPopup().should("be.visible");
      errorPopup.getDetails().should("have.text", "Unknown Physician");
    });

    it("Should partially fill order form, missing facility & patient", function () {
      const { physician, medicalTest } = this[
        orderTestDataAlias
      ] as OrderTestData;

      // Add Physician
      orderWorkflows.addPhysician(physician.name.replace("Dr. ", ""));

      // Verify expected Physician added
      orderWorkflows.verifyPhysicianResponse(physician);

      // Select test
      orderPage.selectTest(medicalTest.name);
      interceptRequest(routes.getTest.alias);

      // Verify focus removed from Facility input
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getFacilityInput),
        baseDom.focused,
        false
      );

      // Save order
      orderPage.saveOrder();

      // Verify inputs have red color to signal invalidity
      orderPage
        .getFacilityInput()
        .should("have.css", "caret-color", "rgb(210, 0, 0)");
      orderPage
        .getPatientInput()
        .should("have.css", "caret-color", "rgb(210, 0, 0)");

      // Verify focus moved to Facility input
      verifyElementFocus(
        orderPage.getInputFormField(orderPage.getFacilityInput),
        baseDom.focused
      );
    });
  });
}
