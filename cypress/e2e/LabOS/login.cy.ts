import { loginPage } from "../../lab-os/pages/login-page";
import { demoPassword, demoUsername } from "../../support/env";
import { RouteAlias, interceptRoutes } from "../../lab-os/api/routes";
import { verifyElementFocus } from "../../verifications/ui-verifications";
import { OrderPageDom } from "../../lab-os/dom/order-page-dom";
import { baseDom } from "../../lab-os/dom/base-dom";

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
    verifyElementFocus(
      loginPage.getUsernameInput().parents(OrderPageDom.formField),
      baseDom.focused
    );
  });

  it("Should try to login with missing password", () => {
    loginPage.typeUsername(demoUsername);
    loginPage.clickLoginButton();
    loginPage.verifyErrorMessageText(" Password is required ");
    verifyElementFocus(
      loginPage.getPasswordInput().parents(OrderPageDom.formField),
      baseDom.focused
    );
  });
});

// TODO - Add assertion on input fields that should be red or not.
