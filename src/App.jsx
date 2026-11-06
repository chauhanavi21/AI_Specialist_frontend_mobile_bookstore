import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CatalogPage from './pages/CatalogPage';

function Placeholder({ title }) {
  return <p className="p-6 text-fg2">{title} is coming soon.</p>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-canvas text-fg">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-brand focus:text-white focus:p-2">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="*" element={<Placeholder title="This page" />} />
        </Routes>
      </main>
    </div>
  );
}
