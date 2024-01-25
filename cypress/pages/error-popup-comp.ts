import { uiActions } from "../actions/ui-actions";

class ErrorPopup {
  getPopup(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementsBySelector('st-action-confirmation-error');
  }

  getDetails(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementsBySelector('.st-error-details');
  }
}

export const errorPopup = new ErrorPopup();
