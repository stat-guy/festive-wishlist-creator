# Festive Image Generation Scripts

These scripts generate festive images for the Wishlist Creator application using the fal.ai API.

## Prerequisites

- Node.js installed (v14+ for the https version, v18+ for the fetch version)
- fal.ai API key

## How to Use

1. Choose which script you'd like to use:
   - `generate-festive-images.js` - Uses Node.js https module
   - `generate-festive-images-fetch.js` - Uses fetch API (requires Node.js 18+ or the node-fetch package)

2. Open the script and replace the placeholder API key:
   ```javascript
   const FAL_KEY = "YOUR_FAL_AI_API_KEY"; // Replace with your actual key
   ```

3. If using Node.js version below 18 with the fetch version, uncomment and install node-fetch:
   ```bash
   npm install node-fetch
   ```
   And uncomment the require line in the script:
   ```javascript
   const fetch = require('node-fetch');
   ```

4. Run the script:
   ```bash
   node scripts/generate-festive-images.js
   # OR
   node scripts/generate-festive-images-fetch.js
   ```

5. Wait for the images to be generated and downloaded to the `public` directory.

## Generated Images

The script will create the following images:

- `christmas-bg.jpg` - Festive Christmas background
- `holly-decoration.png` - Holly leaves and berries decoration (large)
- `ornament-decoration.png` - Christmas ornament decoration (large)
- `holly-small.png` - Holly leaves and berries decoration (small)
- `ornament-small.png` - Christmas ornament decoration (small)
- `snowflake1.png`, `snowflake2.png`, `snowflake3.png` - Unique snowflake designs

## Customization

You can customize the prompts, sizes, and other parameters for each image by modifying the `images` array in the script.

## Troubleshooting

- If you receive a 401 error, check that your API key is valid
- If you receive rate limit errors, increase the delay between requests
- If transparency isn't working correctly, try adjusting the prompt and negative prompt

## Notes

The generated images are placed directly in the `public` directory so they can be accessed by the web application. The paths in the code are already set up to reference these images.