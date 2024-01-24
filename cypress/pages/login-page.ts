class LoginPage {
  getUsernameInput(): Cypress.Chainable<JQuery<HTMLLIElement>> {
    return cy.get('input[data-cy="st-form-control-username"]');
  }

  getPasswordInput(): Cypress.Chainable<JQuery<HTMLLIElement>> {
    return cy.get('input[data-cy="st-form-control-password"]');
  }

  getLoginButton(): Cypress.Chainable<JQuery<HTMLLIElement>> {
    return cy.get('button[data-cy="st-button-login-enter"]');
  }

  typeUsername(username: string): void {
    this.getUsernameInput().type(username);
  }

  typePassword(password: string): void {
    this.getPasswordInput().type(password);
  }

  clickLoginButton(): void {
    this.getLoginButton().click();
  }
}

export const loginPage = new LoginPage();
