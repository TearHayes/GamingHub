function ProfileSettings({ user, onUpdate }) {
  try {
    const [username, setUsername] = React.useState(user.username);
    const [email, setEmail] = React.useState(user.email);
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [avatarUrl, setAvatarUrl] = React.useState(user.avatar);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const fileInputRef = React.useRef(null);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setIsLoading(true);
      
      try {
        const updates = {
          email
        };
        
        // Check if user is changing password
        if (newPassword) {
          // Verify passwords match
          if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            setIsLoading(false);
            return;
          }
          
          // Verify current password (in a real app, this would be done server-side)
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const currentUser = users.find(u => u.id === user.id);
          
          if (!currentUser || currentUser.password !== currentPassword) {
            setError('Current password is incorrect');
            setIsLoading(false);
            return;
          }
          
          updates.password = newPassword;
        }
        
        // Update avatar if changed
        if (avatarUrl !== user.avatar) {
          updates.avatar = avatarUrl;
        }
        
        const result = updateUserProfile(user.id, updates);
        
        if (result.success) {
          setSuccess('Profile updated successfully');
          
          // Clear password fields
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          
          // Notify parent component
          if (onUpdate) {
            onUpdate(result.user);
          }
        } else {
          setError(result.error);
        }
      } catch (error) {
        console.error('Update profile error:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    const generateRandomAvatar = () => {
      const randomSeed = Math.random().toString(36).substring(2, 10);
      setAvatarUrl(`https://ui-avatars.com/api/?name=${username}&background=random&seed=${randomSeed}&color=fff&size=128`);
    };
    
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Check if file is an image
        if (!file.type.match('image.*')) {
          setError('Please select an image file');
          return;
        }
        
        // Check if file size is less than 2MB
        if (file.size > 2 * 1024 * 1024) {
          setError('Image size should be less than 2MB');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    
    return (
      <div className="settings-container" data-name="profile-settings">
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        
        <form onSubmit={handleSubmit} className="settings-form" data-name="settings-form">
          <div className="avatar-upload" data-name="avatar-section">
            <img 
              src={avatarUrl} 
              alt={username} 
              className="avatar-preview"
              data-name="avatar-preview"
            />
            
            <div className="flex flex-col sm:flex-row gap-2 w-full mt-4">
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="avatar-upload-btn flex-1"
                data-name="upload-avatar-btn"
              >
                <i className="fas fa-upload mr-2"></i>
                Upload Image
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="avatar-upload-input"
                data-name="avatar-file-input"
              />
              
              <button 
                type="button"
                onClick={generateRandomAvatar}
                className="avatar-upload-btn flex-1"
                data-name="generate-avatar-btn"
              >
                <i className="fas fa-random mr-2"></i>
                Random Avatar
              </button>
            </div>
            
            <p className="text-xs opacity-70 mt-2 text-center" data-name="avatar-help">
              Upload a JPG or PNG image (max 2MB)
            </p>
          </div>
          
          <div className="settings-form-group" data-name="username-group">
            <label className="settings-form-label" data-name="username-label">Username</label>
            <input
              type="text"
              value={username}
              disabled={true}
              className="settings-form-input opacity-70"
              data-name="username-input"
            />
            <p className="text-xs opacity-70 mt-1" data-name="username-help">
              Username cannot be changed
            </p>
          </div>
          
          <div className="settings-form-group" data-name="email-group">
            <label className="settings-form-label" data-name="email-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="settings-form-input"
              data-name="email-input"
            />
          </div>
          
          <h3 className="font-semibold mt-6 mb-4" data-name="password-section-title">Change Password</h3>
          
          <div className="settings-form-group" data-name="current-password-group">
            <label className="settings-form-label" data-name="current-password-label">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="settings-form-input"
              data-name="current-password-input"
            />
          </div>
          
          <div className="settings-form-group" data-name="new-password-group">
            <label className="settings-form-label" data-name="new-password-label">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="settings-form-input"
              data-name="new-password-input"
            />
          </div>
          
          <div className="settings-form-group" data-name="confirm-password-group">
            <label className="settings-form-label" data-name="confirm-password-label">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="settings-form-input"
              data-name="confirm-password-input"
            />
          </div>
          
          <button
            type="submit"
            className="settings-form-submit"
            disabled={isLoading}
            data-name="save-settings-btn"
          >
            {isLoading ? (
              <React.Fragment>
                <div className="spinner"></div>
                <span>Saving...</span>
              </React.Fragment>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    );
  } catch (error) {
    console.error('ProfileSettings error:', error);
    reportError(error);
    return null;
  }
}
