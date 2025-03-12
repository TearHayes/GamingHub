function Discover() {
  try {
    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    
    // Get category from URL if present
    React.useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      
      if (categoryParam) {
        setSelectedCategory(categoryParam.toLowerCase());
      }
    }, []);
    
    // Load products and categories
    React.useEffect(() => {
      try {
        const allProducts = getProducts();
        const allCategories = getCategories();
        
        setProducts(allProducts);
        setCategories(allCategories);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    }, []);
    
    const handleCategorySelect = (category) => {
      setSelectedCategory(category);
      
      // Update URL without page reload
      const url = new URL(window.location);
      if (category) {
        url.searchParams.set('category', category);
      } else {
        url.searchParams.delete('category');
      }
      window.history.pushState({}, '', url);
    };
    
    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };
    
    // Filter products by category and search term
    const filteredProducts = products.filter(product => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
    
    return (
      <div className="container mx-auto px-4 py-8" data-name="discover-page">
        <h1 className="text-3xl font-bold mb-6" data-name="discover-title">Discover Products</h1>
        
        <div className="mb-6" data-name="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products..."
            className="form-input w-full md:w-1/2"
            data-name="search-input"
          />
        </div>
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        
        {isLoading ? (
          <div className="flex justify-center py-12" data-name="loading">
            <div className="spinner"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 opacity-70" data-name="no-products">
            <i className="fas fa-search text-4xl mb-4"></i>
            <p className="text-xl">No products found</p>
            {selectedCategory && (
              <button 
                onClick={() => handleCategorySelect(null)}
                className="mt-4 btn btn-outline"
                data-name="clear-filter-btn"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid" data-name="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Discover page error:', error);
    reportError(error);
    return null;
  }
}
