// This script downloads placeholder Christmas images from placeholder services
// since we're having DNS issues with fal.ai

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// Images to download with their URLs
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

// Main function to download all images
const downloadAllImages = async () => {
  console.log("Starting to download placeholder images...");
  
  for (const image of placeholderImages) {
    const outputPath = path.join(__dirname, '..', 'public', image.name);
    console.log(`Downloading ${image.name} from ${image.url}...`);
    
    try {
      await downloadImage(image.url, outputPath);
    } catch (error) {
      console.error(`Error downloading ${image.name}:`, error.message);
    }
    
    // Add a small delay between downloads
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("All placeholder images have been downloaded!");
  console.log("Note: These are placeholder images. You should replace them with real festive images.");
};

// Run the main function
downloadAllImages().catch(error => {
  console.error("An error occurred:", error);
});