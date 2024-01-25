import { uiActions } from "../actions/ui-actions";
import { LoginPageDataCy } from "../lab-os-dom/login-page-dom";

class LoginPage {
  getUsernameInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementByDataCy(LoginPageDataCy.usernameInput);
  }

  getPasswordInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementByDataCy(LoginPageDataCy.passwordInput);
  }

  getLoginButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementByDataCy(LoginPageDataCy.loginButton);
  }

  typeUsername(username: string): void {
    uiActions.typeText(this.getUsernameInput(), username);
  }

  typePassword(password: string): void {
    uiActions.typeText(this.getPasswordInput(), password);
  }

  clickLoginButton(): void {
    uiActions.clickElement(this.getLoginButton());
  }

  login(username: string, password: string): void {
    this.typeUsername(username);
    this.typePassword(password);
    this.clickLoginButton();
  }
}

export const loginPage = new LoginPage();
