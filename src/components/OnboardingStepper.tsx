import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  completed: boolean;
  active: boolean;
}

interface OnboardingStepperProps {
  steps: Step[];
}

export default function OnboardingStepper({ steps }: OnboardingStepperProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Connecting line (background) */}
        <div className="absolute top-4 left-8 right-8 h-[2px] bg-white/10"></div>
        
        {/* Connecting line (progress fill) */}
        {(() => {
          const lastCompleted = steps.reduce((last, step, i) => step.completed ? i : last, -1);
          // Progress is 0 if nothing completed, else percentage of the distance between dots
          const progressPercent = steps.length > 1 && lastCompleted >= 0 
            ? (lastCompleted / (steps.length - 1)) * 100 
            : 0;
          
          return (
            <div 
              className="absolute top-4 left-8 h-[2px] bg-honey transition-all duration-700 ease-out origin-left"
              style={{ 
                width: `calc(${progressPercent}% - ${progressPercent > 0 ? '0px' : '0px'})`,
                // We use scaleX for smoother animation if desired, but width is fine here
                right: `calc(${100 - progressPercent}% + 2rem)`
              }}
            ></div>
          );
        })()}

        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-2 relative z-10">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step.completed 
                  ? 'bg-honey text-white shadow-[0_0_12px_rgba(200,134,10,0.4)]' 
                  : step.active 
                    ? 'bg-honey/20 text-honey border-2 border-honey animate-pulse' 
                    : 'bg-white/5 text-white/30 border border-white/10'
              }`}
            >
              {step.completed ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${
              step.completed 
                ? 'text-honey' 
                : step.active 
                  ? 'text-white font-medium' 
                  : 'text-white/30'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
