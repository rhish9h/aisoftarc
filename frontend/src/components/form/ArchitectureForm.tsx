import React, { useState } from 'react';
import { Button } from '@mantine/core';
import { RequirementsInput } from './RequirementsInput';
import { ProjectTypeSelect } from './ProjectTypeSelect';
import { ConstraintsInput } from './ConstraintsInput';
import { AdvancedOptions } from './AdvancedOptions';
import { HistoryPanel } from './HistoryPanel';
import { ArchitectureRequest, ProjectType, ArchitectureHistory } from '../../types/architecture';

interface ArchitectureFormProps {
  onSubmit: (request: ArchitectureRequest) => void;
  isLoading: boolean;
  history: ArchitectureHistory[];
  onSelectFromHistory: (id: string) => void;
  onClearHistory: () => void;
}

export const ArchitectureForm: React.FC<ArchitectureFormProps> = ({
  onSubmit,
  isLoading,
  history,
  onSelectFromHistory,
  onClearHistory
}) => {
  // Form state
  const [requirements, setRequirements] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('web');
  const [constraints, setConstraints] = useState('');
  const [includeSecurityConsiderations, setIncludeSecurityConsiderations] = useState(false);
  const [generateDeploymentDiagram, setGenerateDeploymentDiagram] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!requirements.trim()) {
      alert('Please enter software requirements');
      return;
    }
    
    // Create request object
    const request: ArchitectureRequest = {
      requirements,
      projectType,
      constraints: constraints.trim() || undefined,
      includeSecurityConsiderations,
      generateDeploymentDiagram
    };
    
    onSubmit(request);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-secondary-800 mb-6 pb-3 border-b border-secondary-100">
        Generate Architecture
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <RequirementsInput 
          value={requirements} 
          onChange={setRequirements} 
          required
        />
        
        <ProjectTypeSelect 
          value={projectType} 
          onChange={setProjectType} 
        />
        
        <ConstraintsInput 
          value={constraints} 
          onChange={setConstraints} 
        />
        
        <AdvancedOptions 
          includeSecurityConsiderations={includeSecurityConsiderations}
          onIncludeSecurityConsiderationsChange={setIncludeSecurityConsiderations}
          generateDeploymentDiagram={generateDeploymentDiagram}
          onGenerateDeploymentDiagramChange={setGenerateDeploymentDiagram}
        />
        
        <Button
          type="submit"
          fullWidth
          color="primary"
          loading={isLoading}
          size="md"
          className="mt-4 bg-primary-600 hover:bg-primary-700 text-white transition-all duration-150"
        >
          Generate Architecture
        </Button>
      </form>

      <HistoryPanel
        items={history}
        onSelectItem={onSelectFromHistory}
        onClearHistory={onClearHistory}
      />
    </div>
  );
};
