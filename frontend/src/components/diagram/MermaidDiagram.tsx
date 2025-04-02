import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current && chart) {
      // Configure and initialize mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        }
      });
      
      // Render the diagram
      const renderDiagram = async () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          try {
            const { svg } = await mermaid.render('mermaid-diagram', chart);
            containerRef.current.innerHTML = svg;
          } catch (error) {
            console.error('Failed to render mermaid diagram:', error);
            containerRef.current.innerHTML = `
              <div class="p-4 text-red-500 bg-red-50 rounded-lg">
                <p class="font-medium">Error rendering diagram</p>
                <pre class="mt-2 text-sm overflow-auto">${
                  error instanceof Error ? error.message : 'Unknown error'
                }</pre>
              </div>
            `;
          }
        }
      };
      
      renderDiagram();
    }
  }, [chart]);
  
  return (
    <div 
      ref={containerRef} 
      className={`w-full overflow-auto ${className}`}
    >
      {!chart && (
        <div className="flex items-center justify-center h-full">
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
      )}
    </div>
  );
};
