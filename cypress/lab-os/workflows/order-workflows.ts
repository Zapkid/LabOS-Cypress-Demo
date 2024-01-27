import { Interception } from "cypress/types/net-stubbing";
import { autoComplete } from "../pages/auto-complete-comp";
import { orderPage } from "../pages/order-page";
import { interceptRequest, routes } from "../api/routes";
import {
  AdditionalCodes,
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
      const physicianResponse = interception.response.body
        .physician as PhysicianResponse["physician"];

      // Verify physician found by physician name
      for (const physicianDetails of physicianResponse) {
        if (physicianDetails.name === physician.name) {
          foundPhysician = true;
          expect(physicianDetails.name).to.equal(physician.name);

          // Verify physician code value by code name in physician additional codes response
          this.verifyPhysicianCode(physician, physicianDetails.additionalCodes);
        }
      }

      if (!foundPhysician) {
        throw new Error(`Physician not found: ${physician.name}`);
      }
    });
  };

  verifyPhysicianCode(
    physician: OrderTestData["physician"],
    additionalCodes: AdditionalCodes[]
  ) {
    let foundPhysicianCode: boolean = false;
    let verifiedPhysicianCode: boolean = false;
    for (const additionalCode of additionalCodes) {
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
