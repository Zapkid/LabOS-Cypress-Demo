export type PhysicianResponse = {
  physician: {
    name: string;
    additionalCodes: AdditionalCodes[];
  }[];
};

export type AdditionalCodes = {
  name: string;
  value: string;
};

export type OrderResponse = {
  order: {
    orderName: string;
  }[];
};

export type OrderTestData = {
  facility: string;
  physician: {
    name: string;
    code: {
      name: string;
      value: string;
    };
  };
  patient: string;
  medicalTest: {
    name: string;
    starTooltip: string;
    selectedText: string;
  };
};
