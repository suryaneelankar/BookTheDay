// CloseIcon.tsx
import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const CloseIcon = ({ size = 24, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
    <Path
      d="M16.9976 6.84766L6.80176 17.0435"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Path
      d="M7.25293 6.30027L17.4488 16.4961"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </Svg>
);
