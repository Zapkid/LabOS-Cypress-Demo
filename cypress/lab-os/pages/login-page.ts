import { Interception } from "cypress/types/net-stubbing";
import { uiActions } from "../../actions/ui-actions";
import { LoginPageDataCy } from "../dom/login-page-dom";
import { AuthResponse } from "../types/login-types";
import { verifyResponse } from "../../verifications/api-verifications";
import { routes } from "../api/routes";
import { verifyElementText } from "../../verifications/ui-verifications";
import { ErrorCode } from "../api/error-codes";
import { ErrorMessageText } from "../text/error-messages";

const errorCodeDetails = [
  {
    code: ErrorCode.incorrectCredentials,
    message: ErrorMessageText.incorrectCredentials,
  },
  {
    code: ErrorCode.systemBlock,
    message: ErrorMessageText.systemBlock,
  },
];

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

  getErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementsBySelector("mat-error");
  }

  verifyErrorMessageText(text: string): void {
    verifyElementText(this.getErrorMessage(), text);
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

  verifyAuthError = (): void => {
    verifyResponse(routes.postAuth.alias, (interception: Interception) => {
      const responseBody = interception.response.body as AuthResponse;
      const errorMessage = responseBody.errorMessage;
      const errorDetails = responseBody.errorDetails;

      expect(errorMessage).to.equal("Login failed");

      let foundErrorCode = false;
      for (const error of errorCodeDetails) {
        if (errorDetails.logicCode === error.code) {
          foundErrorCode = true;
          expect(errorDetails.details).to.equal(error.message);
        }
      }

      if (foundErrorCode) {
        this.verifyErrorMessageText(errorDetails.details);
      } else {
        throw new Error(
          `Error code not recognized from auth response. Code: ${errorDetails.logicCode}`
        );
      }
    });
  };
}

export const loginPage = new LoginPage();
