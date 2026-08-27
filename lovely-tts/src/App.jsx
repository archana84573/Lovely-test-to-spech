import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                // Filter out some voices or just take all
                setVoices(availableVoices);
                if (!selectedVoiceURI) {
                    setSelectedVoiceURI(availableVoices[0].voiceURI);
                }
            }
        };

        loadVoices();
        // Some browsers load voices asynchronously
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, [selectedVoiceURI]);

    const handleConvert = () => {
        if (!text.trim()) return;

        window.speechSynthesis.cancel(); // Stop anything currently playing
        setIsPlaying(true);

        const utterance = new SpeechSynthesisUtterance(text);

        const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
        if (voice) {
            utterance.voice = voice;
        }

        utterance.rate = speed;
        utterance.volume = volume;

        utterance.onend = () => {
            setIsPlaying(false);
        };

        utterance.onerror = (e) => {
            console.error("Speech Synthesis Error", e);
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const stopPlay = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1>Lovely TTS Converter</h1>
            </header>

            <main className="main-content">
                <section className="input-section">
                    <textarea
                        className="text-input"
                        placeholder="Type your text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                </section>

                <section className="voice-section">
                    <h2 className="section-title">Select a Voice</h2>
                    <div className="voice-list">
                        {voices.map(voice => (
                            <div
                                key={voice.voiceURI}
                                className={`voice-card ${selectedVoiceURI === voice.voiceURI ? 'selected' : ''}`}
                                onClick={() => setSelectedVoiceURI(voice.voiceURI)}
                            >
                                <div className="voice-avatar">{voice.name.includes("Google") ? "🌐" : "🗣️"}</div>
                                <div className="voice-info">
                                    <span className="voice-name">{voice.name}</span>
                                    <span className="voice-type">{voice.lang}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="action-section">
                    <button
                        className="convert-button"
                        onClick={handleConvert}
                        disabled={text.trim() === ''}
                    >
                        {isPlaying ? 'Restart Speech' : 'Speak Text'}
                    </button>
                    {isPlaying && (
                        <div style={{ marginTop: '1rem' }}>
                            <button className="convert-button" onClick={stopPlay} style={{ background: '#ff4444' }}>
                                Stop Playing
                            </button>
                        </div>
                    )}
                </section>

                <section className="controls-section">
                    <h2 className="section-title">Settings</h2>
                    <div className="sliders">
                        <div className="slider-group">
                            <label>Speed</label>
                            <input
                                type="range"
                                min="0.5" max="2" step="0.1"
                                value={speed}
                                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="slider-group">
                            <label>Volume</label>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <p>Lovely TTS Converter © 2026 (Web Speech API)</p>
            </footer>
        </div>
    );
}

export default App;
