import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "./SubmitView.css";

export default function SubmitView() {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [plannerLink, setPlannerLink] = useState('');
  const [submitter, setSubmitter] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/submit-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitter: submitter.trim() || 'Anonymous',
          youtubeLink,
          plannerLink,
        }),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'BUILD SUBMITTED SUCCESSFULLY! WE WILL REVIEW IT SHORTLY.',
        });
        setYoutubeLink('');
        setPlannerLink('');
        setSubmitter('');
      } else {
        throw new Error('Server returned an error');
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'FAILED TO SEND SUBMISSION. PLEASE TRY AGAIN LATER.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-page">
      <Header />

      <main className="submit-wrapper">
        <section className="submit-part-card">
          <h2 className="part-title">Submit a Build</h2>
          
          <div className="submit-info-box">
            <p className="feature-label-text">How to submit:</p>
            <p className="submit-description">
              Want your build to showcase? 
              Fill out the links below. Make sure your video showcase and build planner links are accessible to anyone with the URL.
            </p>
          </div>

          <form className="submit-form" onSubmit={handleSubmit}>
            <div className="submit-row-line">
              <label htmlFor="submitter" className="feature-label-text">
                Username:
              </label>
              <input
                id="submitter"
                type="text"
                className="submit-input-box"
                placeholder="Optional (e.g. RBLX username / Discord)"
                value={submitter}
                onChange={(e) => setSubmitter(e.target.value)}
              />
            </div>

            <div className="submit-row-line">
              <label htmlFor="youtube" className="feature-label-text">
                Chime Clip Link: <span className="required">*</span>
              </label>
              <input
                id="youtube"
                type="text"
                className="submit-input-box"
                placeholder="Paste clip link (YouTube, Medal, Streamable, etc.)"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                required
              />
            </div>

            <div className="submit-row-line">
              <label htmlFor="planner" className="feature-label-text">
                DW Builder Link: <span className="required">*</span>
              </label>
              <input
                id="planner"
                type="text"
                className="submit-input-box"
                placeholder="Paste build planner link"
                value={plannerLink}
                onChange={(e) => setPlannerLink(e.target.value)}
                required
              />
            </div>

            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}

            <div className="submit-actions">
              <button type="submit" className="submit" disabled={isSubmitting}>
                {isSubmitting ? 'SENDING...' : 'SUBMIT BUILD'}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}