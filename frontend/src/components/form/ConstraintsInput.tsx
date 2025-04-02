import React, { useState } from 'react';
import { Textarea, TextareaProps } from '@mantine/core';
import ErrorBoundary from '../ui/ErrorBoundary';

interface ConstraintsInputProps extends Omit<TextareaProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

// Fallback component if Mantine Textarea fails
const TextareaFallback: React.FC<ConstraintsInputProps> = ({ value, onChange, ...props }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-secondary-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white shadow-sm"
      rows={3}
      placeholder={props.placeholder}
    />
  );
};

export const ConstraintsInput: React.FC<ConstraintsInputProps> = ({ 
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
        htmlFor="constraints"
        className="block text-sm font-medium text-secondary-700"
      >
        <span>Constraints</span>
        <span className="text-xs font-normal text-secondary-500 ml-2">(Optional)</span>
      </label>
      <div className="relative">
        <ErrorBoundary fallback={textareaFallback}>
          {!useNativeTextarea ? (
            <Textarea
              id="constraints"
              placeholder="E.g. regulatory requirements, budget limits, tech stack preferences..."
              minRows={3}
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
      </div>
    </div>
  );
};
