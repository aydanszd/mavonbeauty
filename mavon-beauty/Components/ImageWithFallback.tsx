"use client"
import React, { useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

const defaultSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='20'>No Image</text></svg>`;
const defaultFallback = `data:image/svg+xml;utf8,${encodeURIComponent(defaultSvg)}`;

export default function ImageWithFallback({ src, fallback, alt = "", ...rest }: Props) {
  const [current, setCurrent] = useState<string | undefined>(typeof src === "string" ? src : undefined);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current || fallback || defaultFallback}
      alt={alt}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (target.src !== (fallback || defaultFallback)) target.src = fallback || defaultFallback;
      }}
      {...rest}
    />
  );
}
