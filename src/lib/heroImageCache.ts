// Simple image cache for hero images
class HeroImageCache {
  private cache = new Map<string, string>();

  async getImage(url: string): Promise<string> {
    // Return cached version if available
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    try {
      // Fetch and cache the image
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      this.cache.set(url, objectUrl);
      return objectUrl;
    } catch (error) {
      console.warn('Failed to cache hero image:', url, error);
      return url; // Fallback to original URL
    }
  }

  preloadImages(urls: string[]) {
    urls.forEach(url => {
      if (!this.cache.has(url)) {
        this.getImage(url).catch(() => {}); // Silently fail
      }
    });
  }
}

export const heroImageCache = new HeroImageCache();