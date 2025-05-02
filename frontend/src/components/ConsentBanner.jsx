import { useEffect, useState } from 'react';
import axios from 'axios';

const ConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('userConsent');
    const timestamp = localStorage.getItem('consentTimestamp');

    // If no consent or it's older than 12 months, show banner
    if (!consent || isConsentExpired(timestamp)) {
      setShowBanner(true);
    }
  }, []);

  const isConsentExpired = (timestamp) => {
    if (!timestamp) return true;
    const givenDate = new Date(timestamp);
    const now = new Date();
    const diffInMonths = (now.getFullYear() - givenDate.getFullYear()) * 12 + (now.getMonth() - givenDate.getMonth());
    return diffInMonths >= 12;
  };

  const sendConsent = async (acceptedCategories) => {
    try {
      const ip = await (await fetch('https://api.ipify.org?format=json')).json();
      await axios.post('http://localhost:1337/api/consents', {
        data: {
          ip_address: ip.ip,
          accepted_categories: acceptedCategories,
          consent_given_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
        },
      });
    } catch (err) {
      console.error("Failed to send consent: ", err);
    }
  };

  const handleAcceptAll = () => {
    const categories = ['necessary', 'analytics', 'marketing'];
    localStorage.setItem('userConsent', JSON.stringify(categories));
    localStorage.setItem('consentTimestamp', new Date().toISOString());
    sendConsent(categories);
    setShowBanner(false);
  };

  const handleReject = () => {
    const categories = ['necessary'];
    localStorage.setItem('userConsent', JSON.stringify(categories));
    localStorage.setItem('consentTimestamp', new Date().toISOString());
    sendConsent(categories);
    setShowBanner(false);
  };

  const handleManageConsent = () => {
    setShowBanner(true);
  };

  return (
    <>
      {/* Add this to any part of your site, like footer */}
      <button
        onClick={handleManageConsent}
        style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 999 }}
      >
        Manage Consent
      </button>

      {showBanner && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#f0f0f0',
            padding: '1rem',
            zIndex: 1000,
            borderTop: '1px solid #ccc',
          }}
        >
          <p>
            We use cookies to enhance your experience. Choose your preferences.
            Read our{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              Privacy Policy
            </a>
            .
          </p>
          <button onClick={handleAcceptAll} style={{ marginRight: '1rem' }}>
            Accept All
          </button>
          <button onClick={handleReject}>Reject</button>
        </div>
      )}
    </>
  );
};

export default ConsentBanner;
