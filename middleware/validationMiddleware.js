import { body, validationResult } from 'express-validator';

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation function
function validatePassword(password) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

// Validation rules for registration
export const registerValidationRules = () => {
  return [
    // Email validation - must be a valid email and end with @gmail.com or @gla.ac.in
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .custom((value) => {
        // Use the provided validateEmail function
        if (!validateEmail(value)) {
          throw new Error('Please provide a valid email address');
        }
        
        // Check domain restriction
        const allowedDomains = ['@gmail.com', '@gla.ac.in'];
        const isValidDomain = allowedDomains.some(domain => value.endsWith(domain));
        if (!isValidDomain) {
          throw new Error('Email must be from gmail.com or gla.ac.in domain');
        }
        return true;
      })
      .normalizeEmail()
      .trim(),

    // Password validation - using the provided validatePassword function
    body('password')
      .custom((value) => {
        if (!validatePassword(value)) {
          throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
        }
        return true;
      }),

    // Role validation
    body('role')
      .isIn(['brand', 'influencer'])
      .withMessage('Role must be either "brand" or "influencer"'),

    // Name validation (required for all users)
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long')
      .trim(),

    // Phone validation
    body('phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),

    // City validation
    body('city')
      .notEmpty()
      .withMessage('City is required')
      .isLength({ min: 2 })
      .withMessage('City must be at least 2 characters long')
      .trim()
  ];
};

// Conditional validation for brand-specific fields
export const brandValidationRules = () => {
  return [
    body('brand_name')
      .if((value, { req }) => req.body.role === 'brand')
      .notEmpty()
      .withMessage('Brand name is required for brand accounts')
      .isLength({ min: 2 })
      .withMessage('Brand name must be at least 2 characters long')
      .trim(),

    body('industry')
      .if((value, { req }) => req.body.role === 'brand')
      .notEmpty()
      .withMessage('Industry is required for brand accounts')
      .trim()
  ];
};

// Conditional validation for influencer-specific fields
export const influencerValidationRules = () => {
  return [
    body('username')
      .if((value, { req }) => req.body.role === 'influencer')
      .notEmpty()
      .withMessage('Username is required for influencer accounts')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores')
      .trim(),

    body('category')
      .if((value, { req }) => req.body.role === 'influencer')
      .notEmpty()
      .withMessage('Category is required for influencer accounts')
      .trim()
  ];
};

// Validation rules for login
export const loginValidationRules = () => {
  return [
    // Email validation - must be a valid email and end with @gmail.com or @gla.ac.in
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .custom((value) => {
        // Use the provided validateEmail function
        if (!validateEmail(value)) {
          throw new Error('Please provide a valid email address');
        }
        
        // Check domain restriction
        const allowedDomains = ['@gmail.com', '@gla.ac.in'];
        const isValidDomain = allowedDomains.some(domain => value.endsWith(domain));
        if (!isValidDomain) {
          throw new Error('Email must be from gmail.com or gla.ac.in domain');
        }
        return true;
      })
      .normalizeEmail()
      .trim(),

    // Password validation
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ];
};

// Custom validation middleware for registration
export const validateRegistration = (req, res, next) => {
  // Run basic validations first
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // Conditional validations based on role
  const { role } = req.body;
  
  if (role === 'brand') {
    // Validate brand-specific fields
    if (!req.body.brand_name || req.body.brand_name.trim().length < 2) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: [{
          msg: 'Brand name is required for brand accounts and must be at least 2 characters long',
          param: 'brand_name',
          location: 'body'
        }]
      });
    }
    
    if (!req.body.industry || req.body.industry.trim().length === 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: [{
          msg: 'Industry is required for brand accounts',
          param: 'industry',
          location: 'body'
        }]
      });
    }
  } else if (role === 'influencer') {
    // Validate influencer-specific fields
    if (!req.body.username || req.body.username.trim().length < 3) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: [{
          msg: 'Username is required for influencer accounts and must be at least 3 characters long',
          param: 'username',
          location: 'body'
        }]
      });
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(req.body.username)) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: [{
          msg: 'Username can only contain letters, numbers, and underscores',
          param: 'username',
          location: 'body'
        }]
      });
    }
    
    if (!req.body.category || req.body.category.trim().length === 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: [{
          msg: 'Category is required for influencer accounts',
          param: 'category',
          location: 'body'
        }]
      });
    }
  }

  next();
};

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};
