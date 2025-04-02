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
   */
  generateArchitecture: async (request: ArchitectureRequest): Promise<ArchitectureResponse> => {
    try {
      const response = await apiClient.post<ArchitectureResponse>('/architecture/generate', request);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate architecture: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Get a previous architecture by ID
   */
  getArchitecture: async (id: string): Promise<ArchitectureResponse> => {
    try {
      const response = await apiClient.get<ArchitectureResponse>(`/architecture/${id}`);
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
   */
  getHistory: async (): Promise<ArchitectureResponse[]> => {
    try {
      const response = await apiClient.get<ArchitectureResponse[]>('/architecture/history');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve history: ${error.message}`);
      }
      throw error;
    }
  }
};
