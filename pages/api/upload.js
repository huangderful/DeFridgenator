import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Disable default body parser for multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to detect ingredients from an image
async function detectIngredients(imagePath) {
  try {
    // Read the image as base64
    const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

    // Send POST request to Roboflow API
    const response = await axios({
      method: "POST",
      url: "https://detect.roboflow.com/aicook-lcv4d/3",
      params: {
        api_key: process.env.ROBOFLOW_KEY, // Use the key from the environment variables
      },
      data: imageBase64,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const predictions = response.data.predictions;
    const confidenceThreshold = 0.4;
    const ingredients = {};

    // Counting classes with confidence greater than the threshold
    predictions.forEach(item => {
      if (item.confidence > confidenceThreshold) {
        const className = item.class;

        if (ingredients[className]) {
          ingredients[className] += 1;
        } else {
          ingredients[className] = 1;
        }
      }
    });

    return ingredients;

  } catch (error) {
    console.error('Error detecting ingredients:', error.message);
    throw error;
  }
}

// API route handler
const handler = async (req, res) => {
  const form = new IncomingForm({
    uploadDir: './uploads', // Specify the custom upload directory
    keepExtensions: true,    // Keep the original file extension
  });

  // Parse the incoming form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the file' });
      return;
    }

    const fileName = files.file[0].newFilename; // Get the path of the uploaded file
    console.log(fileName);
    try {
      const imagePath = path.join(process.cwd(), 'uploads', fileName);
      // Call the detectIngredients function to get ingredients
      const ingredients = await detectIngredients(imagePath);
      console.log(ingredients);
      res.status(200).json({ ingredients });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Error processing image' });
    } finally {
      // Clean up the file if needed
      fs.unlink(files.file[0].filepath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
  });
};

// Export the handler as default
export default handler;
