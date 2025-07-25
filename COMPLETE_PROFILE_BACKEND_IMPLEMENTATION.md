# Complete Backend Code for Profile Updates

## 1. Profile Controller (controllers/profileController.js)

```javascript
const User = require('../models/User');

// Get current user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    console.log('Updating profile for user:', userId);
    console.log('Updates received:', updates);

    // Validate and sanitize input
    const allowedUpdates = [
      'firstName', 'lastName', 'photo', 'photoURL', 'age', 'gender', 
      'about', 'skills', 'location', 'occupation', 'company', 'education',
      'interests', 'github', 'linkedin', 'portfolio'
    ];

    const filteredUpdates = {};
    
    // Only include allowed fields and non-empty values
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key) && updates[key] !== null && updates[key] !== undefined) {
        // Handle arrays (skills, interests)
        if (Array.isArray(updates[key])) {
          filteredUpdates[key] = updates[key].filter(item => 
            typeof item === 'string' && item.trim().length > 0
          );
        }
        // Handle strings
        else if (typeof updates[key] === 'string') {
          const trimmed = updates[key].trim();
          if (trimmed.length > 0) {
            filteredUpdates[key] = trimmed;
          }
        }
        // Handle numbers
        else if (typeof updates[key] === 'number') {
          filteredUpdates[key] = updates[key];
        }
      }
    });

    console.log('Filtered updates:', filteredUpdates);

    // Validate age if provided
    if (filteredUpdates.age && (filteredUpdates.age < 18 || filteredUpdates.age > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Age must be between 18 and 100'
      });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Profile updated successfully:', updatedUser);

    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
```

## 2. Updated User Model (models/User.js)

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Profile Information
  photo: {
    type: String,
    default: null
  },
  photoURL: {
    type: String,
    default: null
  },
  age: {
    type: Number,
    min: 18,
    max: 100
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'Male', 'Female', 'Other'],
    default: null
  },
  about: {
    type: String,
    maxlength: 500,
    default: "Hey there! I'm using DevTinder"
  },
  
  // Professional Information
  skills: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  occupation: {
    type: String,
    trim: true,
    maxlength: 100
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  education: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  // Personal Information
  interests: [{
    type: String,
    trim: true
  }],
  
  // Social Links
  github: {
    type: String,
    default: null
  },
  linkedin: {
    type: String,
    default: null
  },
  portfolio: {
    type: String,
    default: null
  },
  
  // Status Information
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Remove sensitive information when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
```

## 3. Profile Routes (routes/profile.js)

```javascript
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth'); // Your auth middleware

// Get current user profile
router.get('/view', auth, getProfile);

// Update profile
router.post('/edit', auth, updateProfile);

module.exports = router;
```

## 4. Add to your main app file (app.js or server.js)

```javascript
// Import the profile routes
const profileRoutes = require('./routes/profile');

// Use the profile routes
app.use('/profile', profileRoutes);
```

## 5. Test the API

You can test your profile update endpoint using this curl command:

```bash
curl -X POST http://localhost:7777/profile/edit \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "age": 25,
    "about": "Updated about section",
    "skills": ["JavaScript", "React"],
    "location": "New York"
  }'
```

## 6. Debugging Steps

If it's still not working, add these console.log statements to debug:

**In your EditProfile.jsx component:**
```javascript
const saveProfile = async () => {
  console.log('Saving profile with data:', profileData);
  
  const response = await apiService.updateProfile(profileData);
  console.log('API Response:', response);
  
  if (response.success) {
    console.log('Dispatching user data:', response.data);
    dispatch(addUser(response.data));
  }
};
```

**In your backend controller:**
```javascript
const updateProfile = async (req, res) => {
  console.log('Received update request:', req.body);
  console.log('User ID:', req.user._id);
  
  // ... rest of the code
  
  console.log('Sending response:', {
    success: true,
    data: updatedUser,
    message: 'Profile updated successfully'
  });
};
```

This will help you see exactly what data is being sent and received at each step.
