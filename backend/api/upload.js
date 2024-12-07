// import { IncomingForm } from 'formidable';  // For handling file uploads
// import { createClient } from '@supabase/supabase-js';  // For Supabase interaction
// import openai from 'openai';  // For using OpenAI API for summarization
// import googleTTS from 'google-tts-api';  // For generating audio
// import dotenv from "dotenv"
// dotenv.config();

// // Supabase client setup
// const supabaseUrl = process.env.SUPABASE_ID;
// const supabaseKey = process.env.SUPABASE_API;
// const supabase = createClient(supabaseUrl, supabaseKey);


// // OpenAI API setup (use your API key)
// const openaiAPIKey = process.env.OPEN_AI;
// openai.apiKey = openaiAPIKey;

// // Disable bodyParser to handle the file upload manually in Vercel
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // Function to handle file upload, summarization, and audio generation
// const uploadHandler = async (req, res) => {
//   const form = new IncomingForm();

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ error: 'File upload error.' });
//     }

//     // Get the file from the request
//     const file = files.file[0];
//     const filePath = file.filepath;

//     // Step 1: Upload file to Supabase storage
//     const { data, error } = await supabase.storage
//       .from('uploads')
//       .upload(`public/${file.originalFilename}`, file.filepath);

//     if (error) {
//       return res.status(500).json({ error: 'File upload to Supabase failed.' });
//     }

//     // Step 2: Generate a summary using OpenAI API
//     const summary = await generateSummary(filePath);  // File content passed here

//     // Step 3: Generate an audio file from the summary text using Google Text-to-Speech
//     const audioUrl = await generateAudio(summary);

//     // Return the summary and audio URL
//     return res.status(200).json({
//       summary: summary,
//       audioUrl: audioUrl,
//     });
//   });
// };

// export default uploadHandler;

// // Function to generate summary using OpenAI GPT-3
// const generateSummary = async (filePath) => {
//   // Load file content and create summary prompt
//   // This could be reading the file content, extracting text from PDF, or any other format
//   const fileContent = 'Extracted file content here...';  // Use a method to read the file's content
  
//   try {
//     const completion = await openai.completions.create({
//       model: 'text-davinci-003',  // GPT-3 model for text generation
//       prompt: `Summarize the following text:\n\n${fileContent}`,
//       max_tokens: 200,
//     });
    
//     return completion.choices[0].text.trim();  // Return the summary
//   } catch (error) {
//     console.error('Error generating summary:', error);
//     return 'Failed to generate summary';
//   }
// };

// // Function to convert text to speech using Google TTS
// const generateAudio = async (text) => {
//   const url = googleTTS.getAudioUrl(text, {
//     lang: 'en',
//     slow: false,
//     host: 'https://translate.google.com',
//   });

//   return url;  // Google TTS returns a URL for the audio file
// };
import { IncomingForm } from 'formidable';  // For handling file uploads
import { createClient } from '@supabase/supabase-js';  // For Supabase interaction
import openai from 'openai';  // For using OpenAI API for summarization
import googleTTS from 'google-tts-api';  // For generating audio

// Supabase client setup
const supabaseUrl = 'https://<your-project-id>.supabase.co';  // Replace with your Supabase URL
const supabaseKey = '<your-api-key>';  // Replace with your Supabase API key
const supabase = createClient(supabaseUrl, supabaseKey);

// OpenAI API setup (use your API key)
const openaiAPIKey = '<your-openai-api-key>';
openai.apiKey = openaiAPIKey;

// Disable bodyParser to handle the file upload manually in Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to handle file upload, summarization, and audio generation
const uploadHandler = async (req, res) => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload error.' });
    }

    const file = files.file[0];
    const filePath = file.filepath;

    // Step 1: Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(`public/${file.originalFilename}`, file.filepath);

    if (error) {
      return res.status(500).json({ error: 'File upload to Supabase failed.' });
    }

    // Step 2: Generate a summary using OpenAI API
    const summary = await generateSummary(filePath);

    // Step 3: Generate an audio file from the summary text using Google Text-to-Speech
    const audioUrl = await generateAudio(summary);

    return res.status(200).json({
      summary: summary,
      audioUrl: audioUrl,
    });
  });
};

export default uploadHandler;

// Function to generate summary using OpenAI GPT-3
const generateSummary = async (filePath) => {
  // Load file content (you may need additional logic to read PDF, .txt, etc.)
  const fileContent = 'Extracted file content here...';  // Placeholder, replace with actual file extraction logic
  
  try {
    const completion = await openai.completions.create({
      model: 'text-davinci-003',  // GPT-3 model for text generation
      prompt: `Summarize the following text:\n\n${fileContent}`,
      max_tokens: 200,
    });
    
    return completion.choices[0].text.trim();  // Return the summary
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Failed to generate summary';
  }
};

// Function to convert text to speech using Google TTS
const generateAudio = async (text) => {
  const url = googleTTS.getAudioUrl(text, {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
  });

  return url;  // Google TTS returns a URL for the audio file
};
