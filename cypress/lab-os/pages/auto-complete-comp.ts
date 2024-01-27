import { uiActions } from "../../actions/ui-actions";
import { AutoCompleteDom } from "../dom/auto-complete-comp-dom";

class AutoComplete {
  getAutoCompleteListBox(): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions.getElementsBySelector(AutoCompleteDom.autoComplete);
  }

  getAutoCompleteOption(
    option: string
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return uiActions
      .getElementsBySelector(AutoCompleteDom.autoCompleteOptionText)
      .contains(option);
  }

  clickAutoCompleteOption(option: string): void {
    this.getAutoCompleteOption(option).click();
  }
}

export const autoComplete = new AutoComplete();
