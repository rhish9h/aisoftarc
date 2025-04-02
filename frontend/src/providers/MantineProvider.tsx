import { MantineProvider as BaseMantineProvider, createTheme } from '@mantine/core';
import React from 'react';
import '@mantine/core/styles.css';

// Create a theme with your application's color scheme
const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    // These should match your tailwind primary colors as closely as possible
    blue: [
      '#EFF6FF', // 50
      '#DBEAFE', // 100
      '#BFDBFE', // 200
      '#93C5FD', // 300
      '#60A5FA', // 400
      '#3B82F6', // 500
      '#2563EB', // 600
      '#1D4ED8', // 700
      '#1E40AF', // 800
      '#1E3A8A', // 900
    ],
  },
});

interface MantineProviderProps {
  children: React.ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <BaseMantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </BaseMantineProvider>
  );
}
