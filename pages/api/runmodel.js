import { execFile } from 'child_process';
import path from 'path';

// Define the runMLModel function that calls the Python script
async function runMLModel(imagePath) {
  return new Promise((resolve, reject) => {
    execFile('python', ['C:\Users\richa\Desktop\CodingWorkspaces\eatcookjoy\DeFridgenator\pages\api\mlmodel.py', imagePath], (error, stdout, stderr) => {
      if (error) {
        reject(new Error('Error running ML model: ' + error.message));
        return;
      }
      if (stderr) {
        reject(new Error('ML model stderr: ' + stderr));
        return;
      }
      try {
        const ingredients = JSON.parse(stdout);  // Parse the JSON output from Python
        resolve(ingredients);
      } catch (err) {
        reject(new Error('Failed to parse ML model output: ' + err.message));
      }
    });
  });
}

// The Next.js API route handler
export default async function handler(req, res) {
  try {
    // Path to the image file
    const imagePath = path.join(process.cwd(), 'public', 'fridge.png');
    
    // Call the runMLModel function to get ingredients
    const ingredients = await runMLModel(imagePath);
    
    // Send the ingredients back in the response
    res.status(200).json({ ingredients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
