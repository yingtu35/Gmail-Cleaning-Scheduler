import { ReactElement, useState, useEffect, useRef, createRef } from "react";

export default function useMultiStepForm(steps: ReactElement[]) {
  const stepRefs = useRef(steps.map(() => createRef<HTMLDivElement>()));
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

  // scroll to active panel on step change
  useEffect(() => {
    // scroll only when currentStep or maxStep changes, so panel is rendered
    const panel = stepRefs.current[currentStep]?.current;
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStep, maxStep]);

  // whenever currentStep grows, unlock that panel
  useEffect(() => {
    if (currentStep > maxStep) {
      setMaxStep(currentStep);
    }
  }, [currentStep, maxStep]);

  return {
    stepRefs,
    currentStep,
    visibleSteps: steps.slice(0, maxStep + 1),
    maxStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    goToStep,
    nextStep,
    prevStep
  }
}