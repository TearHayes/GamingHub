function Profile() {
  try {
    const [currentUser, setCurrentUser] = React.useState(getCurrentUser());
    const [activeTab, setActiveTab] = React.useState('settings');
    const [userProducts, setUserProducts] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showCreateForm, setShowCreateForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
      name: '',
      description: '',
      category: '',
      image: '',
      downloadUrl: '#'
    });
    const [formError, setFormError] = React.useState('');
    const [formSuccess, setFormSuccess] = React.useState('');
    
    // Redirect if not logged in
    React.useEffect(() => {
      if (!currentUser) {
        window.location.href = '/';
      }
    }, [currentUser]);
    
    // Load user's products
    React.useEffect(() => {
      if (currentUser) {
        try {
          const allProducts = getProducts();
          const userOwnedProducts = allProducts.filter(product => product.createdBy === currentUser.id);
          setUserProducts(userOwnedProducts);
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading user products:', error);
          setIsLoading(false);
        }
      }
    }, [currentUser]);
    
    const handleUserUpdate = (updatedUser) => {
      setCurrentUser(updatedUser);
      window.dispatchEvent(new Event('auth-change'));
    };
    
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
    
    const handleCreateProduct = (e) => {
      e.preventDefault();
      setFormError('');
      setFormSuccess('');
      
      // Validate form
      if (!formData.name || !formData.description || !formData.category || !formData.image) {
        setFormError('All fields are required');
        return;
      }
      
      try {
        const result = createProduct(formData, currentUser);
        
        if (result.success) {
          setUserProducts([...userProducts, result.product]);
          setFormSuccess('Product created successfully');
          
          // Reset form
          setFormData({
            name: '',
            description: '',
            category: '',
            image: '',
            downloadUrl: '#'
          });
          
          // Close form after a delay
          setTimeout(() => {
            setShowCreateForm(false);
            setFormSuccess('');
          }, 2000);
        } else {
          setFormError(result.error);
        }
      } catch (error) {
        console.error('Error creating product:', error);
        setFormError('An unexpected error occurred');
      }
    };
    
    const handleDeleteProduct = (productId) => {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          const result = deleteProduct(productId, currentUser);
          
          if (result.success) {
            setUserProducts(userProducts.filter(p => p.id !== productId));
            setFormSuccess('Product deleted successfully');
            
            setTimeout(() => {
              setFormSuccess('');
            }, 3000);
          } else {
            setFormError(result.error);
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          setFormError('An unexpected error occurred');
        }
      }
    };
    
    if (!currentUser) {
      return null;
    }
    
    return (
      <div className="container mx-auto px-4 py-8" data-name="profile-page">
        <div className="profile-container" data-name="profile-container">
          <div className="profile-header" data-name="profile-header">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.username} 
              className="profile-avatar"
              data-name="profile-avatar"
            />
            
            <div>
              <h1 className="profile-name" data-name="profile-name">{currentUser.username}</h1>
              <div className="mt-1" data-name="profile-email">{currentUser.email}</div>
              <div className={`profile-rank profile-rank-${currentUser.rank.toLowerCase()}`} data-name="profile-rank">
                {currentUser.rank}
              </div>
            </div>
          </div>
          
          <div className="profile-tabs" data-name="profile-tabs">
            <div 
              className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`} 
              onClick={() => handleTabChange('settings')}
              data-name="settings-tab"
            >
              Settings
            </div>
            
            {isCreator(currentUser) && (
              <div 
                className={`profile-tab ${activeTab === 'products' ? 'active' : ''}`} 
                onClick={() => handleTabChange('products')}
                data-name="products-tab"
              >
                My Products
              </div>
            )}
          </div>
          
          <div className={`profile-section ${activeTab === 'settings' ? 'active' : ''}`} data-name="settings-section">
            <ProfileSettings user={currentUser} onUpdate={handleUserUpdate} />
          </div>
          
          {isCreator(currentUser) && (
            <div className={`profile-section ${activeTab === 'products' ? 'active' : ''}`} data-name="products-section">
              {formSuccess && <Alert type="success" message={formSuccess} />}
              {formError && <Alert type="error" message={formError} />}
              
              <div className="flex justify-between items-center mb-6" data-name="products-header">
                <h2 className="text-2xl font-bold" data-name="products-title">My Products</h2>
                
                <button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="btn btn-primary"
                  data-name="create-product-btn"
                >
                  {showCreateForm ? 'Cancel' : 'Create Product'}
                </button>
              </div>
              
              {showCreateForm && (
                <div className="card p-6 mb-8" data-name="create-product-form">
                  <h3 className="text-xl font-bold mb-4" data-name="form-title">Create New Product</h3>
                  
                  <form onSubmit={handleCreateProduct} className="product-create-form" data-name="product-form">
                    <div className="form-group" data-name="name-group">
                      <label className="form-label" data-name="name-label">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter product name"
                        data-name="name-input"
                      />
                    </div>
                    
                    <div className="form-group" data-name="description-group">
                      <label className="form-label" data-name="description-label">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-textarea"
                        placeholder="Enter product description"
                        data-name="description-input"
                      ></textarea>
                    </div>
                    
                    <div className="form-group" data-name="category-group">
                      <label className="form-label" data-name="category-label">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="form-select"
                        data-name="category-input"
                      >
                        <option value="">-- Select Category --</option>
                        {getCategories().map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group" data-name="image-group">
                      <label className="form-label" data-name="image-label">Image URL</label>
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter image URL"
                        data-name="image-input"
                      />
                      <p className="text-xs opacity-70 mt-1" data-name="image-help">
                        Use a direct link to an image (e.g., from Unsplash)
                      </p>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary mt-4"
                      data-name="submit-product-btn"
                    >
                      Create Product
                    </button>
                  </form>
                </div>
              )}
              
              {isLoading ? (
                <div className="flex justify-center py-8" data-name="products-loading">
                  <div className="spinner"></div>
                </div>
              ) : userProducts.length === 0 ? (
                <div className="text-center py-8 opacity-70" data-name="no-products">
                  <i className="fas fa-box-open text-4xl mb-4"></i>
                  <p>You haven't created any products yet</p>
                </div>
              ) : (
                <div className="space-y-4" data-name="user-products-list">
                  {userProducts.map(product => (
                    <div 
                      key={product.id} 
                      className="card p-4 flex items-center justify-between"
                      data-name={`product-item-${product.id}`}
                    >
                      <div className="flex items-center" data-name="product-info">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover rounded-md mr-4"
                          data-name="product-thumbnail"
                        />
                        <div>
                          <h3 className="font-semibold" data-name="product-name">{product.name}</h3>
                          <p className="text-sm opacity-70" data-name="product-category">
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2" data-name="product-actions">
                        <a 
                          href={`/product/${product.id}`} 
                          className="btn btn-outline"
                          data-name="view-product-link"
                        >
                          View
                        </a>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="btn btn-outline text-red-500"
                          data-name="delete-product-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Profile page error:', error);
    reportError(error);
    return null;
  }
}
