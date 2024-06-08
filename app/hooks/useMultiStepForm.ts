import { ReactElement, useState } from "react";

export default function useMultiStepForm(steps: ReactElement[]) {
  const [currentStep, setCurrentStep] = useState(0);

  function nextStep() {
    setCurrentStep(i => {
      if (i >= steps.length - 1) {
        return i;
      }
      return i + 1;
    });
  }

  function prevStep() {
    setCurrentStep(i => {
      if (i <= 0) {
        return i;
      }
      return i - 1;
    
    });
  }

  function goToStep(step: number) {
    setCurrentStep(step);
  }

  return {
    currentStep,
    step: steps[currentStep],
    steps,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    goToStep,
    nextStep,
    prevStep
  }
}