"use client";

import Image, { ImageProps } from "next/image";
import React, { useState } from "react";

export default function ImageFallback(props: ImageProps) {
  const fallbackSrc = "/fallback.webp";
  const [imgSrc, setImgSrc] = useState(props.src);

  return (
    <Image {...props} src={imgSrc} onError={() => setImgSrc(fallbackSrc)} />
  );
}
