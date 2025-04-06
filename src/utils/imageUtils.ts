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
 * Fetch an image from S3 and trigger download
 * @param url The S3 URL to fetch
 * @param filename Optional filename for the download
 */
export const downloadS3Image = async (url: string, filename?: string): Promise<boolean> => {
  try {
    console.log('Attempting to download image from (initial URL):', url); // Log initial URL

    // REMOVED checkImageExists call as HEAD requests were causing CORS issues.
    // We will now directly attempt the GET request.

    // Add cache-busting timestamp
    const urlWithTimestamp = url.includes('?')
      ? `${url}&t=${Date.now()}`
      : `${url}?t=${Date.now()}`;
      
    // Ensure timestamp is only added once
    const finalUrl = url.includes('?') ? url : urlWithTimestamp; 

    console.log('>>> Attempting direct fetch (GET) for URL:', finalUrl); // Log before fetch

    // Fetch the image
    const response = await fetch(finalUrl, { // Use finalUrl
      method: 'GET',
      // Don't include credentials for cross-origin requests to S3
      credentials: 'omit',
      headers: {
        'Cache-Control': 'no-cache',
      },
      // Important for CORS requests
      mode: 'cors',
    });
    if (!response.ok) {
      // Log the actual status code from the GET request
      console.error('>>> Failed to fetch image (GET request):', response.status, response.statusText, 'URL:', finalUrl); // Use finalUrl
      // NOTE: Could add retry logic with space encoding here if needed, but keeping it simple for now.
      return false;
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    console.log('Successfully fetched image blob:', blob.type, blob.size);
    
    // Create a blob URL and trigger download
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || decodeURIComponent(url.split('/').pop()?.split('?')[0] || 'download');
    document.body.appendChild(a);
    a.click();
    console.log('Download initiated for:', a.download);
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error downloading image:', error);
    // Catch fetch errors directly
    console.error('>>> Error during fetch/download:', error);
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
