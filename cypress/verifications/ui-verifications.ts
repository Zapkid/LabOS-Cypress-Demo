export const verifyInputValue = (
  getInput: () => Cypress.Chainable<JQuery<HTMLElement>>,
  value: string
) => {
  getInput().invoke("val").should("equal", value);
};

export const verifyElementFocus = (
  element: Cypress.Chainable<JQuery<HTMLElement>>,
  hasFocus: boolean = true
) => {
  element.should(`${hasFocus ? "" : "not."}have.class`, "mat-focused");
};