function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  try {
    return (
      <div className="categories-filter" data-name="category-filter">
        <button
          onClick={() => onSelectCategory(null)}
          className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
          data-name="category-all-btn"
        >
          All
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            data-name={`category-${category}-btn`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    );
  } catch (error) {
    console.error('CategoryFilter component error:', error);
    reportError(error);
    return null;
  }
}
