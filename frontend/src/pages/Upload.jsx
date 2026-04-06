import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); if (!title) setTitle(f.name.replace(/\.[^/.]+$/, '')); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.pdf') || f.name.endsWith('.txt'))) {
      setFile(f); if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a file'); return; }
    setLoading(true); setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    try {
      const response = await axios.post('http://localhost:8000/api/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      localStorage.setItem(`note_${response.data.noteId}`, JSON.stringify({
        id: response.data.noteId, title: response.data.title, extractedText: response.data.extractedText,
      }));
      navigate(`/notes/${response.data.noteId}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />
      <div className="container mx-auto px-6 py-12" style={{ maxWidth: 680 }}>
        <h1 style={{
          fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Upload Notes</h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          PDF or TXT files — text is extracted automatically
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '1.5rem', padding: '2rem',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
              style={{
                border: `2px dashed ${dragOver ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '1rem', padding: '2.5rem',
                textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s',
              }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                {file ? '✅' : '📁'}
              </div>
              {file ? (
                <p style={{ color: '#a5f3fc', fontWeight: 600 }}>{file.name}</p>
              ) : (
                <>
                  <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem' }}>
                    Drag & drop your file here
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
                    or click to browse — PDF & TXT supported
                  </p>
                </>
              )}
              <input id="file-input" type="file" accept=".pdf,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                Title (optional)
              </label>
              <input
                type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="My Study Notes"
                className="input-dark"
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.875rem',
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Uploading & Extracting...' : 'Upload & Extract Text →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;
