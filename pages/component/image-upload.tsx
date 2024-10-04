import { useState } from 'react';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
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

  return (
    <div className="min-w-fit w-1/2 flex flex-col items-center bg-emerald-50 pl-10 pr-10 pt-10 pb-10 rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload an Image of Your Fridge</h1>

      <form onSubmit={handleSubmit} className=" bg-white shadow-lg rounded-lg p-6 w-96">
      <div className="flex flex-col items-center">
        <label className="w-full flex flex-col items-center bg-blue-500 text-white rounded-lg shadow-lg px-4 py-2 cursor-pointer hover:bg-blue-600 transition-colors duration-200">
          <span className="">Upload Image</span>
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
    </div>
  );
};

export default ImageUpload;
