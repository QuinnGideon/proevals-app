import React from 'react';
import { Target } from 'lucide-react';

const MockCalibrationCard: React.FC = () => {
    return (
        <div className="calibration-card-mock h-full">
            <div className="calibration-card-content p-6 h-full flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-2xl tracking-tighter">Alex T.</h3>
                        <p className="text-sm opacity-70">Product Manager (2-5 Yrs)</p>
                    </div>
                     <div className="flex items-center gap-2 text-sm opacity-80">
                        <Target size={16} />
                        ProEvals Verified
                    </div>
                </div>
                <div className="text-center my-4">
                    <div className="calibration-score-text text-8xl leading-none">89</div>
                    <p className="text-lg font-medium opacity-90 tracking-widest -mt-2">CALIBRATION</p>
                </div>
                <div className="flex justify-between items-end text-sm">
                    <p className="opacity-70">Based on 45 drills</p>
                    <div className="font-bold text-lg tracking-wider">PROEVALS</div>
                </div>
            </div>
        </div>
    );
};

export default MockCalibrationCard;
