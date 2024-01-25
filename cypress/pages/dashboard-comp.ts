import { uiActions } from "../actions/ui-actions";
import { Page } from "../enums/pages";
import { DashboardDataCy, DashboardDom } from "../lab-os-dom/dashboard-comp-dom";

class Dashboard {
  getMenuButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementByDataCy(DashboardDataCy.menuButton);
  }

  getMenuSearchInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementsBySelector(DashboardDom.menuSearchInput);
  }

  getMenuOption(option: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementsBySelector(option);
  }

  clickMenuButton(): void {
    uiActions.clickElement(this.getMenuButton());
  }

  search(text: string): void {
    uiActions.typeText(this.getMenuSearchInput(), text);
  }

  clickMenuOption(page: string): void {
    uiActions.clickElement(this.getMenuOption(`a[id*="${page}"]`));
  }

  goToPage(page: Page): void {
    this.clickMenuButton();
    this.search(page);
    this.clickMenuOption(`${page.toLowerCase()}`);
  }
}

export const dashboard = new Dashboard();
