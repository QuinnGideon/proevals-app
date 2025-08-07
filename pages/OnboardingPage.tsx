
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BrainCircuit, Target, BarChart, Trophy, PartyPopper } from 'lucide-react';

const coreOnboardingSteps = [
  {
    icon: BrainCircuit,
    title: "Forge Elite Judgment",
    copy: "Go beyond theory. Master high-stakes decisions with 5-minute daily drills designed to build and test your professional acumen."
  },
  {
    icon: Target,
    title: "Calibrate Against the Best",
    copy: "Face realistic scenarios vetted by industry leaders. Instantly compare your choices against top experts and peers to sharpen your instincts."
  },
  {
    icon: BarChart,
    title: "Measure What Matters",
    copy: "Track your progress with a personal Calibration Score—the definitive metric for how well your confidence predicts your accuracy."
  },
  {
    icon: Trophy,
    title: "Prove Your Skill",
    copy: "Build a verifiable record of your decision-making ability. Turn your judgment into a powerful asset to unlock your next career move."
  }
];

const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [animationState, setAnimationState] = useState<'in' | 'out'>('in');
  const navigate = useNavigate();

  // Use a state for steps to dynamically add the welcome message
  const [steps, setSteps] = useState(coreOnboardingSteps);

  useEffect(() => {
    // Prepend welcome step if user exists
    if (user?.name) {
        setSteps([
            {
                icon: PartyPopper,
                title: `Welcome, ${user.name}!`,
                copy: "We're thrilled to have you join us. Get ready to transform your professional judgment into a verifiable skill."
            },
            ...coreOnboardingSteps
        ]);
    }
  }, [user?.name]);

  const handleNext = () => {
    setAnimationState('out');

    setTimeout(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setAnimationState('in');
        } else {
            navigate('/drill');
        }
    }, 400); // Smoother, slightly longer transition
  };

  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  // Handle case where steps might not be initialized with welcome message yet
  if (!currentStepData) {
      return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center p-8 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-2xl">
        <div className="flex w-full space-x-2 mb-6">
          {steps.map((_, index) => (
            <div key={index} className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${index <= currentStep ? 'bg-[var(--color-brand-primary)]' : 'bg-[var(--color-bg-tertiary)]'}`}></div>
          ))}
        </div>
        
        <div className={`min-h-[250px] flex flex-col items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${animationState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
             <div className="mb-4 text-[var(--color-brand-accent)]">
                <currentStepData.icon size={48} />
             </div>
             <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)]">{currentStepData.title}</h2>
             <p className="mt-4 text-lg text-[var(--color-text-secondary)]">{currentStepData.copy}</p>
        </div>

        <div className="mt-8">
            <button
              onClick={handleNext}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] rounded-full hover:opacity-90 transition-opacity"
            >
              {isLastStep ? 'Start Your First Drill' : 'Continue'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
