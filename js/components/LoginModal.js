function LoginModal({ onClose, onSwitchToRegister, onForgotPassword }) {
  try {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
      
      try {
        const result = loginUser(username, password);
        
        if (result.success) {
          // Update auth state throughout the app
          window.dispatchEvent(new Event('auth-change'));
          onClose();
        } else {
          setError(result.error);
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Close modal when pressing Escape
    React.useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [onClose]);
    
    // Prevent scrolling on the body when modal is open
    React.useEffect(() => {
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);
    
    return (
      <div 
        className="auth-modal"
        onClick={onClose}
        data-name="login-modal"
      >
        <div 
          className="auth-modal-content"
          onClick={(e) => e.stopPropagation()}
          data-name="login-modal-content"
        >
          <button 
            className="auth-modal-close"
            onClick={onClose}
            data-name="login-modal-close"
          >
            <i className="fas fa-times"></i>
          </button>
          
          <h2 className="text-2xl font-bold mb-6" data-name="login-modal-title">Login</h2>
          
          <form onSubmit={handleSubmit} className="auth-form" data-name="login-form">
            <div className="auth-form-group" data-name="username-group">
              <label htmlFor="username" className="auth-form-label">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-form-input"
                placeholder="Enter your username"
                data-name="username-input"
              />
            </div>
            
            <div className="auth-form-group" data-name="password-group">
              <label htmlFor="password" className="auth-form-label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-form-input"
                placeholder="Enter your password"
                data-name="password-input"
              />
            </div>
            
            <div className="text-right">
              <span 
                className="text-sm text-blue-500 cursor-pointer hover:underline"
                onClick={onForgotPassword}
                data-name="forgot-password-link"
              >
                Forgot password?
              </span>
            </div>
            
            {error && <div className="auth-error" data-name="login-error">{error}</div>}
            
            <button 
              type="submit" 
              className="auth-form-submit" 
              disabled={isLoading}
              data-name="login-submit"
            >
              {isLoading ? (
                <React.Fragment>
                  <div className="spinner"></div>
                  <span>Logging in...</span>
                </React.Fragment>
              ) : (
                <span>Login</span>
              )}
            </button>
            
            <div className="auth-switch" data-name="auth-switch">
              <p>
                Don't have an account? {' '}
                <span 
                  className="auth-switch-link"
                  onClick={onSwitchToRegister}
                  data-name="switch-to-register"
                >
                  Register
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Login modal error:', error);
    reportError(error);
    return null;
  }
}
