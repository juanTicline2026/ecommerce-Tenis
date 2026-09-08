import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
          </Routes>
        </main>
        
        {/* Simple Footer */}
        <footer style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          padding: '48px 24px',
          marginTop: '64px'
        }}>
          <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-bold text-xl" style={{ fontFamily: 'Outfit' }}>Tenis-Arios</p>
              <p className="text-sm text-secondary mt-1">Donde lo urbano se vuelve profesional.</p>
            </div>
            <p className="text-sm text-secondary">
              &copy; {new Date().getFullYear()} Tenis-Arios. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
