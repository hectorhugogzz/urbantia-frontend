import React, { useState } from "react";
import { Customer, BaseModule, AddOn, QuoteData } from "./Quote/types";
import { CustomerInfoStep } from "./Quote/CustomerInfoStep";
import { BaseModulesStep } from "./Quote/BaseModulesStep";
import { AddOnsStep } from "./Quote/AddOnsStep";

export const Quote: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [step, setStep] = useState(1);

  const modules: BaseModule[] = [
    {
      moduleName: "Finanzas",
      moduleCode: "Fin",
      isSelected: true,
      isMandatory: true,
      dependsOn: [],
      licensedBy: "Users",
      includedLicenses: 5,
      additionalLicenses: 0,
      totalLicenses: 5,
    },
    {
      moduleName: "Contabilidad",
      moduleCode: "Acc",
      isSelected: false,
      isMandatory: false,
      dependsOn: ["Fin"],
      licensedBy: "Users",
      includedLicenses: 2,
      additionalLicenses: 0,
      totalLicenses: 2,
    },
    {
      moduleName: "Inventario",
      moduleCode: "Inv",
      isSelected: false,
      isMandatory: false,
      dependsOn: ["Acc"],
      licensedBy: "Users",
      includedLicenses: 1,
      additionalLicenses: 0,
      totalLicenses: 1,
    },
    {
      moduleName: "Recursos Humanos",
      moduleCode: "HR",
      isSelected: false,
      isMandatory: false,
      dependsOn: ["Fin"],
      licensedBy: "Users",
      includedLicenses: 3,
      additionalLicenses: 0,
      totalLicenses: 3,
    },
    {
      moduleName: "Nómina",
      moduleCode: "Payroll",
      isSelected: false,
      isMandatory: false,
      dependsOn: ["HR"],
      licensedBy: "Users",
      includedLicenses: 2,
      additionalLicenses: 0,
      totalLicenses: 2,
    },
  ];

  const addOns: AddOn[] = [
    {
      addOnCode: "PLAN",
      addOnName: "Planeacion",
      isSelected: false,
      dependsOn: ["Acc"],
      requiredLicenses: 50,
      metric: "Users",
      tier: "",
    },
  ];

  const [quoteData, setQuoteData] = useState<QuoteData>({
    customer: {
      opportunityId: "",
      customerName: "",
      contactName: "",
      industry: "",
      segment: "AAA",
    },
    suiteId: "enterprise",
    selectedModules: modules,
    selectedAddOns: addOns,
  });

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded p-6 mt-6">
      {step === 1 && (
        <CustomerInfoStep
          quoteData={quoteData}
          setQuoteData={setQuoteData}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <BaseModulesStep
          quoteData={quoteData}
          setQuoteData={setQuoteData}
          onNext={() => setStep(3)}
          onPrevious={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <AddOnsStep
          quoteData={quoteData}
          setQuoteData={setQuoteData}
          onPrevious={() => setStep(2)}
        />
      )}
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(quoteData, null, 2)}
      </pre>
    </div>
  );
};
