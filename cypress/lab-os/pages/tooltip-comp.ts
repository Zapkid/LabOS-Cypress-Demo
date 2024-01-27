import { uiActions } from "../../actions/ui-actions";
import { TooltipDom } from "../dom/tooltip-comp-dom";

class Tooltip {
  verifyText(text: string): void {
    uiActions
      .getElementsBySelector(TooltipDom.tooltip)
      .should("have.text", text);
  }
}

export const tooltip = new Tooltip();
