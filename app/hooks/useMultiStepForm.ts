import { ReactElement, useState, useEffect } from "react";

export default function useMultiStepForm(steps: ReactElement[]) {
  const [currentStep, setCurrentStep] = useState(0);
  // track highest unlocked step (initially 0)
  const [maxStep, setMaxStep] = useState(0);

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

  // whenever currentStep grows, unlock that panel
  useEffect(() => {
    if (currentStep > maxStep) {
      setMaxStep(currentStep);
    }
  }, [currentStep, maxStep]);

  return {
    currentStep,
    step: steps[currentStep],
    steps,
    maxStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    goToStep,
    nextStep,
    prevStep
  }
}