import React from 'react';
import { Text, Button } from '@mantine/core';
import { ArchitectureHistory } from '../../types/architecture';
import { formatDistanceToNow } from 'date-fns';

interface HistoryPanelProps {
  history: ArchitectureHistory[];
  onSelect: (id: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

/**
 * Formats a timestamp to a relative time string using date-fns
 */
function formatRelativeTime(timestamp: string): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
  onClear,
  disabled = false
}) => {
  if (history.length === 0) {
    return (
      <div className="mt-8 pt-6 border-t border-secondary-100">
        <Text size="sm" fw={600} className="text-secondary-800 mb-4">Iteration History</Text>
        <div className="bg-secondary-50 rounded-lg p-4 text-center">
          <Text size="sm" c="dimmed">No history yet. Generate your first architecture to see it here.</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-secondary-100">
      <div className="flex justify-between items-center mb-4">
        <Text size="sm" fw={600} className="text-secondary-800">Iteration History</Text>
        <Button 
          variant="subtle" 
          size="xs" 
          color="blue" 
          onClick={onClear}
          disabled={disabled}
          className="text-primary-600 hover:text-primary-700"
        >
          Clear All
        </Button>
      </div>
      <div className="bg-secondary-50 rounded-lg divide-y divide-secondary-200 text-sm">
        {history.map((item) => (
          <div 
            key={item.id}
            className={`p-3 hover:bg-secondary-100 cursor-pointer transition-colors flex justify-between items-center ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => !disabled && onSelect(item.id)}
          >
            <div>
              <div className="font-medium text-secondary-800">
                {item.project_type.charAt(0).toUpperCase() + item.project_type.slice(1)} - {item.description}
              </div>
              <div className="text-xs text-secondary-500">
                {formatRelativeTime(item.timestamp)}
              </div>
            </div>
            <svg className="h-4 w-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};
