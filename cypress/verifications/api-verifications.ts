import { Interception } from "cypress/types/net-stubbing";
import { RouteAlias, interceptRequest } from "../lab-os/api/routes";

export const verifyResponse = (
  routeAlias: RouteAlias,
  callback: (interception: Interception) => void
): void => {
  interceptRequest(routeAlias).then((interception) => {
    callback(interception);
  });
};
