function Header() {
  try {
    const [currentUser, setCurrentUser] = React.useState(getCurrentUser());
    const [showLogin, setShowLogin] = React.useState(false);
    const [showRegister, setShowRegister] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [showForgotPassword, setShowForgotPassword] = React.useState(false);
    
    // Subscribe to auth changes
    React.useEffect(() => {
      const checkAuth = () => {
        setCurrentUser(getCurrentUser());
      };
      
      window.addEventListener('auth-change', checkAuth);
      
      return () => {
        window.removeEventListener('auth-change', checkAuth);
      };
    }, []);
    
    const handleLogout = () => {
      logoutUser();
      setCurrentUser(null);
      setIsMenuOpen(false);
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('auth-change'));
    };
    
    const handleLogin = () => {
      setShowLogin(true);
      setIsMenuOpen(false);
    };
    
    const handleRegister = () => {
      setShowRegister(true);
      setIsMenuOpen(false);
    };
    
    const handleForgotPassword = () => {
      setShowForgotPassword(true);
      setShowLogin(false);
    };
    
    const handleThemeToggle = () => {
      toggleTheme();
      
      // Force re-render
      setCurrentUser({...currentUser});
    };
    
    const currentTheme = getTheme();
    const path = window.location.pathname;
    
    return (
      <React.Fragment>
        <header data-name="header" className="py-4 border-b dark:border-gray-800">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <a href="/" data-name="logo" className="text-2xl font-bold">
              <i className="fas fa-gamepad mr-2"></i>
              GamingHub
            </a>
            
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="/" 
                data-name="home-link"
                className={`nav-link ${path === '/' || path === '' ? 'active' : ''}`}
              >
                Home
              </a>
              <a 
                href="/discover" 
                data-name="discover-link"
                className={`nav-link ${path.includes('/discover') ? 'active' : ''}`}
              >
                Discover
              </a>
              
              <a 
                href="https://discord.gg/your-server-id" 
                target="_blank" 
                rel="noopener noreferrer" 
                data-name="discord-link"
                className={`nav-link flex items-center`}
              >
                <i className="fab fa-discord mr-1"></i>
                Discord
              </a>
              
              <button 
                onClick={handleThemeToggle} 
                data-name="theme-toggle"
                className="theme-toggle"
                aria-label="Toggle theme"
              >
                {currentTheme === 'dark' ? (
                  <i className="fas fa-sun"></i>
                ) : (
                  <i className="fas fa-moon"></i>
                )}
              </button>
              
              {currentUser ? (
                <div className="relative" data-name="user-menu">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2"
                    data-name="user-menu-button"
                  >
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.username} 
                      className="w-8 h-8 rounded-full"
                      data-name="user-avatar"
                    />
                    <span data-name="username">{currentUser.username}</span>
                    <i className={`fas fa-chevron-${isMenuOpen ? 'up' : 'down'}`}></i>
                  </button>
                  
                  {isMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 py-2 border rounded-md shadow-lg z-50"
                      data-name="user-dropdown"
                    >
                      <div className="dark:bg-gray-800 bg-white rounded-md">
                        <a 
                          href="/profile" 
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          data-name="profile-link"
                        >
                          <i className="fas fa-user mr-2"></i>
                          Profile
                        </a>
                        {isDeveloper(currentUser) && (
                          <a 
                            href="/admin" 
                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            data-name="admin-link"
                          >
                            <i className="fas fa-cog mr-2"></i>
                            Admin Panel
                          </a>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          data-name="logout-button"
                        >
                          <i className="fas fa-sign-out-alt mr-2"></i>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2" data-name="auth-buttons">
                  <button 
                    onClick={handleLogin}
                    className="login-button"
                    data-name="login-button"
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </button>
                  <button 
                    onClick={handleRegister}
                    className="btn btn-primary"
                    data-name="register-button"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
            
            <button 
              className="md:hidden text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-name="mobile-menu-button"
            >
              <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
            </button>
          </div>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t dark:border-gray-800" data-name="mobile-menu">
              <div className="container mx-auto px-4 flex flex-col space-y-4">
                <a 
                  href="/" 
                  className={`nav-link ${path === '/' || path === '' ? 'active' : ''}`}
                  data-name="mobile-home-link"
                >
                  Home
                </a>
                <a 
                  href="/discover" 
                  className={`nav-link ${path.includes('/discover') ? 'active' : ''}`}
                  data-name="mobile-discover-link"
                >
                  Discover
                </a>
                
                <a 
                  href="https://discord.gg/your-server-id" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="nav-link flex items-center"
                  data-name="mobile-discord-link"
                >
                  <i className="fab fa-discord mr-1"></i>
                  Discord
                </a>
                
                <button 
                  onClick={handleThemeToggle}
                  className="flex items-center space-x-2"
                  data-name="mobile-theme-toggle"
                >
                  {currentTheme === 'dark' ? (
                    <React.Fragment>
                      <i className="fas fa-sun"></i>
                      <span>Light Theme</span>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <i className="fas fa-moon"></i>
                      <span>Dark Theme</span>
                    </React.Fragment>
                  )}
                </button>
                
                {currentUser ? (
                  <React.Fragment>
                    <div className="flex items-center space-x-2 py-2" data-name="mobile-user-info">
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.username} 
                        className="w-8 h-8 rounded-full"
                        data-name="mobile-user-avatar"
                      />
                      <span data-name="mobile-username">{currentUser.username}</span>
                    </div>
                    
                    <a 
                      href="/profile" 
                      className="nav-link"
                      data-name="mobile-profile-link"
                    >
                      <i className="fas fa-user mr-2"></i>
                      Profile
                    </a>
                    
                    {isDeveloper(currentUser) && (
                      <a 
                        href="/admin" 
                        className="nav-link"
                        data-name="mobile-admin-link"
                      >
                        <i className="fas fa-cog mr-2"></i>
                        Admin Panel
                      </a>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="nav-link text-left w-full"
                      data-name="mobile-logout-button"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </button>
                  </React.Fragment>
                ) : (
                  <div className="flex flex-col space-y-2" data-name="mobile-auth-buttons">
                    <button 
                      onClick={handleLogin}
                      className="login-button"
                      data-name="mobile-login-button"
                    >
                      <i className="fas fa-sign-in-alt"></i>
                      Login
                    </button>
                    <button 
                      onClick={handleRegister}
                      className="btn btn-primary"
                      data-name="mobile-register-button"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
        
        {showLogin && <LoginModal 
          onClose={() => setShowLogin(false)} 
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onForgotPassword={handleForgotPassword}
        />}
        
        {showRegister && <RegisterModal 
          onClose={() => setShowRegister(false)} 
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }} 
        />}
        
        {showForgotPassword && <ForgotPasswordModal 
          onClose={() => setShowForgotPassword(false)}
          onSwitchToLogin={() => {
            setShowForgotPassword(false);
            setShowLogin(true);
          }}
        />}
      </React.Fragment>
    );
  } catch (error) {
    console.error('Header component error:', error);
    reportError(error);
    return null;
  }
}
