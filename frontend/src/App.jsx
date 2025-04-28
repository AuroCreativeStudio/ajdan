import { useState } from 'react'
import './App.css'
import ConsentBanner from './components/ConsentBanner';
import i18n from 'i18next';
import LanguageToggle from './components/LanguageToggle';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <LanguageToggle />
      <ConsentBanner/>
      <h1>{t('hello')}</h1>
    </>
  )
}

export default App
