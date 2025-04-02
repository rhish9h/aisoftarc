import React, { useState } from 'react';

const GenerateArchitecturePage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 mt-4">
        {/* Left Column: Inputs */}
        <div className="lg:w-1/3 w-full">
          <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-secondary-800 mb-6 pb-3 border-b border-secondary-100">
              Generate Architecture
            </h2>

            {/* Inputs Section */}
            <div className="space-y-5">
              {/* Prompt */}
              <div>
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  Software Requirements
                </label>
                <div className="relative">
                  <textarea
                    id="prompt"
                    className="w-full border border-secondary-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white shadow-sm"
                    placeholder="Describe the system you want to build..."
                    rows={5}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-secondary-400">
                    Be specific for better results
                  </div>
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label
                  htmlFor="projectType"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  Project Type
                </label>
                <div className="relative">
                  <select
                    id="projectType"
                    className="w-full border border-secondary-200 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none transition-all bg-white shadow-sm"
                  >
                    <option value="web">Web Application</option>
                    <option value="mobile">Mobile Application</option>
                    <option value="desktop">Desktop Application</option>
                    <option value="microservices">Microservices</option>
                    <option value="backend">Backend Service</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-secondary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <label
                  htmlFor="constraints"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  <span>Constraints</span>
                  <span className="text-xs font-normal text-secondary-500 ml-2">(Optional)</span>
                </label>
                <textarea
                  id="constraints"
                  className="w-full border border-secondary-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white shadow-sm"
                  placeholder="E.g. regulatory requirements, budget limits, tech stack preferences..."
                  rows={3}
                />
              </div>
              
              {/* Advanced Options */}
              <div className="pt-2">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors">
                    <span>Advanced Options</span>
                    <span className="transform group-open:rotate-180 transition-transform">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3 space-y-4 pl-4 border-l-2 border-secondary-100">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-secondary-700">Include security considerations</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-secondary-700">Generate deployment diagram</span>
                      </label>
                    </div>
                  </div>
                </details>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full mt-4 py-3 px-4 rounded-lg shadow-sm font-medium text-white transition-all duration-150 
                  ${isGenerating 
                    ? 'bg-primary-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </div>
                ) : (
                  'Generate Architecture'
                )}
              </button>
            </div>

            {/* Iteration History */}
            <div className="mt-8 pt-6 border-t border-secondary-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-secondary-800">Iteration History</h3>
                <button className="text-xs text-primary-600 hover:text-primary-700">Clear All</button>
              </div>
              <div className="bg-secondary-50 rounded-lg divide-y divide-secondary-200 text-sm">
                <div className="p-3 hover:bg-secondary-100 cursor-pointer transition-colors flex justify-between items-center">
                  <div>
                    <div className="font-medium text-secondary-800">Web Application - E-commerce</div>
                    <div className="text-xs text-secondary-500">Yesterday at 2:34 PM</div>
                  </div>
                  <svg className="h-4 w-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="p-3 hover:bg-secondary-100 cursor-pointer transition-colors flex justify-between items-center">
                  <div>
                    <div className="font-medium text-secondary-800">Microservices - Healthcare</div>
                    <div className="text-xs text-secondary-500">Apr 10, 2023</div>
                  </div>
                  <svg className="h-4 w-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Results */}
        <div className="lg:w-2/3 w-full">
          <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-secondary-800">
                Architecture Diagram
              </h2>
              <div className="flex space-x-2">
                <button className="p-2 text-secondary-500 hover:text-primary-600 rounded-md hover:bg-secondary-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
                <button className="p-2 text-secondary-500 hover:text-primary-600 rounded-md hover:bg-secondary-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default GenerateArchitecturePage;
