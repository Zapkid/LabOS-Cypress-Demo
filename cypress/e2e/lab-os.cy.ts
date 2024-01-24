import { loginPage } from "../pages/login-page";
import { demoPassword, demoUsername } from "../support/env";

const facility = "QA Facility";
const expectedPhysician = "Dr. Hunter Atkinson (A98185)";
const expectedPhysicianName = "Dr. Hunter Atkinson";
const expectedPhysicianCodeName = "UPIN";
const expectedPhysicianCodeValue = "A98185";
const patient = "Qa Patient";
const bloodTest = "Albumin";
const expectedStarTooltipText = "SST";
const expectedBloodTestText = "109 - ALB";

describe("LabOS tests", () => {
  before("Login", () => {
    cy.intercept({ method: "POST", url: "/api/lab/authentication*" }).as(
      "auth"
    );

    cy.visit("/");

    loginPage.typeUsername(demoUsername);
    loginPage.typePassword(demoPassword);
    loginPage.clickLoginButton();

    cy.wait("@auth");

    cy.url().should("include", "/dashboard");
  });

  beforeEach(() => {
    cy.intercept("/api/lab/test-page/*").as("test-page");
    cy.intercept("/api/lab/physician*").as("physician");
    cy.intercept({ method: "GET", url: "/api/lab/order*" }).as("order");
    cy.intercept({ method: "POST", url: "/api/lab/order*" }).as("order-post");
    cy.intercept("/api/lab/patient/*").as("patient");
    cy.intercept("/api/lab/test/*").as("test-code");
  });

  it("Should add blood test & save order successfully", () => {
    cy.get('button[data-cy="st-button-menu"]').click();
    cy.get("#menuSearchInput").type("Order");
    cy.get('a[id*="order"]').click();
    cy.wait("@test-page");

    cy.get('[data-cy="st-form-control-facility"] input').type(facility);
    cy.get('[role="listbox"]').should("be.visible");
    cy.get("mat-option").contains(facility).click();
    cy.wait("@physician").then(
      (interception: {
        response?: {
          body: {
            physician: {
              name: string;
              additionalCodes: { name: string; value: string }[];
            }[];
          };
        };
      }) => {
        expect(interception.response.body.physician[0].name).to.equal(
          expectedPhysicianName
        );
        expect(
          interception.response.body.physician[0].additionalCodes[0].name
        ).to.equal(expectedPhysicianCodeName);
        expect(
          interception.response.body.physician[0].additionalCodes[0].value
        ).to.equal(expectedPhysicianCodeValue);
      }
    );

    cy.get('[data-cy="st-form-control-physician"] input').invoke('val').should('equal', expectedPhysician);
    cy.get('[data-cy="st-form-control-physician"] input').realHover();
    cy.get("#st-tooltip").should("have.text", expectedPhysician);

    cy.get('[data-cy="st-form-control-patient"] input').type(patient);
    cy.get('[role="listbox"]').should("be.visible");
    cy.get("mat-option").contains(patient).click();
    cy.wait("@patient");
    cy.wait("@physician");
    cy.wait("@order");

    cy.get('[data-cy="st-button-save"]').should("be.enabled");

    cy.get("mat-checkbox")
      .contains(bloodTest)
      .parent("mat-checkbox")
      .find(".mat-icon")
      .realHover();
    cy.get("#st-tooltip").should("have.text", expectedStarTooltipText);

    cy.get("mat-checkbox").contains(bloodTest).click();
    cy.wait("@test-code");

    cy.get(".st-test-text").should("have.text", ` ${expectedBloodTestText} `);

    cy.get('[data-cy="st-button-save"]').click();

    cy.wait("@order-post").then(
      (interception: {
        response?: {
          body: {
            order: {
              orderName: string;
            }[];
          };
        };
      }) => {
        const orderName = JSON.stringify(interception.response.body.order[0].orderName).replaceAll('"','');
        cy.get('st-order-saved-toast div').first().should('have.text', ` Order ${orderName} saved successfully `);
       
        cy.get('[data-cy="st-form-control-facility"] input').invoke('val').should('equal', '');
        cy.get('[data-cy="st-form-control-physician"] input').invoke('val').should('equal', '');
        cy.get('[data-cy="st-form-control-patient"] input').invoke('val').should('equal', '');
      }
    );
  });
});
