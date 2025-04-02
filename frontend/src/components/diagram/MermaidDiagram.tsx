import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

// Initialize mermaid globally with optimal settings
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  logLevel: 'error',
  fontFamily: 'sans-serif',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'linear',
    diagramPadding: 8
  },
  // Disable animations for better stability
  sequence: {
    useMaxWidth: true,
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35
  }
});

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Render the diagram whenever the chart changes
    const renderDiagram = async () => {
      if (containerRef.current && chart) {
        try {
          // Clear previous content
          containerRef.current.innerHTML = '';
          
          // Create a simple div for the diagram
          const id = `mermaid-${Date.now()}`;
          containerRef.current.innerHTML = `<div id="${id}" style="width:100%;"></div>`;
          
          // Sanitize the diagram content
          let diagramContent = chart.trim();
          
          // Check if the diagram is wrapped in markdown code blocks
          if (diagramContent.startsWith('```')) {
            diagramContent = diagramContent
              .replace(/```mermaid\s*/g, '')
              .replace(/```\s*$/g, '')
              .trim();
          }
          
          // Simplify the diagram to avoid rendering issues
          // Replace complex styling with simpler alternatives
          diagramContent = diagramContent
            .replace(/style\s+\w+\s+fill:[^;]+;/g, '')
            .replace(/stroke-width:[^;]+;/g, '')
            .replace(/stroke:[^;]+;/g, '');
          
          // Render the diagram using mermaid.render instead of mermaid.run
          const { svg } = await mermaid.render(id, diagramContent);
          
          // Replace the content with the rendered SVG
          containerRef.current.innerHTML = svg;
          
          // Add pan and zoom functionality
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.width = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.minHeight = '300px';
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          }
        } catch (error) {
          console.error('Failed to render mermaid diagram:', error);
          
          // Try a fallback approach with a simpler diagram
          try {
            // Create a simplified version of the diagram
            const simplifiedDiagram = simplifyDiagram(chart);
            
            // Try rendering with the simplified version
            const id = `mermaid-fallback-${Date.now()}`;
            containerRef.current.innerHTML = `<div id="${id}" style="width:100%;"></div>`;
            
            const { svg } = await mermaid.render(id, simplifiedDiagram);
            containerRef.current.innerHTML = svg;
          } catch (fallbackError) {
            // If all else fails, show the error and the diagram code
            containerRef.current.innerHTML = `
              <div class="p-4 text-red-500 bg-red-50 rounded-lg">
                <p class="font-medium">Error rendering diagram</p>
                <pre class="mt-2 text-sm overflow-auto">${
                  error instanceof Error ? error.message : 'Unknown error'
                }</pre>
                <div class="mt-3 p-2 bg-white rounded border border-red-200 overflow-auto">
                  <code class="text-xs">${chart.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
                </div>
              </div>
            `;
          }
        }
      }
    };
    
    renderDiagram();
  }, [chart]);
  
  return (
    <div 
      ref={containerRef} 
      className={`w-full overflow-auto ${className}`}
      data-testid="mermaid-container"
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

/**
 * Simplify a complex Mermaid diagram to improve rendering success
 */
function simplifyDiagram(diagram: string): string {
  // Extract just the basic structure without styling
  const lines = diagram.split('\n');
  const simplifiedLines = lines.filter(line => {
    // Keep only the core structure lines (nodes and connections)
    return !line.includes('style ') && 
           !line.includes('classDef ') && 
           !line.includes('class ') &&
           line.trim() !== '';
  });
  
  // If it's a graph, ensure it has the right format
  let simplified = simplifiedLines.join('\n').trim();
  
  // If the diagram doesn't start with a valid diagram type, add one
  if (!simplified.startsWith('graph') && 
      !simplified.startsWith('flowchart') && 
      !simplified.startsWith('sequenceDiagram')) {
    simplified = 'graph TD\n' + simplified;
  }
  
  return simplified;
}
