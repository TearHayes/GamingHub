function ProductDetail() {
  try {
    const [product, setProduct] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [downloadStarted, setDownloadStarted] = React.useState(false);
    const currentUser = getCurrentUser();
    
    React.useEffect(() => {
      const loadProduct = () => {
        try {
          // Extract product ID from URL
          const pathParts = window.location.pathname.split('/');
          const productId = pathParts[pathParts.length - 1];
          
          if (!productId) {
            setError('Product not found');
            setIsLoading(false);
            return;
          }
          
          const foundProduct = getProduct(productId);
          
          if (!foundProduct) {
            setError('Product not found');
            setIsLoading(false);
            return;
          }
          
          setProduct(foundProduct);
          setIsLoading(false);
        } catch (err) {
          console.error('Error loading product:', err);
          setError('Failed to load product');
          setIsLoading(false);
        }
      };
      
      loadProduct();
    }, []);
    
    const handleDownload = () => {
      if (!currentUser) {
        setError('You must be logged in to download this product');
        return;
      }
      
      try {
        // Increment download count
        const result = incrementDownloadCount(product.id);
        
        if (result.success) {
          setProduct(result.product);
          setDownloadStarted(true);
          
          // Reset download started state after 3 seconds
          setTimeout(() => {
            setDownloadStarted(false);
          }, 3000);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error during download:', err);
        setError('Failed to start download');
      }
    };
    
    if (isLoading) {
      return (
        <div className="container mx-auto px-4 py-8" data-name="product-detail-loading">
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        </div>
      );
    }
    
    if (error || !product) {
      return (
        <div className="container mx-auto px-4 py-8" data-name="product-detail-error">
          <div className="text-center py-12">
            <i className="fas fa-exclamation-circle text-4xl mb-4 text-red-500"></i>
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="opacity-70">{error || 'Product not found'}</p>
            <a href="/discover" className="btn btn-primary mt-4" data-name="back-to-discover">
              Back to Discover
            </a>
          </div>
        </div>
      );
    }
    
    return (
      <div className="container mx-auto px-4 py-8" data-name="product-detail">
        <div className="card product-detail" data-name="product-detail-card">
          <div className="product-detail-header" data-name="product-detail-header">
            <div className="relative" data-name="product-image-wrapper">
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-detail-image"
                data-name="product-detail-image"
              />
              
              <div className="status-badge" data-name="product-status">
                <span className="badge badge-success">
                  {product.status}
                </span>
              </div>
            </div>
            
            <div className="product-detail-info" data-name="product-detail-info">
              <h1 className="product-detail-title" data-name="product-title">{product.name}</h1>
              
              <div className="mb-4 flex items-center" data-name="product-meta">
                <span className="mr-4 opacity-70" data-name="product-category">
                  <i className="fas fa-tag mr-1"></i> {product.category}
                </span>
                <span className="mr-4 opacity-70" data-name="product-downloads">
                  <i className="fas fa-download mr-1"></i> {product.downloadCount || 0} downloads
                </span>
                <span className="opacity-70" data-name="product-date">
                  <i className="fas fa-calendar mr-1"></i> {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="mb-4" data-name="product-creator">
                <span className="opacity-70">Created by: </span>
                <span className="font-semibold">{product.creatorName}</span>
              </div>
              
              <p className="product-detail-description" data-name="product-description">
                {product.description}
              </p>
              
              <button
                onClick={handleDownload}
                disabled={!currentUser || downloadStarted}
                className="download-btn mt-6"
                data-name="download-button"
              >
                {downloadStarted ? (
                  <React.Fragment>
                    <i className="fas fa-check"></i>
                    Download Started
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <i className="fas fa-download"></i>
                    Download
                  </React.Fragment>
                )}
              </button>
              
              {!currentUser && (
                <p className="text-sm opacity-70 mt-2" data-name="login-prompt">
                  You must be logged in to download this product
                </p>
              )}
              
              {error && (
                <div className="auth-error mt-4" data-name="download-error">{error}</div>
              )}
            </div>
          </div>
          
          <CommentSection productId={product.id} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('ProductDetail error:', error);
    reportError(error);
    return null;
  }
}
