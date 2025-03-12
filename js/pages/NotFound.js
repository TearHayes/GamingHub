function NotFound() {
  try {
    return (
      <div className="container mx-auto px-4 py-16 text-center" data-name="not-found-page">
        <div className="max-w-md mx-auto" data-name="not-found-content">
          <i className="fas fa-exclamation-triangle text-6xl mb-6 text-yellow-500" data-name="not-found-icon"></i>
          <h1 className="text-4xl font-bold mb-4" data-name="not-found-title">404 - Page Not Found</h1>
          <p className="text-xl opacity-70 mb-8" data-name="not-found-description">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <a href="/" className="btn btn-primary" data-name="home-link">
            Return to Home
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error('NotFound page error:', error);
    reportError(error);
    return null;
  }
}
