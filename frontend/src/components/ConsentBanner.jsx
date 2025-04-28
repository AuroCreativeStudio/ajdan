import { useEffect, useState } from 'react';
import axios from 'axios';

const ConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('userConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  
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
    sendConsent(categories);
    setShowBanner(false);
  };

  const handleReject = () => {
    const categories = ['necessary'];
    localStorage.setItem('userConsent', JSON.stringify(categories));
    sendConsent(categories);
    setShowBanner(false);
  };

  return showBanner ? (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#eee', padding: '1rem', zIndex: 1000 }}>
      <p>We use cookies to enhance your experience. Choose your preferences.</p>
      <button onClick={handleAcceptAll}>Accept All</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  ) : null;
};

export default ConsentBanner;
