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

const testDataFilePath = "order-test-data.json";

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
    verifyElementFocus(orderPage.getInputFormField(orderPage.getFacilityInput));
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

    // Add Patient
    orderWorkflows.addPatient(patient);

    // Verify focus moved to Add medical test input
    verifyElementFocus(
      orderPage.getInputFormField(orderPage.getMedicalTestInput)
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
  });
});
