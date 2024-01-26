import { loginPage } from "../pages/login-page";
import { demoPassword, demoUsername } from "../support/env";
import { RouteAlias, interceptRoutes } from "../support/routes";
import { verifyElementFocus } from "../verifications/ui-verifications";

describe("LabOS Login page tests", () => {
  beforeEach(() => {
    cy.visit("/");
    interceptRoutes(RouteAlias.postAuth);
  });

  it("Should try to login with invalid username", () => {
    loginPage.login("demoUsername", demoPassword);
    loginPage.verifyAuthError();
  });

  it("Should try to login with invalid password", () => {
    loginPage.login(demoUsername, "demoPassword");
    loginPage.verifyAuthError();
  });

  it("Should try to login with missing username", () => {
    loginPage.typePassword(demoPassword);
    loginPage.clickLoginButton();
    loginPage.verifyErrorMessageText(" Username is required ");
    verifyElementFocus(loginPage.getUsernameInput().parents("mat-form-field"));
  });

  it("Should try to login with missing password", () => {
    loginPage.typeUsername(demoUsername);
    loginPage.clickLoginButton();
    loginPage.verifyErrorMessageText(" Password is required ");
    verifyElementFocus(loginPage.getPasswordInput().parents("mat-form-field"));
  });
});
