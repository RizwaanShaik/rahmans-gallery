/**
 * Utilities for handling image operations
 */

/**
 * Check if an image exists at the given URL
 * @param url The URL to check
 * @returns Promise that resolves to true if image exists, false otherwise
 */
export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    console.log('Checking if image exists at:', url);
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit',
    });
    
    const exists = response.ok;
    console.log(`Image ${exists ? 'exists' : 'does not exist'} at ${url}`);
    return exists;
  } catch (error) {
    console.error('Error checking image existence:', error);
    return false;
  }
};

/**
 * Add watermark to an image using Canvas API
 * @param imageUrl The image URL or blob URL
 * @param watermarkText The text to add as watermark
 * @returns Promise that resolves to a blob URL of the watermarked image
 */
export const addWatermarkToImage = async (
  imageUrl: string,
  watermarkText: string = "Prof. Rahman's Gallery"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Important for CORS images
    
    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Calculate proportional font size based on image dimensions
        // Use the smaller dimension to ensure watermark scales appropriately
        const minDimension = Math.min(img.width, img.height);
        // Font size: 3.5% of the smaller dimension, with reasonable min/max bounds (increased from 2.5%)
        const fontSize = Math.max(Math.min(minDimension * 0.035, 60), 18);
        
        // Set watermark style with better font
        // Using Georgia (serif) for elegance, with fallbacks
        ctx.font = `bold ${fontSize}px Georgia, "Times New Roman", serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // White with 90% opacity for better visibility
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)'; // Darker outline for better contrast
        ctx.lineWidth = Math.max(fontSize * 0.1, 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        
        // Calculate text position (bottom right with proportional padding)
        // Padding: 2.5% of the smaller dimension (slightly increased)
        const padding = Math.max(minDimension * 0.025, 12);
        const x = canvas.width - padding;
        const y = canvas.height - padding;
        
        // Draw text with outline for better visibility
        ctx.strokeText(watermarkText, x, y);
        ctx.fillText(watermarkText, x, y);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            resolve(blobUrl);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/jpeg', 0.95); // High quality JPEG
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for watermarking'));
    };
    
    img.src = imageUrl;
  });
};

/**
 * Fetch an image from S3 and trigger download with optional watermark
 * @param url The S3 URL to fetch
 * @param filename Optional filename for the download
 * @param addWatermark Whether to add watermark (default: true)
 * @param watermarkText Optional custom watermark text
 */
export const downloadS3Image = async (
  url: string,
  filename?: string,
  addWatermark: boolean = true,
  watermarkText: string = "Prof. Rahman's Gallery"
): Promise<boolean> => {
  try {
    console.log('Attempting to download image from (initial URL):', url);

    // Add cache-busting timestamp
    const urlWithTimestamp = url.includes('?')
      ? `${url}&t=${Date.now()}`
      : `${url}?t=${Date.now()}`;
      
    // Ensure timestamp is only added once
    const finalUrl = url.includes('?') ? url : urlWithTimestamp; 

    console.log('>>> Attempting direct fetch (GET) for URL:', finalUrl);

    // Fetch the image
    const response = await fetch(finalUrl, {
      method: 'GET',
      credentials: 'omit',
      headers: {
        'Cache-Control': 'no-cache',
      },
      mode: 'cors',
    });
    
    if (!response.ok) {
      console.error('>>> Failed to fetch image (GET request):', response.status, response.statusText, 'URL:', finalUrl);
      return false;
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    console.log('Successfully fetched image blob:', blob.type, blob.size);
    
    let downloadUrl: string;
    let downloadFilename = filename || decodeURIComponent(url.split('/').pop()?.split('?')[0] || 'download');
    
    if (addWatermark) {
      try {
        // Create blob URL for watermarking
        const blobUrl = URL.createObjectURL(blob);
        
        // Add watermark
        const watermarkedBlobUrl = await addWatermarkToImage(blobUrl, watermarkText);
        
        // Revoke the original blob URL
        URL.revokeObjectURL(blobUrl);
        
        downloadUrl = watermarkedBlobUrl;
        
        // Keep original filename (don't add _watermarked suffix)
        console.log('Watermark added successfully');
      } catch (watermarkError) {
        console.warn('Failed to add watermark, downloading original:', watermarkError);
        // Fallback to original image if watermarking fails
        downloadUrl = URL.createObjectURL(blob);
      }
    } else {
      downloadUrl = URL.createObjectURL(blob);
    }
    
    // Create download link and trigger download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    console.log('Download initiated for:', a.download);
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error downloading image:', error);
    return false;
  }
};

/**
 * Creates a properly formatted S3 image URL
 * @param path The image path
 * @param addTimestamp Whether to add a timestamp parameter
 */
export const formatS3ImageUrl = (path: string, addTimestamp = true): string => {
  if (!path) return '';
  
  // Add timestamp for cache busting if requested
  if (addTimestamp) {
    const timestamp = Date.now();
    return path.includes('?') ? `${path}&t=${timestamp}` : `${path}?t=${timestamp}`;
  }
  
  return path;
};
