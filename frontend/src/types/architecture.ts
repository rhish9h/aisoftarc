export type ProjectType = 'web' | 'mobile' | 'desktop' | 'microservices' | 'backend';

export interface ArchitectureRequest {
  requirements: string;
  projectType: ProjectType;
  constraints?: string;
  includeSecurityConsiderations?: boolean;
  generateDeploymentDiagram?: boolean;
}

export interface ArchitectureResponse {
  id: string;
  diagram: string; // Mermaid.js diagram code
  description: string;
  components: Component[];
  recommendations: string[];
  implementationSteps: ImplementationStep[];
  timestamp: string;
}

export interface Component {
  name: string;
  description: string;
  technologies: string[];
}

export interface ImplementationStep {
  order: number;
  title: string;
  description: string;
}

export interface ArchitectureHistory {
  id: string;
  projectType: ProjectType;
  description: string;
  timestamp: string;
}
