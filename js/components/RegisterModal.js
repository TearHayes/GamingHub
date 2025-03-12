function RegisterModal({ onClose, onSwitchToLogin }) {
  try {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      // Validate password match
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      setIsLoading(true);
      
      try {
        const result = registerUser(username, email, password);
        
        if (result.success) {
          // Auto login after registration
          const loginResult = loginUser(username, password);
          
          if (loginResult.success) {
            // Update auth state throughout the app
            window.dispatchEvent(new Event('auth-change'));
            onClose();
          } else {
            // Registration successful but login failed
            setError('Registration successful. Please login.');
            onSwitchToLogin();
          }
        } else {
          setError(result.error);
        }
      } catch (error) {
        console.error('Registration error:', error);
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
        data-name="register-modal"
      >
        <div 
          className="auth-modal-content"
          onClick={(e) => e.stopPropagation()}
          data-name="register-modal-content"
        >
          <button 
            className="auth-modal-close"
            onClick={onClose}
            data-name="register-modal-close"
          >
            <i className="fas fa-times"></i>
          </button>
          
          <h2 className="text-2xl font-bold mb-6" data-name="register-modal-title">Create an Account</h2>
          
          <form onSubmit={handleSubmit} className="auth-form" data-name="register-form">
            <div className="auth-form-group" data-name="username-group">
              <label htmlFor="reg-username" className="auth-form-label">Username</label>
              <input
                type="text"
                id="reg-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-form-input"
                placeholder="Choose a username"
                data-name="username-input"
              />
            </div>
            
            <div className="auth-form-group" data-name="email-group">
              <label htmlFor="email" className="auth-form-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-form-input"
                placeholder="Enter your email"
                data-name="email-input"
              />
            </div>
            
            <div className="auth-form-group" data-name="password-group">
              <label htmlFor="reg-password" className="auth-form-label">Password</label>
              <input
                type="password"
                id="reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-form-input"
                placeholder="Create a password"
                data-name="password-input"
              />
            </div>
            
            <div className="auth-form-group" data-name="confirm-password-group">
              <label htmlFor="confirm-password" className="auth-form-label">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-form-input"
                placeholder="Confirm your password"
                data-name="confirm-password-input"
              />
            </div>
            
            {error && <div className="auth-error" data-name="register-error">{error}</div>}
            
            <button 
              type="submit" 
              className="auth-form-submit" 
              disabled={isLoading}
              data-name="register-submit"
            >
              {isLoading ? (
                <React.Fragment>
                  <div className="spinner"></div>
                  <span>Creating account...</span>
                </React.Fragment>
              ) : (
                <span>Register</span>
              )}
            </button>
            
            <div className="auth-switch" data-name="auth-switch">
              <p>
                Already have an account? {' '}
                <span 
                  className="auth-switch-link"
                  onClick={onSwitchToLogin}
                  data-name="switch-to-login"
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Register modal error:', error);
    reportError(error);
    return null;
  }
}
