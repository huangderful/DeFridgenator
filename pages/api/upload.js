import { IncomingForm } from 'formidable'; // Updated import
import fs from 'fs';
import { execFile } from 'child_process';
import path from 'path';
// Disable default body parser for multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Define the runMLModel function that calls the Python script
async function runMLModel(imagePath) {
  return new Promise((resolve, reject) => {
    execFile('python', ['./pages/api/mlmodel.py', imagePath], (error, stdout, stderr) => {
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
    console.log(fileName)
    try {
      // console.log("File uploaded successfully.", filePath); // Log a message for testing

      // Dummy ingredient data
      // const ingredients = { peanuts: 1, dingus: 2 }; // Sample ingredient data
      // const trueingredients = await runMLModel("./fridge.png");
      // console.log(trueingredients)

      const imagePath = path.join(process.cwd(), 'uploads', fileName);
      // Call the runMLModel function to get ingredients
      const ingredients = await runMLModel(imagePath);
      console.log(ingredients.length)
      res.status(200).json({ ingredients });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Error processing image' });
    } finally {
      // Clean up the file if needed
      // fs.unlink(filePath, (err) => {
      //   if (err) console.error('Error deleting file:', err);
      // });
    }
  });
};

// Export the handler as default
export default handler;
