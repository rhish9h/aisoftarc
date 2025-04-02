import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import GenerateArchitecturePage from './pages/GenerateArchitecturePage';
import './App.css';

// NavLink component for active state styling
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
        isActive 
          ? 'bg-primary-50 text-primary-700' 
          : 'text-secondary-600 hover:bg-secondary-50 hover:text-primary-600'
      }`}
    >
      {children}
    </Link>
  );
};

const AppNav = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-secondary-200 backdrop-blur-sm bg-white/90">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M15 18H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
              AI Software Architecture
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/generate-architecture">Generate Architecture</NavLink>
            <a 
              href="https://github.com/yourusername/aisoftarc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 p-2 text-secondary-500 hover:text-secondary-700 rounded-full hover:bg-secondary-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
            </a>
          </div>
          
          <div className="md:hidden">
            {/* Mobile menu button - we would implement toggle functionality in a real app */}
            <button className="p-2 rounded-md text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Routes>
          <Route path="/*" element={
            <>
              <AppNav />
              <main className="pt-6 pb-16">
                <Routes>
                  <Route path="/" element={
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                      <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-secondary-900 sm:text-5xl md:text-6xl">
                          <span className="block">AI Software Architecture</span>
                          <span className="block text-primary-600">Generator</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-secondary-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                          Generate detailed, production-ready software architecture diagrams and documentation powered by AI.
                        </p>
                        <div className="mt-8 flex justify-center">
                          <Link 
                            to="/generate-architecture" 
                            className="rounded-full shadow-lg px-8 py-3 bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-150 ease-in-out"
                          >
                            Get Started
                          </Link>
                          <a 
                            href="#features" 
                            className="ml-4 rounded-full px-8 py-3 bg-secondary-100 text-secondary-700 font-medium hover:bg-secondary-200 transition-all duration-150 ease-in-out"
                          >
                            Learn More
                          </a>
                        </div>
                      </div>
                    </div>
                  } />
                  <Route path="/generate-architecture" element={<GenerateArchitecturePage />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
