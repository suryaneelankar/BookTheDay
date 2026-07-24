import React from 'react';
import FastImage from 'react-native-fast-image';

/**
 * Cached image wrapper with immutable cache control.
 * Use for venue images that rarely change.
 * Falls back gracefully if uri is undefined.
 */
const CachedImage = ({uri, style, resizeMode = FastImage.resizeMode.cover, ...props}) => {
  if (!uri) return null;

  return (
    <FastImage
      source={{
        uri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      style={style}
      resizeMode={resizeMode}
      {...props}
    />
  );
};

export default CachedImage;
