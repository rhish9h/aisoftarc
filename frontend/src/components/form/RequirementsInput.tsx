import React, { useState } from 'react';
import { Textarea, TextareaProps } from '@mantine/core';
import ErrorBoundary from '../ui/ErrorBoundary';

interface RequirementsInputProps extends Omit<TextareaProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

// Fallback component if Mantine Textarea fails
const TextareaFallback: React.FC<RequirementsInputProps> = ({ value, onChange, ...props }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-secondary-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white shadow-sm"
      rows={5}
      placeholder={props.placeholder}
    />
  );
};

export const RequirementsInput: React.FC<RequirementsInputProps> = ({ 
  value, 
  onChange, 
  ...props 
}) => {
  const [useNativeTextarea, setUseNativeTextarea] = useState(false);

  // Custom fallback UI for Textarea errors
  const textareaFallback = (
    <div>
      <TextareaFallback 
        value={value}
        onChange={onChange}
        {...props}
      />
      <div className="mt-1 text-xs text-secondary-400 text-right">
        Using fallback textarea
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      <label
        htmlFor="prompt"
        className="block text-sm font-medium text-secondary-700"
      >
        Software Requirements
      </label>
      <div className="relative">
        <ErrorBoundary fallback={textareaFallback}>
          {!useNativeTextarea ? (
            <Textarea
              id="prompt"
              placeholder="Describe the system you want to build..."
              minRows={5}
              value={value}
              onChange={(e) => {
                try {
                  onChange(e.currentTarget.value);
                } catch (error) {
                  console.error("Error in Textarea:", error);
                  setUseNativeTextarea(true);
                }
              }}
              className="w-full"
              classNames={{
                input: "border border-secondary-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white shadow-sm"
              }}
              {...props}
            />
          ) : (
            <TextareaFallback 
              value={value}
              onChange={onChange}
              {...props}
            />
          )}
        </ErrorBoundary>
        <div className="absolute bottom-3 right-3 text-xs text-secondary-400">
          Be specific for better results
        </div>
      </div>
    </div>
  );
};
