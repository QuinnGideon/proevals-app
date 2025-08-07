

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface DrillContextType {
  isDrillActive: boolean;
  setIsDrillActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const DrillContext = createContext<DrillContextType | undefined>(undefined);

export const DrillProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDrillActive, setIsDrillActive] = useState(false);
  const value = { isDrillActive, setIsDrillActive };

  return (
    <DrillContext.Provider value={value}>
      {children}
    </DrillContext.Provider>
  );
};

export const useDrills = (): DrillContextType => {
  const context = useContext(DrillContext);
  if (context === undefined) {
    throw new Error('useDrills must be used within a DrillProvider');
  }
  return context;
};
