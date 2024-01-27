export const verifyInputValue = (
  getInput: () => Cypress.Chainable<JQuery<HTMLElement>>,
  value: string
) => {
  getInput().invoke("val").should("equal", value);
};

export const verifyElement = (
  element: Cypress.Chainable<JQuery<HTMLElement>>,
  assertion: string,
  value?: unknown
) => {
  element.should(assertion, value);
};

export const verifyElementFocus = (
  element: Cypress.Chainable<JQuery<HTMLElement>>,
  focusClassName: string,
  hasFocus: boolean = true
) => {
  verifyElement(element, `${hasFocus ? "" : "not."}have.class`, focusClassName);
};

export const verifyElementText = (
  element: Cypress.Chainable<JQuery<HTMLElement>>,
  text: string
) => {
  verifyElement(element, "have.text", text);
};
