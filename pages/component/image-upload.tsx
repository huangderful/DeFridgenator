import { useState } from 'react';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false); // New state for recipe fetching
  const [ingredients, setIngredients] = useState({});
  const [recipes, setRecipes] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setIngredients([]);
      setRecipes([]);
    } else {
      setSelectedFile(null);
      setPreview(null);
    }
  
    e.target.value = null; // Reset the input value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('../api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setIngredients(data.ingredients); // Assuming API returns a list of ingredients
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipes = async () => {
    const ingredientString = Object.keys(ingredients).join(', '); // Convert ingredients object to a string
    setIsFetchingRecipes(true); // Set loading state to true
    try {
      const res = await fetch('../api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Set correct content type
        },
        body: new URLSearchParams({ ingredients: ingredientString }), // Send ingredients as URL encoded params
      });
      const data = await res.json();
      setRecipes(data.recipes); // Assuming API returns a list of recipes
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsFetchingRecipes(false); // Reset loading state
    }
  };

  return (
    <div className="min-w-fit w-1/2 flex flex-col items-center bg-emerald-50 pl-10 pr-10 pt-10 pb-10 rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload an Image of Your Fridge</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 w-96">
        <div className="flex flex-col items-center">
          <label className="w-full flex flex-col items-center bg-blue-500 text-white rounded-lg shadow-lg px-4 py-2 cursor-pointer hover:bg-blue-600 transition-colors duration-200">
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" // Hide the default input
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 rounded-lg shadow-md max-h-96 object-cover"
            />
          )}
        </div>
        {preview && (
          <button
            type="submit"
            className={`w-full py-2 mt-2 text-white rounded-lg transition-colors duration-300 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Defridgerate'}
          </button>
        )}
      </form>

      {Object.keys(ingredients).length > 0 && (
        <div className="mt-6 w-full max-w-md bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800">Detected Ingredients:</h2>
          <ul className="mt-2 space-y-1">
            {Object.entries(ingredients).map(([ingredient, quantity]) => (
              <li key={ingredient} className="text-gray-700">
                {ingredient.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}: <span className="font-semibold">{quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(ingredients).length > 0 && (
        <button
          onClick={fetchRecipes}
          className={`mt-4 w-full py-2 text-white rounded-lg transition-colors duration-300 ${isFetchingRecipes ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-600'}`}
          disabled={isFetchingRecipes} // Disable button while fetching recipes
        >
          {isFetchingRecipes ? 'Processing...' : 'Get Recipes'}
        </button>
      )}

      {recipes.length > 0 && (
        <div className="mt-6 w-full max-w-md bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800">Suggested Recipes:</h2>
          <ul className="mt-2 space-y-1">
            {recipes.map((recipe, index) => (
              <li key={index} className="text-gray-700">{recipe}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
