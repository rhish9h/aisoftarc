/**
 * Type definitions for architecture-related data structures
 * Aligned with backend API schemas
 */

export type ProjectType = 'web' | 'mobile' | 'desktop' | 'microservices' | 'backend';

/**
 * Request schema for generating architecture
 * Maps to backend ArchitectureRequest schema
 */
export interface ArchitectureRequest {
  prompt: string;                          // Main requirements/prompt for the architecture
  project_type: ProjectType;               // Type of project
  constraints: string[];                   // Optional constraints as array of strings
  // Frontend-only fields for extended functionality
  includeSecurityConsiderations?: boolean; // Whether to include security considerations
  generateDeploymentDiagram?: boolean;     // Whether to generate deployment diagram
}

/**
 * Response schema from architecture generation
 * Maps to backend ArchitectureResponse schema with frontend extensions
 */
export interface ArchitectureResponse {
  id: string;                              // Unique identifier (frontend generated if not from backend)
  architecture_diagram: string;            // Mermaid.js diagram code
  description: string;                     // Description of the architecture
  recommendations: string[];               // List of recommendations
  // Frontend extensions for richer UI
  components?: Component[];                // Components in the architecture (parsed from description if needed)
  implementationSteps?: ImplementationStep[]; // Implementation steps (parsed from recommendations if needed)
  timestamp: string;                       // When the architecture was generated
}

/**
 * Component details for UI display
 */
export interface Component {
  name: string;
  description: string;
  technologies: string[];
}

/**
 * Implementation step for UI display
 */
export interface ImplementationStep {
  order: number;
  title: string;
  description: string;
}

/**
 * History item for displaying past generations
 */
export interface ArchitectureHistory {
  id: string;
  project_type: ProjectType;
  description: string;
  timestamp: string;
}
