import { Interception } from "cypress/types/net-stubbing";
import { autoComplete } from "../pages/auto-complete-comp";
import { orderPage } from "../pages/order-page";
import { interceptRequest, routes } from "../api/routes";
import {
  OrderResponse,
  OrderTestData,
  PhysicianResponse,
} from "../types/order-types";
import { verifyResponse } from "../../verifications/api-verifications";
import { toast } from "../pages/toast-comp";
import { verifyInputValue } from "../../verifications/ui-verifications";

class OrderWorkflows {
  verifyInputsEmpty(): void {
    verifyInputValue(orderPage.getFacilityInput, "");
    verifyInputValue(orderPage.getPhysicianInput, "");
    verifyInputValue(orderPage.getPatientInput, "");
    verifyInputValue(orderPage.getMedicalTestInput, "");
  }

  addFacility(facility: string): void {
    orderPage.getFacilityInput().type(facility);
    autoComplete.getAutoCompleteListBox().should("be.visible");
    autoComplete.clickAutoCompleteOption(facility);
  }

  addPhysician(physician: string): void {
    orderPage.getPhysicianInput().type(physician);
    autoComplete.getAutoCompleteListBox().should("be.visible");
    autoComplete.clickAutoCompleteOption(physician);
  }

  addPatient(patient: string): void {
    orderPage.typePatient(patient);
    autoComplete.getAutoCompleteListBox().should("be.visible");
    autoComplete.clickAutoCompleteOption(patient);
    interceptRequest(routes.getPatient.alias);
    interceptRequest(routes.getPhysician.alias);
    interceptRequest(routes.getOrder.alias);
  }

  verifyPhysicianResponse = (physician: OrderTestData["physician"]): void => {
    verifyResponse(routes.getPhysician.alias, (interception: Interception) => {
      let foundPhysician: boolean = false;
      for (const physicianDetails of interception.response.body
        .physician as PhysicianResponse["physician"]) {
        if (physicianDetails.name === physician.name) {
          foundPhysician = true;
          const physicianDetails: PhysicianResponse["physician"][0] =
            interception.response.body.physician[0];
          expect(physicianDetails.name).to.equal(physician.name);

          // Verify physician code value by code name in additional codes
          let foundPhysicianCode: boolean = false;
          let verifiedPhysicianCode: boolean = false;
          for (const additionalCode of physicianDetails.additionalCodes) {
            if (additionalCode.name === physician.code.name) {
              foundPhysicianCode = true;
              expect(additionalCode.value).to.equal(physician.code.value);
              verifiedPhysicianCode = true;
            }
          }
          if (!foundPhysicianCode || !verifiedPhysicianCode) {
            throw new Error(
              `Physician code found: ${foundPhysicianCode}, verified: ${verifiedPhysicianCode}, in additional codes for ${physician.name}`
            );
          }
        }
        if (!foundPhysician) {
          throw new Error(`Physician not found: ${physician.name}`);
        }
      }
    });
  };

  verifyOrderNameResponse = (): void => {
    verifyResponse(routes.postOrder.alias, (interception: Interception) => {
      const responseBody = interception.response.body as OrderResponse;
      const orderName = responseBody.order[0].orderName;
      toast
        .getTitle()
        .should("have.text", ` Order ${orderName} saved successfully `);
    });
  };
}

export const orderWorkflows = new OrderWorkflows();
