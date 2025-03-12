function ForgotPasswordModal({ onClose, onSwitchToLogin }) {
  try {
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
      
      try {
        if (!email || !username) {
          setError('Please enter both username and email');
          setIsLoading(false);
          return;
        }
        
        const result = resetPassword(username, email);
        
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error);
        }
      } catch (error) {
        console.error('Password reset error:', error);
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
    
    if (success) {
      return (
        <div 
          className="auth-modal"
          onClick={onClose}
          data-name="forgot-password-modal"
        >
          <div 
            className="auth-modal-content"
            onClick={(e) => e.stopPropagation()}
            data-name="forgot-password-modal-content"
          >
            <button 
              className="auth-modal-close"
              onClick={onClose}
              data-name="forgot-password-modal-close"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="text-center py-6" data-name="success-message">
              <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
              <h2 className="text-2xl font-bold mb-2" data-name="success-title">Password Reset</h2>
              <p className="mb-6" data-name="success-description">
                A new password has been sent to your email address. Please check your inbox.
              </p>
              <button 
                onClick={onSwitchToLogin} 
                className="btn btn-primary"
                data-name="back-to-login"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div 
        className="auth-modal"
        onClick={onClose}
        data-name="forgot-password-modal"
      >
        <div 
          className="auth-modal-content"
          onClick={(e) => e.stopPropagation()}
          data-name="forgot-password-modal-content"
        >
          <button 
            className="auth-modal-close"
            onClick={onClose}
            data-name="forgot-password-modal-close"
          >
            <i className="fas fa-times"></i>
          </button>
          
          <h2 className="text-2xl font-bold mb-6" data-name="forgot-password-modal-title">Reset Password</h2>
          
          <form onSubmit={handleSubmit} className="auth-form" data-name="forgot-password-form">
            <div className="auth-form-group" data-name="username-group">
              <label htmlFor="reset-username" className="auth-form-label">Username</label>
              <input
                type="text"
                id="reset-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-form-input"
                placeholder="Enter your username"
                data-name="username-input"
              />
            </div>
            
            <div className="auth-form-group" data-name="email-group">
              <label htmlFor="reset-email" className="auth-form-label">Email</label>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-form-input"
                placeholder="Enter your email"
                data-name="email-input"
              />
            </div>
            
            {error && <div className="auth-error" data-name="reset-error">{error}</div>}
            
            <button 
              type="submit" 
              className="auth-form-submit" 
              disabled={isLoading}
              data-name="reset-submit"
            >
              {isLoading ? (
                <React.Fragment>
                  <div className="spinner"></div>
                  <span>Processing...</span>
                </React.Fragment>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
            
            <div className="auth-switch" data-name="auth-switch">
              <p>
                Remember your password? {' '}
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
    console.error('Forgot password modal error:', error);
    reportError(error);
    return null;
  }
}
