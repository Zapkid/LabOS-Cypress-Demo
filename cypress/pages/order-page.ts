import { Modifier, uiActions } from "../actions/ui-actions";
import { OrderPageDataCy, OrderPageDom } from "../lab-os-dom/order-page-dom";

class OrderPage {
  getFacilityInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementByDataCy(
      OrderPageDataCy.facility,
      Modifier.none,
      "input"
    );
  }

  getPhysicianInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementByDataCy(
      OrderPageDataCy.physician,
      Modifier.none,
      "input"
    );
  }

  getPatientInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementByDataCy(
      OrderPageDataCy.patient,
      Modifier.none,
      "input"
    );
  }

  getMedicalTestInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementByDataCy(
      OrderPageDataCy.test,
      Modifier.none,
      "input"
    );
  }

  typeFacility(facility: string): void {
    uiActions.typeText(this.getFacilityInput(), facility);
  }

  typePhysician(physician: string): void {
    uiActions.typeText(this.getPhysicianInput(), physician);
  }

  typePatient(patient: string): void {
    uiActions.typeText(this.getPatientInput(), patient);
  }

  getTest(test: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementsBySelector(OrderPageDom.test).contains(test);
  }

  getMedicalTestStar(test: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getTest(test).parent(OrderPageDom.test)
    .find(OrderPageDom.star);
  }

  selectTest(test: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getTest(test).click();
  }

  getSaveButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementByDataCy(OrderPageDataCy.saveButton);
  }

  saveOrder(): void {
    this.getSaveButton().click();
  }

  getSelectedTest(test: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementsBySelector(OrderPageDom.selectedTestText).contains(test);
  }

  getInputFormField(getInput: () => Cypress.Chainable<JQuery<HTMLElement>>): Cypress.Chainable<JQuery<HTMLElement>> {
    return getInput().parents(OrderPageDom.formField);
  }
}

export const orderPage = new OrderPage();
