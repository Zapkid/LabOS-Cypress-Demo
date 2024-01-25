class UI_Actions {
  getElementsBySelector(
    selector: string,
    child: string = "",
    options?: { timeout?: number }
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`${selector} ${child}`, options);
  }

  getElementByDataCy(
    dataCy: string,
    modifier: Modifier = Modifier.none,
    child: string = ""
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-cy${modifier}="${dataCy}"] ${child}`);
  }

  clickElement(
    element: Cypress.Chainable<JQuery<HTMLElement>>,
    options?: { timeout?: number; force?: boolean }
  ): void {
    element.click(options);
  }

  typeText(
    element: Cypress.Chainable<JQuery<HTMLElement>>,
    text: string,
    clear = false,
    options?: { timeout?: number; delay?: number }
  ): void {
    if (clear) {
      element.clear();
    }
    element.type(text, options);
  }
}
export const uiActions = new UI_Actions();

export enum Modifier {
  none = "",
  startsWith = "^",
  endsWith = "$",
  contains = "*",
}
