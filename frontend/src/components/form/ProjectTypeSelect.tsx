import React from 'react';
import { Select, SelectProps } from '@mantine/core';
import { ProjectType } from '../../types/architecture';

interface ProjectTypeSelectProps extends Omit<SelectProps, 'data' | 'onChange'> {
  value: ProjectType;
  onChange: (value: ProjectType) => void;
}

export const PROJECT_TYPE_OPTIONS = [
  { value: 'web', label: 'Web Application' },
  { value: 'mobile', label: 'Mobile Application' },
  { value: 'desktop', label: 'Desktop Application' },
  { value: 'microservices', label: 'Microservices' },
  { value: 'backend', label: 'Backend Service' },
];

export const ProjectTypeSelect: React.FC<ProjectTypeSelectProps> = ({ 
  value, 
  onChange, 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="projectType"
        className="block text-sm font-medium text-secondary-700"
      >
        Project Type
      </label>
      <Select
        id="projectType"
        data={PROJECT_TYPE_OPTIONS}
        value={value}
        onChange={(val) => onChange(val as ProjectType)}
        classNames={{
          input: "border border-secondary-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white shadow-sm",
          dropdown: "bg-white border border-secondary-200 shadow-lg rounded-lg mt-1",
          option: "hover:bg-secondary-50"
        }}
        {...props}
      />
    </div>
  );
};
