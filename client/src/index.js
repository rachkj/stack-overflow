import React from 'react';
import { createRoot } from 'react-dom';
import './index.css';
import FakeStackOverflow from './components/fakestackoverflow.js';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FakeStackOverflow/>
  </React.StrictMode>
);
