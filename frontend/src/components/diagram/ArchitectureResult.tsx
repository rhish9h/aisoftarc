import React from 'react';
import { MermaidDiagram } from './MermaidDiagram';
import { ArchitectureResponse } from '../../types/architecture';

interface ArchitectureResultProps {
  result: ArchitectureResponse | null;
  isLoading?: boolean;
}

export const ArchitectureResult: React.FC<ArchitectureResultProps> = ({ result, isLoading = false }) => {
  if (!result) {
    return (
      <div className="space-y-6">
        <DiagramPlaceholder />
        <DescriptionPlaceholder />
        <ImplementationStepsPlaceholder />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-secondary-800">
            Architecture Diagram
            {isLoading && <span className="ml-2 text-sm font-normal text-secondary-500">(Updating...)</span>}
          </h2>
          <div className="flex space-x-2">
            <button 
              className="p-2 text-secondary-500 hover:text-primary-600 rounded-md hover:bg-secondary-50 transition-colors"
              title="Export diagram"
              onClick={() => handleExport(result.architecture_diagram)}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <button 
              className="p-2 text-secondary-500 hover:text-primary-600 rounded-md hover:bg-secondary-50 transition-colors"
              title="Download diagram"
              onClick={() => handleDownload(result.architecture_diagram)}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
        <div className={`w-full h-96 bg-secondary-50 rounded-lg border border-secondary-200 flex items-center justify-center overflow-hidden ${isLoading ? 'opacity-50' : ''}`} data-component-name="ArchitectureResult">
          {result.architecture_diagram ? (
            <MermaidDiagram chart={result.architecture_diagram} />
          ) : (
            <div className="text-center p-6">
              <svg className="w-16 h-16 mx-auto text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <p className="mt-4 text-secondary-500">No diagram available</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">Description</h2>
        <div className={`prose max-w-none ${isLoading ? 'opacity-50' : ''}`}>
          <p>{result.description}</p>
        </div>
      </div>

      {/* Components */}
      {result.components && result.components.length > 0 && (
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <h2 className="text-2xl font-bold text-secondary-800 mb-4">Components</h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isLoading ? 'opacity-50' : ''}`}>
            {result.components.map((component, index) => (
              <div key={index} className="border border-secondary-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">{component.name}</h3>
                <p className="text-secondary-600 mb-3">{component.description}</p>
                <div className="flex flex-wrap gap-2">
                  {component.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">Recommendations</h2>
        <ul className={`list-disc pl-5 space-y-2 ${isLoading ? 'opacity-50' : ''}`}>
          {result.recommendations.map((recommendation, index) => (
            <li key={index} className="text-secondary-700">{recommendation}</li>
          ))}
        </ul>
      </div>

      {/* Implementation Steps */}
      {result.implementationSteps && result.implementationSteps.length > 0 && (
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-2xl font-bold text-secondary-800 mb-4">Implementation Steps</h2>
          <div className={`space-y-4 ${isLoading ? 'opacity-50' : ''}`}>
            {result.implementationSteps.map((step) => (
              <div key={step.order} className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-bold">
                    {step.order}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-800 mb-1">{step.title}</h3>
                  <p className="text-secondary-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to export diagram (would be implemented with actual export logic)
const handleExport = (diagram: string) => {
  console.log('Exporting diagram:', diagram);
  // Implementation would depend on the export format and mechanism
  alert('Export functionality would be implemented here');
};

// Helper function to download diagram as SVG
const handleDownload = (diagram: string) => {
  console.log('Downloading diagram:', diagram);
  // Implementation would convert the Mermaid diagram to SVG and trigger download
  alert('Download functionality would be implemented here');
};

// Placeholder components when no result is available
const DiagramPlaceholder = () => (
  <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
    <h2 className="text-2xl font-bold text-secondary-800 mb-5">
      Architecture Diagram
    </h2>
    <div className="w-full h-96 bg-secondary-50 rounded-lg border border-secondary-200 flex items-center justify-center">
      <div className="text-center p-6">
        <svg className="w-16 h-16 mx-auto text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        <p className="mt-4 text-secondary-500">Generate an architecture to see the diagram</p>
      </div>
    </div>
  </div>
);

const DescriptionPlaceholder = () => (
  <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
    <h2 className="text-2xl font-bold text-secondary-800 mb-4">Description</h2>
    <div className="space-y-2">
      <div className="h-4 bg-secondary-100 rounded w-full"></div>
      <div className="h-4 bg-secondary-100 rounded w-5/6"></div>
      <div className="h-4 bg-secondary-100 rounded w-4/6"></div>
      <div className="h-4 bg-secondary-100 rounded w-full"></div>
      <div className="h-4 bg-secondary-100 rounded w-3/4"></div>
    </div>
  </div>
);

const ImplementationStepsPlaceholder = () => (
  <div className="bg-white rounded-xl shadow-soft p-6">
    <h2 className="text-2xl font-bold text-secondary-800 mb-4">Recommendations</h2>
    <div className="space-y-3">
      <div className="h-4 bg-secondary-100 rounded w-full"></div>
      <div className="h-4 bg-secondary-100 rounded w-5/6"></div>
      <div className="h-4 bg-secondary-100 rounded w-4/6"></div>
    </div>
  </div>
);
