import shortLogo from './assets/short.png';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(false); // State to manage showing/hiding description

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const summarizeText = () => {
    if (countWords(text) < 50) {
      alert(`Please enter at least 50 words.`);
      return; // Exit function if word count is less than 50
    }

    setSummary('');
    setLoading(true);
    axios.post('http://127.0.0.1:5000/summary', { text: text })
      .then(response => {
        const cleanedSummary = response.data.summary
          .replace(/<pad>|<s>|<\/s>/g, '') // Remove unnecessary tokens
          .trim();
        setSummary(cleanedSummary);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  const translateText = () => {
    setSummary('');
    setLoading(true);
    setTimeout(() => {
      axios.post('http://127.0.0.1:5000/translate', { text: summary, target_language: 'hi' })
        .then(response => {
          setSummary(response.data.translatedText);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setLoading(false);
        });
    }, 1500);
  };

  const countWords = (text) => {
    const words = text.trim().split(/\s+/);
    return words.length - 1;
  };

  // Toggle description display
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  return (
    <div className="container">
      <div>
        <a href="#" onClick={toggleDescription}>
          <img src={shortLogo} className="logo short" alt="Summary logo" />
        </a>
      </div>
      {showDescription && ( // Display description only if showDescription is true
        <div className="description">
          <h2>Summary</h2>
          <p>The Summary Extension is a powerful tool designed to provide users with quick and concise summaries of text content. Whether you are skimming through lengthy articles, research papers, or documents, this extension streamlines the process by condensing the key points into easily digestible snippets.<u>It also translate summarized text to hindi language.</u></p>
          <p><strong>Developed by : </strong><b>[Kiran]</b></p>
          <p>Perfect for students, researchers, and professionals seeking key insights from textual content.</p>
        </div>
      )}
      {!showDescription && (
        <div className="content">
          <div className="textBox">
            <textarea
              rows="10"
              cols="40"
              placeholder="Enter text for summarization"
              value={text}
              onChange={handleTextChange}
            ></textarea>
            <div className="wordCount">Word Count: {countWords(text)}</div>
          </div>
          <div className="card">
            <button id="summary" onClick={summarizeText}>Summarize</button>
          </div>
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          )}
          {summary && (
            <>
              <div className="summaryBox">
                <h2>Summary:</h2>
                <p>{summary}</p>
                <div className="wordCount">Word Count: {countWords(summary)}</div>
              </div>
              <div className="card">
                <button id="summary" onClick={translateText}>Translate</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
