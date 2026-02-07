"use client";

import { useState, useEffect } from 'react';

const CACHE_KEY_PREFIX = 'wiki_img_';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function useWikiImage(src) {
  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    // Only process Wikimedia Special:FilePath URLs
    if (!src || !src.includes('commons.wikimedia.org/wiki/Special:FilePath/')) {
      return;
    }

    const filename = src.split('Special:FilePath/')[1];
    if (!filename) return;

    const cacheKey = `${CACHE_KEY_PREFIX}${filename}`;
    const now = Date.now();

    // 1. Check Cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { url, timestamp } = JSON.parse(cached);
        if (now - timestamp < CACHE_TTL) {
          setResolvedSrc(url);
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }

    // 2. Fetch if not cached or expired
    const fetchImage = async () => {
      try {
        // Use &redirects to handle internal redirects (e.g. moved files)
        const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(decodeURIComponent(filename))}&prop=imageinfo&iiprop=url&redirects&format=json&origin=*`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        const pages = data.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1') {
            const url = pages[pageId]?.imageinfo?.[0]?.url;
            if (url) {
              setResolvedSrc(url);
              // 3. Set Cache
              try {
                localStorage.setItem(cacheKey, JSON.stringify({ url, timestamp: now }));
              } catch (e) {
                console.warn('Error writing to localStorage', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching Wikimedia image:', error);
      }
    };

    fetchImage();
  }, [src]);

  return resolvedSrc;
}
