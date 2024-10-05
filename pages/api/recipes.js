// Handler for getting all the recipes based on ingredients
import { IncomingForm } from 'formidable';
import axios from 'axios';
export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to get recipes based on ingredients using Spoonacular API
async function runRecipes(ingredientString) {
  try {
    const url = 'https://api.spoonacular.com/recipes/findByIngredients';
    const params = {
      ingredients: ingredientString[0], // Comma-separated list of ingredients
      apiKey: process.env.RECIPE_API_KEY,
    };
    const response = await axios.get(url, { params });
    // Extract recipe titles
    const recipes = response.data.map(recipe => recipe.title);

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    throw error;
  }
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
    try {
      // Call the runRecipes function to get recipes
      const recipes = await runRecipes(ingredientString);
      res.status(200).json({ recipes });
    } catch (error) {
      console.error('Error processing ingredients:', error);
      res.status(500).json({ error: 'Error processing ingredients' });
    }
  });
};

// Export the handler as default
export default handler;
