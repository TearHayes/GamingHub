function generateUserId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function validateUsername(username) {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  
  // Check if username already exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
  
  if (userExists) return 'Username is already taken';
  return null;
}

function validateEmail(email) {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return null;
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

function registerUser(username, email, password) {
  try {
    const usernameError = validateUsername(username);
    if (usernameError) return { success: false, error: usernameError };
    
    const emailError = validateEmail(email);
    if (emailError) return { success: false, error: emailError };
    
    const passwordError = validatePassword(password);
    if (passwordError) return { success: false, error: passwordError };
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const newUser = {
      id: generateUserId(),
      username,
      email,
      password, // In a real app, this should be hashed
      createdAt: new Date().toISOString(),
      rank: 'Cheater', // Default rank
      avatar: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=128`
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, user: { ...newUser, password: undefined } };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function loginUser(username, password) {
  try {
    if (!username) return { success: false, error: 'Username is required' };
    if (!password) return { success: false, error: 'Password is required' };
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    
    if (!user) return { success: false, error: 'Invalid username or password' };
    
    const userWithoutPassword = { ...user, password: undefined };
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function logoutUser() {
  try {
    localStorage.removeItem('currentUser');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function getCurrentUser() {
  try {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

function updateUserProfile(userId, updates) {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return { success: false, error: 'User not found' };
    
    // If updating email, validate it
    if (updates.email) {
      const emailError = validateEmail(updates.email);
      if (emailError) return { success: false, error: emailError };
    }
    
    // If updating password, validate it
    if (updates.password) {
      const passwordError = validatePassword(updates.password);
      if (passwordError) return { success: false, error: passwordError };
    }
    
    // Update user
    users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user in localStorage if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...users[userIndex], password: undefined };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    }
    
    return { success: true, user: { ...users[userIndex], password: undefined } };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function isCreator(user) {
  return user && (user.rank === 'Creator' || user.rank === 'Developer');
}

function isDeveloper(user) {
  return user && user.rank === 'Developer';
}

function promoteUser(userId, newRank) {
  try {
    const currentUser = getCurrentUser();
    
    // Only developers can promote users
    if (!isDeveloper(currentUser)) {
      return { success: false, error: 'You do not have permission to perform this action' };
    }
    
    // Only valid ranks are allowed
    const validRanks = ['Cheater', 'Creator', 'Developer'];
    if (!validRanks.includes(newRank)) {
      return { success: false, error: 'Invalid rank' };
    }
    
    // Only the owner can promote to Developer
    if (newRank === 'Developer' && currentUser.id !== '1') { // Assuming user with ID 1 is the owner
      return { success: false, error: 'Only the owner can promote to Developer' };
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return { success: false, error: 'User not found' };
    
    // Update user rank
    users[userIndex].rank = newRank;
    users[userIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, user: { ...users[userIndex], password: undefined } };
  } catch (error) {
    console.error('Promote user error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

function resetPassword(username, email) {
  try {
    if (!username) return { success: false, error: 'Username is required' };
    if (!email) return { success: false, error: 'Email is required' };
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(
      u => u.username.toLowerCase() === username.toLowerCase() && u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (userIndex === -1) {
      return { success: false, error: 'No matching user found with this username and email' };
    }
    
    // Generate a new random password
    const newPassword = Math.random().toString(36).substring(2, 10);
    
    // Update the user's password
    users[userIndex].password = newPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('users', JSON.stringify(users));
    
    // In a real app, we would send an email with the new password
    console.log(`Password reset for ${username}. New password: ${newPassword}`);
    
    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
