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
  const generateArchitecture = useCallback(async (formData: {
    requirements: string;
    projectType: string;
    constraints: string;
    includeSecurityConsiderations: boolean;
    generateDeploymentDiagram: boolean;
  }) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Transform form data to match the API request structure
      const request: ArchitectureRequest = {
        prompt: formData.requirements,
        project_type: formData.projectType as any, // Type assertion for simplicity
        constraints: formData.constraints ? formData.constraints.split('\n').filter(line => line.trim()) : [],
        includeSecurityConsiderations: formData.includeSecurityConsiderations,
        generateDeploymentDiagram: formData.generateDeploymentDiagram
      };
      
      // Call the service to generate architecture
      const result = await architectureService.generateArchitecture(request);
      setCurrentResult(result);
      
      // Add to history
      const historyItem: ArchitectureHistory = {
        id: result.id,
        project_type: request.project_type,
        description: request.prompt.substring(0, 50) + (request.prompt.length > 50 ? '...' : ''),
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
      if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
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
