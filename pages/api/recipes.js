import { IncomingForm } from 'formidable'; // Updated import
import { execFile } from 'child_process';
import path from 'path';

// Disable default body parser for multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

async function runRecipes(ingredientString) {
  return new Promise((resolve, reject) => {
    execFile('python', ['./pages/api/recipes.py', ingredientString], (error, stdout, stderr) => {
      if (error) {
        reject(new Error('Error running recipe model: ' + error.message));
        return;
      }
      if (stderr) {
        reject(new Error('Recipe model stderr: ' + stderr));
        return;
      }
      try {
        const recipes = JSON.parse(stdout); // Parse the JSON output from Python
        resolve(recipes);
      } catch (err) {
        reject(new Error('Failed to parse recipe model output: ' + err.message));
      }
    });
  });
}

// API route handler
const handler = async (req, res) => {
  const form = new IncomingForm();
  
  // Parse the incoming form data
  form.parse(req, async (err, fields) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing form data' });
      return;
    }

    // Extract the ingredients string from the fields
    const ingredientString = fields.ingredients; // Assuming ingredients are passed as a field
    console.log('Received ingredients:', ingredientString);

    try {
      // Call the runRecipes function to get recipes
      const recipes = await runRecipes(ingredientString);
      console.log('Found recipes:', recipes);
      res.status(200).json({ recipes });
    } catch (error) {
      console.error('Error processing ingredients:', error);
      res.status(500).json({ error: 'Error processing ingredients' });
    }
  });
};

// Export the handler as default
export default handler;
