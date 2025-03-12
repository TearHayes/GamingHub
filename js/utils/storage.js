function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Product management
function getProducts() {
  try {
    return JSON.parse(localStorage.getItem('products') || '[]');
  } catch (error) {
    console.error('Get products error:', error);
    return [];
  }
}

function getProduct(productId) {
  try {
    const products = getProducts();
    return products.find(product => product.id === productId) || null;
  } catch (error) {
    console.error('Get product error:', error);
    return null;
  }
}

function createProduct(productData, user) {
  try {
    if (!user || !isCreator(user)) {
      return { success: false, error: 'You do not have permission to create products' };
    }
    
    const products = getProducts();
    const newProduct = {
      id: generateId(),
      ...productData,
      status: 'working',
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      creatorName: user.username,
      downloadCount: 0
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    return { success: true, product: newProduct };
  } catch (error) {
    console.error('Create product error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function updateProduct(productId, updates, user) {
  try {
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return { success: false, error: 'Product not found' };
    }
    
    const product = products[productIndex];
    
    // Only creator or developer can update
    if (!isDeveloper(user) && product.createdBy !== user.id) {
      return { success: false, error: 'You do not have permission to update this product' };
    }
    
    products[productIndex] = { 
      ...product, 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    localStorage.setItem('products', JSON.stringify(products));
    
    return { success: true, product: products[productIndex] };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function deleteProduct(productId, user) {
  try {
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return { success: false, error: 'Product not found' };
    }
    
    const product = products[productIndex];
    
    // Only creator or developer can delete
    if (!isDeveloper(user) && product.createdBy !== user.id) {
      return { success: false, error: 'You do not have permission to delete this product' };
    }
    
    products.splice(productIndex, 1);
    localStorage.setItem('products', JSON.stringify(products));
    
    return { success: true };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function incrementDownloadCount(productId) {
  try {
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return { success: false, error: 'Product not found' };
    }
    
    products[productIndex].downloadCount = (products[productIndex].downloadCount || 0) + 1;
    localStorage.setItem('products', JSON.stringify(products));
    
    return { success: true, product: products[productIndex] };
  } catch (error) {
    console.error('Increment download count error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Category management
function getCategories() {
  try {
    const defaultCategories = [
      'valorant', 'fortnite', 'counter strike', 'apex legends', 
      'roblox scripts', 'roblox injectors', 'bypass', 'gta v', 'minecraft'
    ];
    
    const categories = JSON.parse(localStorage.getItem('categories') || JSON.stringify(defaultCategories));
    return categories;
  } catch (error) {
    console.error('Get categories error:', error);
    return [];
  }
}

function addCategory(category, user) {
  try {
    if (!isDeveloper(user)) {
      return { success: false, error: 'You do not have permission to add categories' };
    }
    
    const categories = getCategories();
    
    // Check if category already exists
    if (categories.includes(category.toLowerCase())) {
      return { success: false, error: 'Category already exists' };
    }
    
    categories.push(category.toLowerCase());
    localStorage.setItem('categories', JSON.stringify(categories));
    
    return { success: true, categories };
  } catch (error) {
    console.error('Add category error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function removeCategory(category, user) {
  try {
    if (!isDeveloper(user)) {
      return { success: false, error: 'You do not have permission to remove categories' };
    }
    
    const categories = getCategories();
    const index = categories.indexOf(category.toLowerCase());
    
    if (index === -1) {
      return { success: false, error: 'Category not found' };
    }
    
    categories.splice(index, 1);
    localStorage.setItem('categories', JSON.stringify(categories));
    
    return { success: true, categories };
  } catch (error) {
    console.error('Remove category error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Comment management
function getComments(productId) {
  try {
    const commentsKey = `comments_${productId}`;
    return JSON.parse(localStorage.getItem(commentsKey) || '[]');
  } catch (error) {
    console.error('Get comments error:', error);
    return [];
  }
}

function addComment(productId, commentText, user) {
  try {
    if (!user) {
      return { success: false, error: 'You must be logged in to comment' };
    }
    
    const commentsKey = `comments_${productId}`;
    const comments = getComments(productId);
    
    const newComment = {
      id: generateId(),
      text: commentText,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    comments.push(newComment);
    localStorage.setItem(commentsKey, JSON.stringify(comments));
    
    return { success: true, comment: newComment };
  } catch (error) {
    console.error('Add comment error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function addReply(productId, commentId, replyText, user) {
  try {
    if (!user) {
      return { success: false, error: 'You must be logged in to reply' };
    }
    
    const commentsKey = `comments_${productId}`;
    const comments = getComments(productId);
    
    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) {
      return { success: false, error: 'Comment not found' };
    }
    
    const newReply = {
      id: generateId(),
      text: replyText,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      createdAt: new Date().toISOString()
    };
    
    comments[commentIndex].replies.push(newReply);
    localStorage.setItem(commentsKey, JSON.stringify(comments));
    
    return { success: true, reply: newReply };
  } catch (error) {
    console.error('Add reply error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Initialize default data if not exists
function initializeDefaultData() {
  try {
    // Check if users exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.length === 0) {
      // Create owner/admin user
      const adminUser = {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // In a real app, this should be hashed
        createdAt: new Date().toISOString(),
        rank: 'Developer',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=random&color=fff&size=128'
      };
      
      localStorage.setItem('users', JSON.stringify([adminUser]));
    }
    
    // Check if products exist
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    if (products.length === 0) {
      // Create sample products
      const sampleProducts = [
        {
          id: generateId(),
          name: 'Valorant Aimbot',
          description: 'Advanced aimbot for Valorant with customizable settings.',
          category: 'valorant',
          image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
          downloadUrl: '#',
          status: 'working',
          createdAt: new Date().toISOString(),
          createdBy: '1',
          creatorName: 'admin',
          downloadCount: 42
        },
        {
          id: generateId(),
          name: 'Fortnite ESP Hack',
          description: 'See enemies through walls and get an advantage in Fortnite.',
          category: 'fortnite',
          image: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
          downloadUrl: '#',
          status: 'working',
          createdAt: new Date().toISOString(),
          createdBy: '1',
          creatorName: 'admin',
          downloadCount: 37
        },
        {
          id: generateId(),
          name: 'Counter Strike Wallhack',
          description: 'Premium wallhack for CS with anti-detection features.',
          category: 'counter strike',
          image: 'https://images.unsplash.com/photo-1614294162358-e2351767b20a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          downloadUrl: '#',
          status: 'working',
          createdAt: new Date().toISOString(),
          createdBy: '1',
          creatorName: 'admin',
          downloadCount: 53
        }
      ];
      
      localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
    
    // Initialize categories if they don't exist
    if (!localStorage.getItem('categories')) {
      const defaultCategories = [
        'valorant', 'fortnite', 'counter strike', 'apex legends', 
        'roblox scripts', 'roblox injectors', 'bypass', 'gta v', 'minecraft'
      ];
      
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
    
  } catch (error) {
    console.error('Initialize default data error:', error);
  }
}
