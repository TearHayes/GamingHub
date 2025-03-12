function AdminPanel() {
  try {
    const [currentUser, setCurrentUser] = React.useState(getCurrentUser());
    const [users, setUsers] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [newRank, setNewRank] = React.useState('');
    const [alert, setAlert] = React.useState(null);
    const [categories, setCategories] = React.useState([]);
    const [newCategory, setNewCategory] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('users');
    
    // Check if user is developer
    React.useEffect(() => {
      if (!currentUser || !isDeveloper(currentUser)) {
        window.location.href = '/';
      }
    }, [currentUser]);
    
    // Load users
    React.useEffect(() => {
      try {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        // Remove passwords for security
        const usersWithoutPasswords = allUsers.map(user => ({
          ...user,
          password: undefined
        }));
        setUsers(usersWithoutPasswords);
      } catch (error) {
        console.error('Error loading users:', error);
        setAlert({
          type: 'error',
          message: 'Failed to load users'
        });
      }
    }, []);
    
    // Load categories
    React.useEffect(() => {
      try {
        const allCategories = getCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        setAlert({
          type: 'error',
          message: 'Failed to load categories'
        });
      }
    }, []);
    
    const handlePromoteUser = () => {
      if (!selectedUser || !newRank) {
        setAlert({
          type: 'error',
          message: 'Please select a user and rank'
        });
        return;
      }
      
      try {
        const result = promoteUser(selectedUser.id, newRank);
        
        if (result.success) {
          // Update users list
          const updatedUsers = users.map(user => {
            if (user.id === selectedUser.id) {
              return { ...user, rank: newRank };
            }
            return user;
          });
          
          setUsers(updatedUsers);
          setSelectedUser(null);
          setNewRank('');
          
          setAlert({
            type: 'success',
            message: `User ${selectedUser.username} has been promoted to ${newRank}`
          });
        } else {
          setAlert({
            type: 'error',
            message: result.error
          });
        }
      } catch (error) {
        console.error('Error promoting user:', error);
        setAlert({
          type: 'error',
          message: 'An error occurred while promoting user'
        });
      }
    };
    
    const handleAddCategory = () => {
      if (!newCategory.trim()) {
        setAlert({
          type: 'error',
          message: 'Please enter a category name'
        });
        return;
      }
      
      try {
        const result = addCategory(newCategory, currentUser);
        
        if (result.success) {
          setCategories(result.categories);
          setNewCategory('');
          
          setAlert({
            type: 'success',
            message: `Category "${newCategory}" has been added`
          });
        } else {
          setAlert({
            type: 'error',
            message: result.error
          });
        }
      } catch (error) {
        console.error('Error adding category:', error);
        setAlert({
          type: 'error',
          message: 'An error occurred while adding category'
        });
      }
    };
    
    const handleRemoveCategory = (category) => {
      try {
        const result = removeCategory(category, currentUser);
        
        if (result.success) {
          setCategories(result.categories);
          
          setAlert({
            type: 'success',
            message: `Category "${category}" has been removed`
          });
        } else {
          setAlert({
            type: 'error',
            message: result.error
          });
        }
      } catch (error) {
        console.error('Error removing category:', error);
        setAlert({
          type: 'error',
          message: 'An error occurred while removing category'
        });
      }
    };
    
    return (
      <div className="container mx-auto px-4 py-8" data-name="admin-panel">
        <h1 className="text-3xl font-bold mb-6" data-name="admin-title">Admin Panel</h1>
        
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)}
          />
        )}
        
        <div className="mb-6 border-b" data-name="admin-tabs">
          <div className="flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-primary font-semibold' : 'opacity-70'}`}
              data-name="users-tab"
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-4 ${activeTab === 'categories' ? 'border-b-2 border-primary font-semibold' : 'opacity-70'}`}
              data-name="categories-tab"
            >
              Manage Categories
            </button>
          </div>
        </div>
        
        {activeTab === 'users' && (
          <div className="card p-6" data-name="users-panel">
            <h2 className="text-xl font-semibold mb-4" data-name="users-title">Manage Users</h2>
            
            <div className="mb-6" data-name="user-selection">
              <label className="block mb-2 font-semibold">Select User</label>
              <select
                value={selectedUser ? selectedUser.id : ''}
                onChange={(e) => {
                  const user = users.find(u => u.id === e.target.value);
                  setSelectedUser(user || null);
                }}
                className="form-select"
                data-name="user-select"
              >
                <option value="">-- Select User --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username} - {user.rank}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedUser && (
              <div className="mb-6" data-name="user-details">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.username}
                    className="w-16 h-16 rounded-full"
                    data-name="selected-user-avatar"
                  />
                  <div>
                    <h3 className="font-semibold" data-name="selected-user-name">{selectedUser.username}</h3>
                    <p className="text-sm opacity-70" data-name="selected-user-email">{selectedUser.email}</p>
                    <div className="mt-1" data-name="selected-user-rank">
                      <span className={`profile-rank profile-rank-${selectedUser.rank.toLowerCase()}`}>
                        {selectedUser.rank}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4" data-name="user-promotion">
                  <select
                    value={newRank}
                    onChange={(e) => setNewRank(e.target.value)}
                    className="form-select"
                    data-name="rank-select"
                  >
                    <option value="">-- Select New Rank --</option>
                    <option value="Cheater">Cheater</option>
                    <option value="Creator">Creator</option>
                    {currentUser && currentUser.id === '1' && (
                      <option value="Developer">Developer</option>
                    )}
                  </select>
                  
                  <button
                    onClick={handlePromoteUser}
                    className="btn btn-primary"
                    disabled={!newRank}
                    data-name="promote-button"
                  >
                    Update Rank
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-8" data-name="users-list">
              <h3 className="font-semibold mb-2" data-name="users-list-title">All Users</h3>
              
              <div className="overflow-x-auto" data-name="users-table-container">
                <table className="w-full" data-name="users-table">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Username</th>
                      <th className="py-2 text-left">Email</th>
                      <th className="py-2 text-left">Rank</th>
                      <th className="py-2 text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b">
                        <td className="py-2">{user.username}</td>
                        <td className="py-2">{user.email}</td>
                        <td className="py-2">
                          <span className={`profile-rank profile-rank-${user.rank.toLowerCase()}`}>
                            {user.rank}
                          </span>
                        </td>
                        <td className="py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div className="card p-6" data-name="categories-panel">
            <h2 className="text-xl font-semibold mb-4" data-name="categories-title">Manage Categories</h2>
            
            <div className="mb-6 flex gap-4" data-name="add-category">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="form-input flex-grow"
                placeholder="Enter new category name"
                data-name="category-input"
              />
              
              <button
                onClick={handleAddCategory}
                className="btn btn-primary"
                disabled={!newCategory.trim()}
                data-name="add-category-button"
              >
                Add Category
              </button>
            </div>
            
            <div className="mt-8" data-name="categories-list">
              <h3 className="font-semibold mb-2" data-name="categories-list-title">All Categories</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-name="categories-grid">
                {categories.map(category => (
                  <div 
                    key={category} 
                    className="flex justify-between items-center p-3 border rounded-md"
                    data-name={`category-item-${category}`}
                  >
                    <span className="capitalize" data-name="category-name">{category}</span>
                    
                    <button
                      onClick={() => handleRemoveCategory(category)}
                      className="text-red-500 hover:text-red-700"
                      data-name="remove-category-button"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('AdminPanel error:', error);
    reportError(error);
    return null;
  }
}
