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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Upload an image of your fridge</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        {preview && <img src={preview} alt="Preview" className="mb-4 max-h-96" />}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Upload and Detect Ingredients'}
        </button>
      </form>

      {Object.keys(ingredients).length > 0 && (
        <div className="mt-6">
            <h2 className="text-xl font-semibold">Detected Ingredients:</h2>
            <ul>
            {Object.entries(ingredients).map(([ingredient, quantity]) => (
                <li key={ingredient}>
                {ingredient}: {quantity}
                </li>
            ))}
            </ul>
        </div>
        )}
    </div>
  );
};

export default ImageUpload;
