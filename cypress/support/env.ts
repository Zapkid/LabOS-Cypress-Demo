const credentials = Cypress.env('credentials');
export const demoUsername = credentials.demoUsername;
export const demoPassword = credentials.demoPassword;

export const errorCodeDetails = [
    {
      code: 3091,
      message: "Incorrect username or password. Please try again.",
    },
    {
      code: 3428,
      message: "The system has been temporarily blocked because the credentials you entered are incorrect.",
    },
  ];
  