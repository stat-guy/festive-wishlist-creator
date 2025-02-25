const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const { fal } = require('@fal-ai/client');
const https = require('https');

// Configure fal.ai client with your API key
fal.config({
  credentials: "3eaba188-7132-4f0c-b43c-256f96dbef61:2fb3c066d7665fe10e18d670599c9765"
});

// Define the images we need to generate
const images = [
  {
    name: "christmas-bg.jpg",
    prompt: "A glossy festive Christmas background with rich reds and greens, ornaments, snow, and subtle light effects. High resolution, rich colors, professional lighting, festive mood",
    negative_prompt: "blurry, text, logo, watermark, distracting elements",
    width: 1024,
    height: 768,
    model: "tencent/hunyuan-video"
  },
  {
    name: "holly-decoration.png",
    prompt: "Holly leaves and red berries, festive Christmas decoration, isolated on transparent background, high detail botanical illustration",
    negative_prompt: "background, text, blurry",
    width: 768,
    height: 768,
    model: "tencent/hunyuan-video",
    transparent: true
  },
  {
    name: "ornament-decoration.png",
    prompt: "A beautiful Christmas ornament ball in red and gold with intricate patterns, hanging from a golden thread, isolated on transparent background",
    negative_prompt: "background, text, blurry, people",
    width: 768,
    height: 768,
    model: "tencent/hunyuan-video",
    transparent: true
  },
  {
    name: "holly-small.png",
    prompt: "Small holly leaves with red berries corner decoration, festive Christmas element, isolated on transparent background",
    negative_prompt: "background, text, blurry",
    width: 512,
    height: 512,
    model: "tencent/hunyuan-video",
    transparent: true
  },
  {
    name: "ornament-small.png",
    prompt: "Small Christmas ornament ball in red and gold with delicate patterns, isolated on transparent background",
    negative_prompt: "background, text, blurry, people",
    width: 512, 
    height: 512,
    model: "tencent/hunyuan-video",
    transparent: true
  },
  {
    name: "snowflake1.png",
    prompt: "Intricate snowflake crystal, white, isolated on transparent background, highly detailed",
    negative_prompt: "background, color, text",
    width: 256,
    height: 256,
    model: "tencent/hunyuan-video",
    transparent: true
  },
  {
    name: "snowflake2.png",
    prompt: "Unique snowflake pattern, white crystal, isolated on transparent background, highly detailed",
    negative_prompt: "background, color, text",
    width: 256,
    height: 256,
    model: "tencent/hunyuan-video",
    transparent: true
  },
  {
    name: "snowflake3.png",
    prompt: "Delicate intricate snowflake design, white, isolated on transparent background, highly detailed",
    negative_prompt: "background, color, text",
    width: 256,
    height: 256,
    model: "tencent/hunyuan-video",
    transparent: true
  }
];

// Function to download an image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(filepath);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
        console.log(`Downloaded: ${filepath}`);
      });
    }).on('error', err => {
      fs.unlink(filepath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
};

// Generate an image using fal.ai SDK
const generateImage = async (imageConfig) => {
  const outputPath = path.join(__dirname, '..', 'public', imageConfig.name);
  
  console.log(`Generating ${imageConfig.name}...`);
  
  try {
    // Prepare input for hunyuan-video model
    const input = {
      prompt: imageConfig.prompt,
      video_length: 1, // Generate a single image
      fps: 1,
      width: imageConfig.width,
      height: imageConfig.height,
      guidance_scale: 7
    };
    
    // Add transparent background parameters if needed
    if (imageConfig.transparent) {
      input.prompt += ", isolated on completely transparent background";
    }
    
    // Submit the request to queue
    console.log(`Submitting request for ${imageConfig.name}...`);
    const { request_id } = await fal.queue.submit(imageConfig.model, {
      input,
    });
    
    console.log(`Request submitted for ${imageConfig.name}, ID: ${request_id}`);
    
    // Poll for the result
    let result = null;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes maximum wait time (at 5 second intervals)
    
    while (!result && attempts < maxAttempts) {
      attempts++;
      
      try {
        console.log(`Checking status for ${imageConfig.name} (attempt ${attempts})...`);
        
        // Check the status
        const status = await fal.queue.status(imageConfig.model, {
          requestId: request_id,
          logs: true,
        });
        
        console.log(`Status for ${imageConfig.name}: ${status.status}`);
        
        if (status.status === 'COMPLETED') {
          // Get the result
          result = await fal.queue.result(imageConfig.model, {
            requestId: request_id
          });
          break;
        } else if (status.status === 'FAILED') {
          throw new Error(`Request failed: ${JSON.stringify(status.error)}`);
        }
      } catch (statusError) {
        if (statusError.message.includes('NOT_FOUND') && attempts < 3) {
          // It's possible the job is not in the queue yet, continue
          console.log(`Request not found yet for ${imageConfig.name}, retrying...`);
        } else {
          throw statusError;
        }
      }
      
      // Wait 5 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    if (!result) {
      throw new Error(`Timed out waiting for ${imageConfig.name} after ${maxAttempts} attempts`);
    }
    
    if (result && result.video_frames && result.video_frames.length > 0) {
      // Get the first frame from the video
      const imageUrl = result.video_frames[0];
      console.log(`Got image URL for ${imageConfig.name}: ${imageUrl}`);
      await downloadImage(imageUrl, outputPath);
      return true;
    } else if (result && result.images && result.images.length > 0) {
      // Fallback for regular image output format
      const imageUrl = result.images[0].url || result.images[0];
      console.log(`Got image URL for ${imageConfig.name}: ${imageUrl}`);
      await downloadImage(imageUrl, outputPath);
      return true;
    } else {
      console.error(`No images or video frames found in response for ${imageConfig.name}`);
      console.log(`Response structure: ${JSON.stringify(result)}`);
      return false;
    }
  } catch (error) {
    console.error(`Error generating ${imageConfig.name}:`, error.message);
    return false;
  }
};

// Fallback placeholder images URLs
const placeholderImages = [
  {
    name: "christmas-bg.jpg",
    url: "https://source.unsplash.com/1920x1080/?christmas,winter,festive"
  },
  {
    name: "holly-decoration.png", 
    url: "https://placehold.co/800x800/red/white?text=Holly+Decoration"
  },
  {
    name: "ornament-decoration.png",
    url: "https://placehold.co/800x800/green/white?text=Christmas+Ornament"
  },
  {
    name: "holly-small.png",
    url: "https://placehold.co/400x400/red/white?text=Small+Holly"
  },
  {
    name: "ornament-small.png",
    url: "https://placehold.co/400x400/green/white?text=Small+Ornament"
  },
  {
    name: "snowflake1.png",
    url: "https://placehold.co/200x200/white/blue?text=❄️"
  },
  {
    name: "snowflake2.png",
    url: "https://placehold.co/200x200/white/blue?text=❄"
  },
  {
    name: "snowflake3.png",
    url: "https://placehold.co/200x200/white/blue?text=*"
  }
];

// Download placeholder image
const downloadPlaceholder = async (imageConfig) => {
  const placeholder = placeholderImages.find(img => img.name === imageConfig.name);
  if (!placeholder) return false;
  
  const outputPath = path.join(__dirname, '..', 'public', imageConfig.name);
  console.log(`Downloading placeholder for ${imageConfig.name}...`);
  
  try {
    await downloadImage(placeholder.url, outputPath);
    return true;
  } catch (error) {
    console.error(`Error downloading placeholder for ${imageConfig.name}:`, error.message);
    return false;
  }
};

// Main function to generate all images
const generateAllImages = async () => {
  console.log("Starting to generate festive images...");
  
  let successCount = 0;
  let failCount = 0;
  
  for (const image of images) {
    console.log(`Processing: ${image.name}`);
    
    try {
      const success = await generateImage(image);
      
      if (success) {
        successCount++;
        console.log(`Successfully generated ${image.name}`);
      } else {
        console.log(`Failed to generate ${image.name}, trying placeholder...`);
        const placeholderSuccess = await downloadPlaceholder(image);
        
        if (placeholderSuccess) {
          console.log(`Used placeholder for ${image.name}`);
        } else {
          console.error(`Failed to get placeholder for ${image.name}`);
          failCount++;
        }
      }
    } catch (error) {
      console.error(`Error processing ${image.name}:`, error.message);
      console.log(`Trying placeholder for ${image.name}...`);
      
      const placeholderSuccess = await downloadPlaceholder(image);
      if (placeholderSuccess) {
        console.log(`Used placeholder for ${image.name}`);
      } else {
        console.error(`Failed to get placeholder for ${image.name}`);
        failCount++;
      }
    }
    
    // Add a small delay between requests to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`Image generation complete: ${successCount} generated, ${failCount} failed.`);
  
  if (successCount > 0) {
    console.log("Successfully generated some festive images!");
  } else {
    console.log("Couldn't generate images from fal.ai, using placeholders instead.");
  }
};

// Run the main function
generateAllImages().catch(error => {
  console.error("An error occurred:", error);
});