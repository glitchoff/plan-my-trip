"use client";

import Image from "next/image";
import { useWikiImage } from "../hooks/useWikiImage";

export default function WikiImage({ src, alt, ...props }) {
  const resolvedSrc = useWikiImage(src);

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      {...props}
    />
  );
}
