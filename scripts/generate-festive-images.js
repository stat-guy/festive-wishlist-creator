const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// fal.ai API key
const FAL_KEY = "3eaba188-7132-4f0c-b43c-256f96dbef61:2fb3c066d7665fe10e18d670599c9765";

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
    // Setup request options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${FAL_KEY}`
      }
    };

    // Create a Promise for the HTTP request
    const requestPromise = new Promise((resolve, reject) => {
      // Using full URL with options object for better control
      const options = {
        hostname: 'api.fal.ai',
        port: 443,
        path: '/v1/generation/image',
        method: 'POST',
        headers: requestOptions.headers
      };
      
      const req = https.request(
        options,
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              const responseData = JSON.parse(data);
              resolve(responseData);
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error.message}`));
            }
          });
        }
      );

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      // Write the payload to the request
      req.write(JSON.stringify(payload));
      req.end();
    });

    // Wait for the request to complete
    const response = await requestPromise;
    
    // Check if the response has the expected data
    if (response && response.images && response.images.length > 0) {
      const imageUrl = response.images[0].url;
      await downloadImage(imageUrl, outputPath);
      return true;
    } else {
      console.error(`Unexpected response format for ${imageConfig.name}:`, response);
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