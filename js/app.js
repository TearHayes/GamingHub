// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  try {
    const theme = getTheme();
    applyTheme(theme);
    
    // Initialize default data
    initializeDefaultData();
    
    // Render the app
    renderApp();
  } catch (error) {
    console.error('App initialization error:', error);
    reportError(error);
  }
});

function App() {
  try {
    const [path, setPath] = React.useState(window.location.pathname);
    
    // Handle navigation
    React.useEffect(() => {
      const handleNavigation = () => {
        setPath(window.location.pathname);
        window.scrollTo(0, 0);
      };
      
      window.addEventListener('popstate', handleNavigation);
      
      // Intercept link clicks for SPA navigation
      document.addEventListener('click', (e) => {
        // Only handle links within our app
        if (e.target.tagName === 'A' && e.target.href && e.target.href.startsWith(window.location.origin) && !e.target.target) {
          e.preventDefault();
          const newPath = new URL(e.target.href).pathname;
          
          if (newPath !== path) {
            window.history.pushState({}, '', e.target.href);
            setPath(newPath);
            window.scrollTo(0, 0);
          }
        }
      });
      
      return () => {
        window.removeEventListener('popstate', handleNavigation);
      };
    }, [path]);
    
    // Render the appropriate page based on the path
    const renderPage = () => {
      if (path === '/' || path === '') {
        return <Home />;
      } else if (path === '/discover') {
        return <Discover />;
      } else if (path === '/profile') {
        return <Profile />;
      } else if (path === '/admin') {
        return <AdminPanel />;
      } else if (path.startsWith('/product/')) {
        return <ProductDetail />;
      } else {
        return <NotFound />;
      }
    };
    
    return (
      <React.Fragment>
        <div className="flex flex-col min-h-screen" data-name="app-container">
          <Header />
          <main className="flex-grow" data-name="main-content">
            {renderPage()}
          </main>
          <Footer />
        </div>
      </React.Fragment>
    );
  } catch (error) {
    console.error('App component error:', error);
    reportError(error);
    return (
      <div className="container mx-auto px-4 py-16 text-center" data-name="error-fallback">
        <div className="max-w-md mx-auto" data-name="error-content">
          <i className="fas fa-exclamation-circle text-6xl mb-6 text-red-500" data-name="error-icon"></i>
          <h1 className="text-4xl font-bold mb-4" data-name="error-title">Something went wrong</h1>
          <p className="text-xl opacity-70 mb-8" data-name="error-description">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
            data-name="refresh-button"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}

function renderApp() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  } else {
    console.error('Root element not found');
  }
}
