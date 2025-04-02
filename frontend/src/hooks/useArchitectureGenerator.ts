import { useState, useCallback } from 'react';
import { ArchitectureRequest, ArchitectureResponse, ArchitectureHistory } from '../types/architecture';
import { architectureService } from '../services/api/architectureService';

/**
 * Custom hook that manages architecture generation with complete separation of concerns
 * 
 * Clean Architecture benefits:
 * - UI components remain pure and focused on presentation
 * - Business logic is centralized in this hook
 * - Data fetching is delegated to the service layer
 * - State management is encapsulated and reusable
 */
export const useArchitectureGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<ArchitectureResponse | null>(null);
  const [history, setHistory] = useState<ArchitectureHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate architecture based on the provided request
   * Uses the architecture service for API communication
   */
  const generateArchitecture = useCallback(async (request: ArchitectureRequest) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // In development mode, we might want to mock the API call for faster testing
      let result: ArchitectureResponse;
      
      if (process.env.NODE_ENV === 'development' && import.meta.env.VITE_USE_MOCK_API === 'true') {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = createMockResult(request);
      } else {
        // Real API call
        result = await architectureService.generateArchitecture(request);
      }
      
      setCurrentResult(result);
      
      // Add to history
      const historyItem: ArchitectureHistory = {
        id: result.id,
        projectType: request.projectType,
        description: request.requirements.substring(0, 50) + (request.requirements.length > 50 ? '...' : ''),
        timestamp: result.timestamp
      };
      
      setHistory(prev => [historyItem, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  /**
   * Load a previous architecture result from history
   */
  const loadFromHistory = useCallback(async (id: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // In development we might want to mock the API
      if (process.env.NODE_ENV === 'development' && import.meta.env.VITE_USE_MOCK_API === 'true') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In a real app we would fetch the result from the API
        setCurrentResult(prev => prev && prev.id === id ? prev : null);
      } else {
        const result = await architectureService.getArchitecture(id);
        setCurrentResult(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);
  
  return {
    isGenerating,
    currentResult,
    history,
    error,
    generateArchitecture,
    loadFromHistory,
    clearHistory
  };
};

/**
 * Create a mock architecture result for development
 */
function createMockResult(request: ArchitectureRequest): ArchitectureResponse {
  return {
    id: `arch-${Date.now()}`,
    diagram: `graph TD
      A[Client] --> B[API Gateway]
      B --> C[Auth Service]
      B --> D[Core Service]
      D --> E[Database]`,
    description: `This architecture follows a ${request.projectType} approach with separation of concerns. It's designed to meet the requirements: "${request.requirements.substring(0, 100)}..."`,
    components: [
      {
        name: "API Gateway",
        description: "Handles routing and request validation",
        technologies: ["Express", "Node.js"]
      },
      {
        name: "Auth Service",
        description: "Manages authentication and authorization",
        technologies: ["JWT", "OAuth 2.0"]
      },
      {
        name: "Core Service",
        description: "Implements the main business logic",
        technologies: ["Node.js", "MongoDB"]
      }
    ],
    recommendations: [
      "Consider implementing a caching layer for improved performance",
      "Use containerization for consistent deployment across environments",
      "Implement comprehensive logging and monitoring"
    ],
    implementationSteps: [
      {
        order: 1,
        title: "Set up the infrastructure",
        description: "Create the necessary cloud resources and CI/CD pipelines"
      },
      {
        order: 2,
        title: "Implement core services",
        description: "Start with the fundamental services that other components will depend on"
      },
      {
        order: 3,
        title: "Develop the API Gateway",
        description: "Create endpoints and validators for the API Gateway"
      }
    ],
    timestamp: new Date().toISOString()
  };
}
