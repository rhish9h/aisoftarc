import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GenerateArchitecturePage from './pages/GenerateArchitecturePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-gray-800">AI Software Architecture</h1>
                <div className="hidden md:flex space-x-4">
                  <Link to="/" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Home
                  </Link>
                  <Link to="/generate-architecture" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Generate Architecture
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto py-6">
          <Routes>
            <Route path="/" element={
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Software Architecture Generator</h1>
                <p className="text-gray-600 mb-8">Generate software architecture diagrams with AI</p>
                <Link to="/generate-architecture" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Get Started
                </Link>
              </div>
            } />
            <Route path="/generate-architecture" element={<GenerateArchitecturePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
