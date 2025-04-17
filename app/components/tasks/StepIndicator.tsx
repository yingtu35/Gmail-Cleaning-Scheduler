import React from 'react';
import { Button } from '@/components/ui/button';

export interface StepConfig {
  label: string;
}

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStep: number;
  maxStep: number;
  goToStep: (step: number) => void;
}

export default function StepIndicator({ steps, currentStep, maxStep, goToStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Form progress">
      <ol className="flex items-center w-full">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isUnlocked = idx <= maxStep;

          return (
            <li 
              key={idx}

              className="flex items-center flex-1"
            >
              <div
                onClick ={() => isUnlocked && goToStep(idx)}
                className="flex items-center cursor-pointer"
              >
                <Button
                  variant={isActive ? 'default' : isUnlocked ? 'outline' : 'ghost'}
                  size="icon"
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => isUnlocked && goToStep(idx)} 
                  aria-current={isActive ? 'step' : undefined}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                >
                  {idx + 1}
                </Button>
                <span className="ml-2 text-sm text-gray-700 hidden sm:inline-block">
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-300 mx-4" />  // Separator
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}