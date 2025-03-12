function Home() {
  try {
    const [featuredProducts, setFeaturedProducts] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
      // Apply theme on page load
      const theme = getTheme();
      applyTheme(theme);
      
      // Initialize default data if not exists
      initializeDefaultData();
      
      // Load featured products
      const allProducts = getProducts();
      
      // Sort by download count and take top 3
      const featured = allProducts
        .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
        .slice(0, 3);
      
      setFeaturedProducts(featured);
      setIsLoading(false);
    }, []);
    
    return (
      <div className="container mx-auto px-4 py-8" data-name="home-page">
        <div className="text-center mb-12" data-name="hero-section">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-name="hero-title">
            Welcome to GamingHub
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto" data-name="hero-description">
            Discover premium game enhancements, scripts, and tools for your favorite games. 
            Join our community of gamers and take your gaming experience to the next level.
          </p>
          <div className="mt-8" data-name="hero-cta">
            <a href="/discover" className="btn btn-primary text-lg px-8 py-3" data-name="discover-cta">
              Explore Products
            </a>
            <a 
              href="https://discord.gg/your-server-id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline ml-4 text-lg px-8 py-3"
              data-name="discord-cta"
            >
              Join Discord
            </a>
          </div>
        </div>
        
        <div className="mt-16" data-name="featured-section">
          <h2 className="text-2xl font-bold mb-6" data-name="featured-title">Featured Products</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12" data-name="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid" data-name="featured-products">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8" data-name="view-all">
            <a href="/discover" className="btn btn-outline" data-name="view-all-btn">
              View All Products
            </a>
          </div>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8" data-name="features-section">
          <div className="text-center p-6" data-name="feature-1">
            <div className="text-4xl mb-4 text-primary" data-name="feature-1-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3 className="text-xl font-bold mb-2" data-name="feature-1-title">Safe & Secure</h3>
            <p className="opacity-80" data-name="feature-1-description">
              All our products are regularly tested and updated to ensure they're safe to use and undetected.
            </p>
          </div>
          
          <div className="text-center p-6" data-name="feature-2">
            <div className="text-4xl mb-4 text-primary" data-name="feature-2-icon">
              <i className="fas fa-gamepad"></i>
            </div>
            <h3 className="text-xl font-bold mb-2" data-name="feature-2-title">Multiple Games</h3>
            <p className="opacity-80" data-name="feature-2-description">
              We support a wide range of popular games including Valorant, Fortnite, Counter Strike and more.
            </p>
          </div>
          
          <div className="text-center p-6" data-name="feature-3">
            <div className="text-4xl mb-4 text-primary" data-name="feature-3-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3 className="text-xl font-bold mb-2" data-name="feature-3-title">Active Community</h3>
            <p className="opacity-80" data-name="feature-3-description">
              Join our Discord community for support, updates, and to connect with other members.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Home page error:', error);
    reportError(error);
    return null;
  }
}
