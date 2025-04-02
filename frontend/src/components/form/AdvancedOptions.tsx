import React, { useState } from 'react';
import { Checkbox, Collapse } from '@mantine/core';

interface AdvancedOptionsProps {
  includeSecurityConsiderations: boolean;
  onIncludeSecurityConsiderationsChange: (value: boolean) => void;
  generateDeploymentDiagram: boolean;
  onGenerateDeploymentDiagramChange: (value: boolean) => void;
}

export const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  includeSecurityConsiderations,
  onIncludeSecurityConsiderationsChange,
  generateDeploymentDiagram,
  onGenerateDeploymentDiagramChange
}) => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => setOpened(!opened)}
        className="flex justify-between items-center w-full cursor-pointer text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
      >
        <span>Advanced Options</span>
        <span className={`transform transition-transform ${opened ? 'rotate-180' : ''}`}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      
      <Collapse in={opened}>
        <div className="mt-3 space-y-4 pl-4 border-l-2 border-secondary-100">
          <Checkbox
            checked={includeSecurityConsiderations}
            onChange={(event) => onIncludeSecurityConsiderationsChange(event.currentTarget.checked)}
            label="Include security considerations"
            className="text-sm text-secondary-700"
          />
          
          <Checkbox
            checked={generateDeploymentDiagram}
            onChange={(event) => onGenerateDeploymentDiagramChange(event.currentTarget.checked)}
            label="Generate deployment diagram"
            className="text-sm text-secondary-700"
          />
        </div>
      </Collapse>
    </div>
  );
};
