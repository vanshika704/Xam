import React, { useState } from 'react';

const SummarizerApp = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    // Send the file to the backend
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setSummary(data.summary);
    setAudioUrl(data.audioUrl);
  };

  return (
    <div>
      <h1>AI Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload and Summarize</button>
      </form>

      <h2>Summary:</h2>
      <p>{summary}</p>

      <h2>Audio:</h2>
      <audio controls>
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default SummarizerApp;
