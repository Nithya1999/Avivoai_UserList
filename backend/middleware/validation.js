const Joi = require('joi');

/**
 * Validate query parameters for GET /users endpoint
 */
const validateQueryParams = (req, res, next) => {
  const schema = Joi.object({
    limit: Joi.number().integer().min(1).max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
    search: Joi.string().max(255).optional(),
    country: Joi.string().max(100).optional(),
    company: Joi.string().max(200).optional()
  });

  const { error } = schema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid query parameters',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  next();
};

/**
 * Validate user data for POST/PUT operations
 */
const validateUserData = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    email: Joi.string().email().max(255).required(),
    phone: Joi.string().max(20).optional(),
    username: Joi.string().max(100).optional(),
    password: Joi.string().min(6).max(255).optional(),
    birthDate: Joi.date().optional(),
    image: Joi.string().uri().max(500).optional(),
    bloodGroup: Joi.string().max(10).optional(),
    height: Joi.number().positive().max(300).optional(),
    weight: Joi.number().positive().max(1000).optional(),
    eyeColor: Joi.string().max(50).optional(),
    hair: Joi.object({
      color: Joi.string().max(50).optional(),
      type: Joi.string().max(50).optional()
    }).optional(),
    domain: Joi.string().max(100).optional(),
    ip: Joi.string().ip().optional(),
    macAddress: Joi.string().max(17).optional(),
    university: Joi.string().max(200).optional(),
    address: Joi.object({
      address: Joi.string().max(255).optional(),
      city: Joi.string().max(100).optional(),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90).optional(),
        lng: Joi.number().min(-180).max(180).optional()
      }).optional(),
      postalCode: Joi.string().max(20).optional(),
      state: Joi.string().max(100).optional(),
      country: Joi.string().max(100).optional()
    }).optional(),
    bank: Joi.object({
      cardExpire: Joi.string().max(10).optional(),
      cardNumber: Joi.string().max(20).optional(),
      cardType: Joi.string().max(50).optional(),
      currency: Joi.string().max(10).optional(),
      iban: Joi.string().max(50).optional()
    }).optional(),
    company: Joi.object({
      department: Joi.string().max(100).optional(),
      name: Joi.string().max(200).optional(),
      title: Joi.string().max(150).optional(),
      address: Joi.object({
        address: Joi.string().max(255).optional(),
        city: Joi.string().max(100).optional(),
        coordinates: Joi.object({
          lat: Joi.number().min(-90).max(90).optional(),
          lng: Joi.number().min(-180).max(180).optional()
        }).optional(),
        postalCode: Joi.string().max(20).optional(),
        state: Joi.string().max(100).optional(),
        country: Joi.string().max(100).optional()
      }).optional()
    }).optional(),
    crypto: Joi.object({
      coin: Joi.string().max(50).optional(),
      wallet: Joi.string().max(100).optional(),
      network: Joi.string().max(50).optional()
    }).optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid user data',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }))
    });
  }

  next();
};

/**
 * Sanitize input data to prevent XSS attacks
 */
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

module.exports = {
  validateQueryParams,
  validateUserData,
  sanitizeInput
};
