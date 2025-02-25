// This version uses fetch API instead of Node's https module
// It's more suitable for modern Node.js projects with Node.js 18+ or when using in a browser environment

const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

// For Node.js version that supports fetch natively (18+)
// If using an older version, you'll need to install node-fetch:
// npm install node-fetch
// and then uncomment the next line:
// const fetch = require('node-fetch');

// Replace with your fal.ai API key
const FAL_KEY = "YOUR_FAL_AI_API_KEY"; // You'll need to replace this

// Define the images we need to generate
const images = [
  {
    name: "christmas-bg.jpg",
    prompt: "A glossy festive Christmas background with rich reds and greens, ornaments, snow, and subtle light effects. High resolution, rich colors, professional lighting, festive mood",
    negative_prompt: "blurry, text, logo, watermark, distracting elements",
    width: 1920,
    height: 1080
  },
  {
    name: "holly-decoration.png",
    prompt: "Holly leaves and red berries, festive Christmas decoration, isolated on transparent background, high detail botanical illustration",
    negative_prompt: "background, text, blurry",
    width: 800,
    height: 800,
    transparent: true
  },
  {
    name: "ornament-decoration.png",
    prompt: "A beautiful Christmas ornament ball in red and gold with intricate patterns, hanging from a golden thread, isolated on transparent background",
    negative_prompt: "background, text, blurry, people",
    width: 800,
    height: 800,
    transparent: true
  },
  {
    name: "holly-small.png",
    prompt: "Small holly leaves with red berries corner decoration, festive Christmas element, isolated on transparent background",
    negative_prompt: "background, text, blurry",
    width: 400,
    height: 400,
    transparent: true
  },
  {
    name: "ornament-small.png",
    prompt: "Small Christmas ornament ball in red and gold with delicate patterns, isolated on transparent background",
    negative_prompt: "background, text, blurry, people",
    width: 400, 
    height: 400,
    transparent: true
  },
  {
    name: "snowflake1.png",
    prompt: "Intricate snowflake crystal, white, isolated on transparent background, highly detailed",
    negative_prompt: "background, color, text",
    width: 200,
    height: 200,
    transparent: true
  },
  {
    name: "snowflake2.png",
    prompt: "Unique snowflake pattern, white crystal, isolated on transparent background, highly detailed",
    negative_prompt: "background, color, text",
    width: 200,
    height: 200,
    transparent: true
  },
  {
    name: "snowflake3.png",
    prompt: "Delicate intricate snowflake design, white, isolated on transparent background, highly detailed",
    negative_prompt: "background, color, text",
    width: 200,
    height: 200,
    transparent: true
  }
];

// Function to download an image using fetch
const downloadImage = async (url, filepath) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const fileStream = createWriteStream(filepath);
    await pipeline(response.body, fileStream);
    console.log(`Downloaded: ${filepath}`);
    return true;
  } catch (error) {
    console.error(`Error downloading ${filepath}:`, error.message);
    return false;
  }
};

// Generate an image using fal.ai API
const generateImage = async (imageConfig) => {
  const outputPath = path.join(__dirname, '..', 'public', imageConfig.name);
  
  // Build the request payload
  const payload = {
    modelId: 'sd-turbo', // Using Stable Diffusion Turbo for speed
    input: {
      prompt: imageConfig.prompt,
      negative_prompt: imageConfig.negative_prompt,
      width: imageConfig.width,
      height: imageConfig.height,
      num_images: 1
    }
  };

  // For transparent images, use a model that supports transparency
  if (imageConfig.transparent) {
    payload.modelId = 'stable-diffusion-xl-1024-v1-0';
    // Add parameters to ensure transparency
    payload.input.prompt += ", isolated on completely transparent background";
    payload.input.negative_prompt += ", background, colored background";
  }

  console.log(`Generating ${imageConfig.name}...`);
  
  try {
    const response = await fetch('https://api.fal.ai/v1/generation/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${FAL_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the response has the expected data
    if (data && data.images && data.images.length > 0) {
      const imageUrl = data.images[0].url;
      await downloadImage(imageUrl, outputPath);
      return true;
    } else {
      console.error(`Unexpected response format for ${imageConfig.name}:`, data);
      return false;
    }
  } catch (error) {
    console.error(`Error generating ${imageConfig.name}:`, error.message);
    return false;
  }
};

// Main function to generate all images
const generateAllImages = async () => {
  console.log("Starting to generate festive images...");
  
  // Check if API key is set
  if (FAL_KEY === "YOUR_FAL_AI_API_KEY") {
    console.error("Please set your fal.ai API key in the script first.");
    return;
  }
  
  for (const image of images) {
    console.log(`Processing: ${image.name}`);
    await generateImage(image);
    // Add a small delay between requests to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("All images have been generated!");
};

// Run the main function
generateAllImages().catch(error => {
  console.error("An error occurred:", error);
});