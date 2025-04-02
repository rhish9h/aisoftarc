import React from 'react';
import { MermaidDiagram } from './MermaidDiagram';
import { ArchitectureResponse } from '../../types/architecture';

interface ArchitectureResultProps {
  result: ArchitectureResponse | null;
}

export const ArchitectureResult: React.FC<ArchitectureResultProps> = ({ result }) => {
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
          </h2>
          <div className="flex space-x-2">
            <button 
              className="p-2 text-secondary-500 hover:text-primary-600 rounded-md hover:bg-secondary-50 transition-colors"
              title="Export diagram"
              onClick={() => handleExport(result.diagram)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <button 
              className="p-2 text-secondary-500 hover:text-primary-600 rounded-md hover:bg-secondary-50 transition-colors"
              title="Download diagram"
              onClick={() => handleDownload(result.diagram)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full h-96 bg-secondary-50 rounded-lg border border-secondary-200 flex items-center justify-center overflow-hidden">
          <MermaidDiagram chart={result.diagram} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <h2 className="text-2xl font-bold text-secondary-800 mb-5">
          Description
        </h2>
        <div className="space-y-4">
          <div className="bg-secondary-50 rounded-lg p-5">
            <p className="text-secondary-600 mb-4">{result.description}</p>
            
            <h3 className="font-semibold text-secondary-800 mb-2">Key Components</h3>
            <ul className="space-y-3 mb-4">
              {result.components.map((component, index) => (
                <li key={index} className="flex">
                  <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="font-medium">{component.name}:</span> {component.description}
                    {component.technologies.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {component.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex} 
                            className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-secondary-800 mb-2">Recommendations</h3>
            <ul className="space-y-2 text-secondary-600">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex">
                  <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-2xl font-bold text-secondary-800 mb-5">
          Implementation Steps
        </h2>
        <div className="bg-secondary-50 rounded-lg p-5">
          <ol className="space-y-4">
            {result.implementationSteps.map((step) => (
              <li key={step.order} className="flex">
                <div className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">
                  {step.order}
                </div>
                <div>
                  <h4 className="font-medium text-secondary-800">{step.title}</h4>
                  <p className="text-secondary-600 mt-1">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

// Helper function to export diagram (would be implemented with actual export logic)
const handleExport = (diagram: string) => {
  console.log('Exporting diagram:', diagram);
  // Implementation would depend on the export format(s) you want to support
};

// Helper function to download diagram as SVG
const handleDownload = (diagram: string) => {
  console.log('Downloading diagram:', diagram);
  // Implementation would convert the mermaid diagram to SVG and trigger download
};

// Placeholder components when no result is available
const DiagramPlaceholder = () => (
  <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
    <h2 className="text-2xl font-bold text-secondary-800 mb-5">
      Architecture Diagram
    </h2>
    <div className="w-full h-96 bg-secondary-50 rounded-lg border border-secondary-200 flex items-center justify-center overflow-hidden">
      <div className="text-center px-6">
        <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        <p className="mt-2 text-sm font-medium text-secondary-500">
          No diagram yet. Generate an architecture to see it here.
        </p>
        <p className="text-xs text-secondary-400 mt-1 max-w-sm mx-auto">
          Your generated diagram will be interactive and downloadable in multiple formats.
        </p>
      </div>
    </div>
  </div>
);

const DescriptionPlaceholder = () => (
  <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
    <h2 className="text-2xl font-bold text-secondary-800 mb-5">
      Description
    </h2>
    <div className="space-y-4">
      <div className="bg-secondary-50 rounded-lg p-5">
        <p className="text-secondary-600 mb-3">
          Once an architecture is generated, a detailed description will appear here. This will include:
        </p>
        <ul className="space-y-2 text-secondary-600">
          <li className="flex">
            <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Overall approach and key architectural components</span>
          </li>
          <li className="flex">
            <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Recommended technologies, frameworks, and libraries</span>
          </li>
          <li className="flex">
            <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Trade-offs considered and architectural decisions</span>
          </li>
          <li className="flex">
            <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Implementation guidance and best practices</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const ImplementationStepsPlaceholder = () => (
  <div className="bg-white rounded-xl shadow-soft p-6">
    <h2 className="text-2xl font-bold text-secondary-800 mb-5">
      Implementation Steps
    </h2>
    <div className="bg-secondary-50 rounded-lg p-5">
      <p className="text-secondary-600">
        The generated architecture will include recommended implementation steps to guide your development process.
      </p>
      <div className="mt-4 border border-dashed border-secondary-300 rounded-md p-4 bg-white">
        <div className="flex items-center text-secondary-400">
          <svg className="h-10 w-10 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-sm font-medium">Generate an architecture to see implementation steps</span>
        </div>
      </div>
    </div>
  </div>
);
