import { IncomingForm } from 'formidable'; // Updated import
import fs from 'fs';

// Disable default body parser for multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// API route handler
const handler = async (req, res) => {
    const form = new IncomingForm({
        uploadDir: '../uploads', // Specify the custom upload directory
        keepExtensions: true,    // Keep the original file extension
      });
      

  // Parse the incoming form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the file' });
      return;
    }

    const filePath = files.file[0].filepath; // Get the path of the uploaded file
    console.log(filePath)
    try {
      console.log("File uploaded successfully.", filePath); // Log a message for testing

      // Dummy ingredient data
      const ingredients = { peanuts: 1, dingus: 2 }; // Sample ingredient data
      // const ingredients = await runMLModel(filePath);
      // Send the dummy ingredient data back in the response
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
