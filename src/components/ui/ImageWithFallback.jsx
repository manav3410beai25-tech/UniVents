import { useState } from 'react';

export function ImageWithFallback({ src, fallbackSrc, alt, ...props }) {
  const [failedSource, setFailedSource] = useState(null);

  const imageSource = failedSource === src ? fallbackSrc : (src || fallbackSrc);

  return (
    <img
      {...props}
      src={imageSource}
      alt={alt}
      onError={() => {
        if (imageSource !== fallbackSrc) setFailedSource(src);
      }}
    />
  );
}
