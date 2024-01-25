import { Page } from "../enums/pages";
import { autoComplete } from "../pages/auto-complete-comp";
import { dashboard } from "../pages/dashboard-comp";
import { loginPage } from "../pages/login-page";
import { orderPage } from "../pages/order-page";
import { toast } from "../pages/toast-comp";
import { tooltip } from "../pages/tooltip-comp";
import { demoPassword, demoUsername } from "../support/env";
import {
  RouteAlias,
  interceptRequest,
  interceptRoutes,
  routes,
} from "../support/routes";
import { verifyElementFocus, verifyInputValue } from "../verifications/assert";
import {
  OrderResponse,
  OrderTestData,
  PhysicianResponse,
} from "../types/order-types";

const testDataFilePath = "order-test-data.json";

describe("LabOS tests", () => {
  const orderTestData = "orderTestData";

  before("Login", () => {
    interceptRoutes(RouteAlias.postAuth);

    cy.visit("/");
    loginPage.login(demoUsername, demoPassword);
    interceptRequest(routes.postAuth.alias);
    cy.url().should("include", "/dashboard");
  });

  beforeEach(() => {
    interceptRoutes(
      RouteAlias.getTestPage,
      RouteAlias.getPhysician,
      RouteAlias.getOrder,
      RouteAlias.postOrder,
      RouteAlias.getPatient,
      RouteAlias.getTest
    );

    cy.fixture(testDataFilePath).then((testData: OrderTestData) => {
      cy.wrap(testData).as(orderTestData);
    });
  });

  it("Should add blood test & save order successfully", function () {
    dashboard.goToPage(Page.order);
    interceptRequest(routes.getTestPage.alias);

    // Verify page initial state
    verifyInputsEmpty();
    verifyElementFocus(orderPage.getInputFormField(orderPage.getFacilityInput));
    orderPage.getSaveButton().should("be.enabled");

    const { facility, physician, patient, medicalTest } = this[
      orderTestData
    ] as OrderTestData;
    const expectedPhysicianText = `${physician.name} (${physician.code.value})`;

    // Add Facility
    orderPage.getFacilityInput().type(facility);
    autoComplete.getAutoCompleteListBox().should("be.visible");
    autoComplete.clickAutoCompleteOption(facility);

    // Verify expected Physician added
    interceptRequest(routes.getPhysician.alias).then(
      (interception: {
        response?: {
          body: PhysicianResponse;
        };
      }) => {
        verifyPhysicianResponse(interception, physician);
      }
    );
    verifyInputValue(orderPage.getPhysicianInput, expectedPhysicianText);

    // Verify Physician on hover tooltip text
    orderPage.getPhysicianInput().realHover();
    tooltip.verifyText(expectedPhysicianText);

    // Verify focus moved to Patient
    verifyElementFocus(orderPage.getInputFormField(orderPage.getPatientInput));

    // Add Patient
    orderPage.typePatient(patient);
    autoComplete.getAutoCompleteListBox().should("be.visible");
    autoComplete.clickAutoCompleteOption(patient);
    interceptRequest(routes.getPatient.alias);
    interceptRequest(routes.getPhysician.alias);
    interceptRequest(routes.getOrder.alias);

    // Verify focus moved to Add test
    verifyElementFocus(orderPage.getInputFormField(orderPage.getMedicalTestInput));

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
    interceptRequest(routes.postOrder.alias).then(
      (interception: {
        response?: {
          body: OrderResponse;
        };
      }) => {
        const orderName = interception.response.body.order[0].orderName;
        toast
          .getTitle()
          .should("have.text", ` Order ${orderName} saved successfully `);
      }
    );

    // Verify Order page has reset - input fields empty & focus on Facility input
    verifyInputsEmpty();
    verifyElementFocus(orderPage.getInputFormField(orderPage.getFacilityInput));
  });
});

function verifyInputsEmpty() {
  verifyInputValue(orderPage.getFacilityInput, "");
  verifyInputValue(orderPage.getPhysicianInput, "");
  verifyInputValue(orderPage.getPatientInput, "");
}

function verifyPhysicianResponse(
  interception: {
    response?: {
      body: PhysicianResponse;
    };
  },
  physician: { name: string; code: { name: string; value: string } }
) {
  const physicianDetails = interception.response.body.physician[0];
  expect(physicianDetails.name).to.equal(physician.name);

  // Verify physician code value by code name in additional codes
  let verifiedPhysicianCode: boolean = false;
  for (const additionalCode of physicianDetails.additionalCodes) {
    if (additionalCode.name === physician.code.name) {
      expect(additionalCode.value).to.equal(physician.code.value);
      verifiedPhysicianCode = true;
    }
  }
  expect(
    verifiedPhysicianCode,
    "Verified physician code matches backend response"
  ).to.equal(true);
}
