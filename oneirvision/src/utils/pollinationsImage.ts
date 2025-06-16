// Pollinations.ai image generation utility
// No API key required - unlimited free generation

interface PollinationsOptions {
  width?: number;
  height?: number;
  seed?: number;
  model?: 'flux' | 'flux-realism' | 'flux-anime' | 'flux-3d';
  enhance?: boolean;
  nologo?: boolean;
}

export const generatePollinationsImage = async (
  prompt: string, 
  options: PollinationsOptions = {}
): Promise<string> => {
  const {
    width = 1024,
    height = 1024,
    seed,
    model = 'flux',
    enhance = true,
    nologo = true
  } = options;

  // Clean and encode the prompt
  const cleanPrompt = prompt
    .replace(/[^\w\s,.-]/g, '') // Remove special characters except basic punctuation
    .trim()
    .replace(/\s+/g, ' '); // Normalize whitespace

  const encodedPrompt = encodeURIComponent(cleanPrompt);
  
  // Build URL with parameters
  const params = new URLSearchParams();
  params.append('width', width.toString());
  params.append('height', height.toString());
  params.append('model', model);
  
  if (seed !== undefined) {
    params.append('seed', seed.toString());
  }
  
  if (enhance) {
    params.append('enhance', 'true');
  }
  
  if (nologo) {
    params.append('nologo', 'true');
  }

  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
  
  // Test if the image loads successfully
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Convert to base64 for consistent handling
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageUrl); // Fallback to direct URL
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const base64 = canvas.toDataURL('image/jpeg', 0.9);
        resolve(base64);
      } catch (error) {
        // If canvas conversion fails, use direct URL
        resolve(imageUrl);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image from Pollinations.ai'));
    };
    
    // Add timestamp to prevent caching issues
    const timestampedUrl = `${imageUrl}&t=${Date.now()}`;
    img.src = timestampedUrl;
  });
};

// Hook for React components (similar to usePollinationsImage)
export const usePollinationsImage = (
  prompt: string, 
  options: PollinationsOptions = {}
) => {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!prompt.trim()) {
      setImageUrl(null);
      return;
    }

    setLoading(true);
    setError(null);

    generatePollinationsImage(prompt, options)
      .then(url => {
        setImageUrl(url);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [prompt, JSON.stringify(options)]);

  return { imageUrl, loading, error };
};

// React import for the hook
import React from 'react';