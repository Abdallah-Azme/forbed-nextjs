import Image, { ImageProps } from "next/image";
import React from "react";

export default function ImageFallback({ ...props }: ImageProps) {
  return <Image {...props} />;
}
