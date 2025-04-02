import { ArchitectureRequest, ArchitectureResponse } from '../../types/architecture';
import { apiClient } from './apiClient';

/**
 * Architecture Service 
 * 
 * Implements clean architecture principles:
 * - Single responsibility for architecture-related API calls
 * - Consistent error handling 
 * - Domain-specific error messages
 */
export const architectureService = {
  /**
   * Generate a new architecture based on requirements
   * Maps to backend /api/v1/generate_architecture endpoint
   */
  generateArchitecture: async (request: ArchitectureRequest): Promise<ArchitectureResponse> => {
    try {
      // Prepare request to match backend API expectations
      const apiRequest = {
        prompt: request.prompt,
        project_type: request.project_type,
        constraints: request.constraints || []
      };
      
      const response = await apiClient.post<ArchitectureResponse>('/api/v1/generate_architecture', apiRequest);
      
      // Transform response to match frontend expectations if needed
      const result: ArchitectureResponse = {
        id: `arch-${Date.now()}`, // Generate ID if not provided by backend
        architecture_diagram: response.data.architecture_diagram,
        description: response.data.description,
        recommendations: response.data.recommendations,
        // Parse components from description if not provided by backend
        components: extractComponentsFromDescription(response.data.description),
        // Create implementation steps from recommendations if not provided
        implementationSteps: createImplementationStepsFromRecommendations(response.data.recommendations),
        timestamp: new Date().toISOString()
      };
      
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate architecture: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Get a previous architecture by ID
   * Note: This endpoint may need to be implemented on the backend
   */
  getArchitecture: async (id: string): Promise<ArchitectureResponse> => {
    try {
      // This endpoint might need to be adjusted based on actual backend implementation
      const response = await apiClient.get<ArchitectureResponse>(`/api/v1/architecture/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve architecture: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Get history of generated architectures
   * Note: This endpoint may need to be implemented on the backend
   */
  getHistory: async (): Promise<ArchitectureResponse[]> => {
    try {
      // This endpoint might need to be adjusted based on actual backend implementation
      const response = await apiClient.get<ArchitectureResponse[]>('/api/v1/architecture/history');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve history: ${error.message}`);
      }
      throw error;
    }
  }
};

/**
 * Helper function to extract components from architecture description
 */
function extractComponentsFromDescription(description: string): { name: string; description: string; technologies: string[] }[] {
  // Simple extraction logic - in a real app, this would be more sophisticated
  // or the backend would provide structured component data
  const components = [];
  
  // Extract component names using regex (this is a simplified example)
  const componentMatches = description.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+(?:component|service|module)/gi);
  
  if (componentMatches) {
    componentMatches.forEach((match) => {
      const name = match.replace(/\s+(?:component|service|module)/i, '').trim();
      components.push({
        name,
        description: `Component extracted from architecture description.`,
        technologies: ['Extracted from description']
      });
    });
  }
  
  // If no components were found, create a default component
  if (components.length === 0) {
    components.push({
      name: 'Main Component',
      description: 'Primary system component',
      technologies: ['Extracted from description']
    });
  }
  
  return components;
}

/**
 * Helper function to create implementation steps from recommendations
 */
function createImplementationStepsFromRecommendations(recommendations: string[]): { order: number; title: string; description: string }[] {
  return recommendations.map((recommendation, index) => ({
    order: index + 1,
    title: `Step ${index + 1}`,
    description: recommendation
  }));
}
