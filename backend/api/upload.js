const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Initialize the Supabase client
const supabaseUrl = process.env.SUPABASE_ID; // Replace with your Supabase URL
const supabaseKey = process.env.SUPABASE_API; // Replace with your Supabase service role key
const supabase = createClient(supabaseUrl, supabaseKey);

// Create an instance of Express
const app = express();

// Enable CORS for the frontend (adjust if needed)
app.use(cors({
  origin: 'http://localhost:5173', // React app's URL (adjust if different)
}));

// Multer setup for file upload
const storage = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage: storage });

// Upload file route to Supabase Storage
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const file = req.file;
    const { originalname, buffer } = file;
    const fileExtension = path.extname(originalname).toLowerCase();
    const fileName = Date.now() + fileExtension; // Ensure unique filenames

    // Upload file to Supabase Storage (replace 'your-bucket-name' with your actual bucket)
    const { data, error } = await supabase
      .storage
      .from('your-bucket-name') // Replace with your Supabase storage bucket name
      .upload(fileName, buffer, {
        contentType: file.mimetype,
        upsert: true, // Set to true if you want to overwrite existing files with the same name
      });

    if (error) {
      throw new Error(error.message);
    }

    // Return the public URL of the uploaded file
    const publicUrl = supabase
      .storage
      .from('uploads')
      .getPublicUrl(fileName).publicURL;

    res.json({
      message: 'File uploaded successfully',
      fileUrl: publicUrl, // URL of the uploaded file
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading file to Supabase' });
  }
});

// Text summarization route (You can use any text summarization API here)
app.post('/api/summarize', express.json(), async (req, res) => {
  const { text } = req.body;

  // Your logic for summarizing the text (e.g., integrating with OpenAI, GPT-3, etc.)
  // For now, just a placeholder summarizer
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  const summary = text.split('. ').slice(0, 2).join('. ') + '.';

  res.json({
    message: 'Text summarized successfully',
    summary: summary,
  });
});

// Convert file to text (using a package like `pdf-parse` for PDFs, or `textract` for DOCX files)
const pdfParse = require('pdf-parse');

app.post('/api/convert-to-text', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;
  const { buffer, mimetype } = file;

  try {
    if (mimetype === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      res.json({
        message: 'PDF converted to text successfully',
        text: pdfData.text, // Extracted text from the PDF
      });
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error converting file to text' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
