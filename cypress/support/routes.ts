import { Interception } from "cypress/types/net-stubbing";

export const interceptRoutes = (...aliases: RouteAlias[]): void => {
  for (const alias of aliases) {
    cy.intercept({
      method: routes[`${alias}`].method,
      url: routes[`${alias}`].url,
    }).as(routes[`${alias}`].alias);
  }
};

export const interceptRequest = (
  alias: string
): Cypress.Chainable<Interception> => {
  return cy.wait(`@${alias}`);
};

export enum RouteAlias {
  postAuth = "postAuth",
  getTestPage = "getTestPage",
  getPhysician = "getPhysician",
  getOrder = "getOrder",
  postOrder = "postOrder",
  getPatient = "getPatient",
  getTest = "getTest",
}

export const routes = {
  postAuth: {
    url: "/api/lab/authentication*",
    method: "POST",
    alias: RouteAlias.postAuth,
  },
  getTestPage: {
    url: "/api/lab/test-page/*",
    method: "GET",
    alias: RouteAlias.getTestPage,
  },
  getPhysician: {
    url: "/api/lab/physician*",
    method: "GET",
    alias: RouteAlias.getPhysician,
  },
  getOrder: {
    url: "/api/lab/order*",
    method: "GET",
    alias: RouteAlias.getOrder,
  },
  postOrder: {
    url: "/api/lab/order*",
    method: "POST",
    alias: RouteAlias.postOrder,
  },
  getPatient: {
    url: "/api/lab/patient/*",
    method: "GET",
    alias: RouteAlias.getPatient,
  },
  getTest: {
    url: "/api/lab/test/*",
    method: "GET",
    alias: RouteAlias.getTest,
  },
};
