'use client';

import { useQuote } from '@/lib/providers/quote-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PersonalInfoStep } from './steps/personal-info-step';
import { AddressStep } from './steps/address-step';
import { VehicleInfoStep } from './steps/vehicle-info-step';
import { CoverageStep } from './steps/coverage-step';
import { ReviewStep } from './steps/review-step';

const steps = [
  { id: 1, title: 'Personal Information', component: PersonalInfoStep },
  { id: 2, title: 'Address Information', component: AddressStep },
  { id: 3, title: 'Vehicle Information', component: VehicleInfoStep },
  { id: 4, title: 'Coverage Options', component: CoverageStep },
  { id: 5, title: 'Review & Quote', component: ReviewStep },
];

export function QuoteWizard() {
  const { state } = useQuote();
  const currentStepData = steps.find(step => step.id === state.currentStep);
  const StepComponent = currentStepData?.component;
  
  const progressPercentage = (state.currentStep / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Get Your Quote</CardTitle>
              <span className="text-sm text-muted-foreground">
                Step {state.currentStep} of {steps.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {steps.map((step, index) => (
                <span 
                  key={step.id}
                  className={`${
                    step.id <= state.currentStep 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {StepComponent && <StepComponent />}
        </CardContent>
      </Card>
    </div>
  );
}