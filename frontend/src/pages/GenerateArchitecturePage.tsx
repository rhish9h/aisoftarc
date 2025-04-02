import React from 'react';

const GenerateArchitecturePage: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Column: Inputs */}
      <aside className="md:w-1/3 w-full bg-gray-50 border-r border-gray-200 p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Generate Architecture
        </h1>

        {/* Inputs Section */}
        <div className="space-y-6">
          {/* Prompt */}
          <div className="bg-white shadow-sm rounded-md p-4">
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Software Requirements
            </label>
            <textarea
              id="prompt"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the system you want to build..."
              rows={4}
            />
          </div>

          {/* Project Type */}
          <div className="bg-white shadow-sm rounded-md p-4">
            <label
              htmlFor="projectType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Type
            </label>
            <select
              id="projectType"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="web">Web Application</option>
              <option value="mobile">Mobile Application</option>
              <option value="desktop">Desktop Application</option>
              <option value="microservices">Microservices</option>
              <option value="backend">Backend Service</option>
            </select>
          </div>

          {/* Constraints */}
          <div className="bg-white shadow-sm rounded-md p-4">
            <label
              htmlFor="constraints"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Constraints (Optional)
            </label>
            <textarea
              id="constraints"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="E.g. must be HIPAA-compliant, $200 budget, etc."
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold shadow-sm transition-colors"
          >
            Generate Architecture
          </button>
        </div>

        {/* Iteration History */}
        <div className="mt-8 bg-white shadow-sm rounded-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Iteration History
          </h2>
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md text-sm divide-y divide-gray-200">
            <div className="p-2 hover:bg-blue-50 cursor-pointer">
              Iteration #1
            </div>
            <div className="p-2 hover:bg-blue-50 cursor-pointer">
              Iteration #2
            </div>
            {/* Additional iterations will appear here */}
          </div>
        </div>
      </aside>
      
      {/* Right Column: Results */}
      <main className="md:w-2/3 w-full bg-white p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Architecture Diagram
          </h2>
          <div className="w-full h-80 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
            <p className="text-gray-500">
              No diagram yet. Generate an architecture to see it here.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Description
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <p className="text-gray-600 mb-2">
              Once an architecture is generated, a detailed description will appear here.
            </p>
            <ul className="list-disc list-inside pl-2 text-gray-600 space-y-1">
              <li>Overall approach and key components</li>
              <li>Important technologies or frameworks</li>
              <li>Trade-offs and recommendations</li>
              <li>Implementation tips or best practices</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GenerateArchitecturePage;
