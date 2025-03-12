function ProductCard({ product }) {
  try {
    if (!product) return null;
    
    return (
      <div className="product-card" data-name="product-card">
        <div className="relative" data-name="product-image-container">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image" 
            data-name="product-image"
          />
          
          <div className="status-badge" data-name="product-status">
            <span className="badge badge-success">
              {product.status}
            </span>
          </div>
        </div>
        
        <div className="product-content" data-name="product-content">
          <h3 className="product-title" data-name="product-title">{product.name}</h3>
          <p className="product-description" data-name="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description}
          </p>
          
          <div className="flex justify-between items-center" data-name="product-footer">
            <span className="text-sm opacity-70" data-name="product-downloads">
              <i className="fas fa-download mr-1"></i> {product.downloadCount || 0}
            </span>
            
            <a 
              href={`/product/${product.id}`} 
              className="btn btn-primary"
              data-name="view-product-btn"
            >
              View Product
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Product card error:', error);
    reportError(error);
    return null;
  }
}
