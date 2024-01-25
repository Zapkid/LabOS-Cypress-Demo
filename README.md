# LabOS Cypress Automation testing demo

This project contains Cypress tests for the [LabOS](https://qa-candidates.labos.cloud "LabOS") service, including UI & Backend tests.

## Setup

* Install Node.js & npm [Installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm "Downloading and installing Node.js and npm")
* Run `npm i`

## Running tests with one click

1. Run tests by running `run-tests` scripts in `package.json`.

## Running tests with Cypress

1. Run the `open-cypress` script in `package.json`.
2. The Cypress app will open (will ask for network discoverability permissions).
   ![Cypress Dashboard](cypress/assets/Cypress%20app.png "Cypress Dashboard")
3. Choose 'E2E Testing'.
   ![Cypress Browsers](cypress/assets/Cypress%20choose%20browser.png "Cypress Browsers")
4. Choose Browser - special cypress browser will open.
5. Choose tests file to run.
