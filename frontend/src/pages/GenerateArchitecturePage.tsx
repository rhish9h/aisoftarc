import React from 'react';
import { useArchitectureGenerator } from '../hooks/useArchitectureGenerator';
import { ArchitectureForm } from '../components/form/ArchitectureForm';
import { ArchitectureResult } from '../components/diagram/ArchitectureResult';
import ErrorBoundary from '../components/ui/ErrorBoundary';

/**
 * GenerateArchitecturePage component
 * 
 * This page manages the architecture generation flow using a clean architecture approach:
 * 1. Separation of concerns - UI, business logic, and data access are cleanly separated
 * 2. Dependency inversion - high-level components don't depend on low-level details
 * 3. Single responsibility principle - each component has a clear, specific role
 */
const GenerateArchitecturePage: React.FC = () => {
  // Use custom hook to encapsulate all business logic
  const {
    isGenerating,
    currentResult,
    history,
    error,
    generateArchitecture,
    loadFromHistory,
    clearHistory
  } = useArchitectureGenerator();

  // Handler for form submission
  const handleGenerateArchitecture = (formData: {
    requirements: string;
    projectType: string;
    constraints: string;
    includeSecurityConsiderations: boolean;
    generateDeploymentDiagram: boolean;
  }) => {
    generateArchitecture(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 mt-4">
        {/* Left Column: Form */}
        <div className="lg:w-1/3 w-full">
          <ErrorBoundary>
            <ArchitectureForm
              onSubmit={handleGenerateArchitecture}
              isLoading={isGenerating}
              history={history}
              onSelectFromHistory={loadFromHistory}
              onClearHistory={clearHistory}
            />
          </ErrorBoundary>
        </div>

        {/* Right Column: Results */}
        <div className="lg:w-2/3 w-full">
          <ErrorBoundary>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {currentResult && (
              <ArchitectureResult 
                result={currentResult} 
                isLoading={isGenerating}
              />
            )}

            {!currentResult && !error && !isGenerating && (
              <div className="bg-white p-8 rounded-lg border border-secondary-200 shadow-sm text-center">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-xl font-medium text-secondary-800 mb-2">Generate Your Architecture</h3>
                <p className="text-secondary-600">
                  Enter your software requirements, select a project type, and add any constraints to generate a tailored architecture diagram and implementation plan.
                </p>
              </div>
            )}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default GenerateArchitecturePage;
