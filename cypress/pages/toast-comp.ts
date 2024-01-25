import { uiActions } from "../actions/ui-actions";
import { ToastDom } from "../lab-os-dom/toast-comp-dom";

class Toast {
  getContent(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementsBySelector(ToastDom.toastContent);
  }

  getTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions
      .getElementsBySelector(ToastDom.toastContent, "div")
      .first();
  }
}

export const toast = new Toast();
