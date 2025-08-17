const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validateQueryParams } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * GET /api/users
 * Fetch all users from the database
 * Query parameters:
 * - limit: Number of users to return (default: all)
 * - offset: Number of users to skip (default: 0)
 * - search: Search term for filtering users by name, email, or company
 * - country: Filter by country
 * - company: Filter by company name
 */
router.get('/users', validateQueryParams, asyncHandler(async (req, res) => {
  const { limit, offset, search, country, company } = req.query;
  
  try {
    let query = `
      SELECT 
        id,
        firstName,
        lastName,
        email,
        phone,
        username,
        birthDate,
        image,
        bloodGroup,
        height,
        weight,
        eyeColor,
        hair_color,
        hair_type,
        domain,
        ip,
        macAddress,
        university,
        
        -- Address information
        address_address as address,
        address_city as city,
        address_coordinates_lat as coordinates_lat,
        address_coordinates_lng as coordinates_lng,
        address_postalCode as postalCode,
        address_state as state,
        address_country as country,
        
        -- Bank information
        bank_cardExpire,
        bank_cardNumber,
        bank_cardType,
        bank_currency,
        bank_iban,
        
        -- Company information
        company_department,
        company_name,
        company_title,
        company_address_address as company_address,
        company_address_city as company_city,
        company_address_coordinates_lat as company_coordinates_lat,
        company_address_coordinates_lng as company_coordinates_lng,
        company_address_postalCode as company_postalCode,
        company_address_state as company_state,
        company_address_country as company_country,
        
        -- Crypto information
        crypto_coin,
        crypto_wallet,
        crypto_network,
        
        created_at,
        updated_at
      FROM users
    `;
    
    const queryParams = [];
    const conditions = [];
    
    // Add search conditions
    if (search) {
      conditions.push(`(
        CONCAT(firstName, ' ', lastName) LIKE ? OR 
        email LIKE ? OR 
        company_name LIKE ? OR
        company_title LIKE ?
      )`);
      const searchParam = `%${search}%`;
      queryParams.push(searchParam, searchParam, searchParam, searchParam);
    }
    
    // Add country filter
    if (country) {
      conditions.push('address_country LIKE ?');
      queryParams.push(`%${country}%`);
    }
    
    // Add company filter
    if (company) {
      conditions.push('company_name LIKE ?');
      queryParams.push(`%${company}%`);
    }
    
    // Apply conditions
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Add ordering
    query += ' ORDER BY created_at DESC, id ASC';
    
    // Add pagination
    if (limit) {
      query += ' LIMIT ?';
      queryParams.push(parseInt(limit));
      
      if (offset) {
        query += ' OFFSET ?';
        queryParams.push(parseInt(offset));
      }
    }
    
    // Execute query
    const [rows] = await pool.execute(query, queryParams);
    
    // Transform data to match DummyJSON structure
    const users = rows.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      password: '***', // Never return actual passwords
      birthDate: user.birthDate,
      image: user.image,
      bloodGroup: user.bloodGroup,
      height: user.height,
      weight: user.weight,
      eyeColor: user.eyeColor,
      hair: {
        color: user.hair_color,
        type: user.hair_type
      },
      domain: user.domain,
      ip: user.ip,
      address: {
        address: user.address,
        city: user.city,
        coordinates: {
          lat: user.coordinates_lat,
          lng: user.coordinates_lng
        },
        postalCode: user.postalCode,
        state: user.state,
        country: user.country
      },
      macAddress: user.macAddress,
      university: user.university,
      bank: {
        cardExpire: user.bank_cardExpire,
        cardNumber: user.bank_cardNumber ? user.bank_cardNumber.replace(/\d(?=\d{4})/g, '*') : null, // Mask card number
        cardType: user.bank_cardType,
        currency: user.bank_currency,
        iban: user.bank_iban ? user.bank_iban.replace(/(.{4})(.*)(.{4})/, '$1****$3') : null // Mask IBAN
      },
      company: {
        department: user.company_department,
        name: user.company_name,
        title: user.company_title,
        address: {
          address: user.company_address,
          city: user.company_city,
          coordinates: {
            lat: user.company_coordinates_lat,
            lng: user.company_coordinates_lng
          },
          postalCode: user.company_postalCode,
          state: user.company_state,
          country: user.company_country
        }
      },
      crypto: {
        coin: user.crypto_coin,
        wallet: user.crypto_wallet,
        network: user.crypto_network
      }
    }));
    
    // Get total count for pagination info
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const countParams = [];
    
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
      // Use the same search parameters for count query
      if (search) {
        const searchParam = `%${search}%`;
        countParams.push(searchParam, searchParam, searchParam, searchParam);
      }
      if (country) {
        countParams.push(`%${country}%`);
      }
      if (company) {
        countParams.push(`%${company}%`);
      }
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    // Prepare response
    const response = {
      users,
      total,
      skip: offset ? parseInt(offset) : 0,
      limit: limit ? parseInt(limit) : total
    };
    
    // Add pagination info if applicable
    if (limit) {
      response.hasMore = (parseInt(offset) || 0) + parseInt(limit) < total;
      response.page = Math.floor((parseInt(offset) || 0) / parseInt(limit)) + 1;
      response.totalPages = Math.ceil(total / parseInt(limit));
    }
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to fetch users from database');
  }
}));

/**
 * GET /api/users/:id
 * Fetch a specific user by ID
 */
router.get('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      error: 'Invalid user ID',
      message: 'User ID must be a valid number'
    });
  }
  
  try {
    const query = `
      SELECT 
        id, firstName, lastName, email, phone, username, birthDate, image,
        bloodGroup, height, weight, eyeColor, hair_color, hair_type, domain, ip,
        macAddress, university, address_address, address_city, address_coordinates_lat,
        address_coordinates_lng, address_postalCode, address_state, address_country,
        bank_cardExpire, bank_cardNumber, bank_cardType, bank_currency, bank_iban,
        company_department, company_name, company_title, company_address_address,
        company_address_city, company_address_coordinates_lat, company_address_coordinates_lng,
        company_address_postalCode, company_address_state, company_address_country,
        crypto_coin, crypto_wallet, crypto_network, created_at, updated_at
      FROM users 
      WHERE id = ?
    `;
    
    const [rows] = await pool.execute(query, [parseInt(id)]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user found with ID ${id}`
      });
    }
    
    const user = rows[0];
    
    // Transform data to match DummyJSON structure
    const formattedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      password: '***',
      birthDate: user.birthDate,
      image: user.image,
      bloodGroup: user.bloodGroup,
      height: user.height,
      weight: user.weight,
      eyeColor: user.eyeColor,
      hair: {
        color: user.hair_color,
        type: user.hair_type
      },
      domain: user.domain,
      ip: user.ip,
      address: {
        address: user.address_address,
        city: user.address_city,
        coordinates: {
          lat: user.address_coordinates_lat,
          lng: user.address_coordinates_lng
        },
        postalCode: user.address_postalCode,
        state: user.address_state,
        country: user.address_country
      },
      macAddress: user.macAddress,
      university: user.university,
      bank: {
        cardExpire: user.bank_cardExpire,
        cardNumber: user.bank_cardNumber ? user.bank_cardNumber.replace(/\d(?=\d{4})/g, '*') : null,
        cardType: user.bank_cardType,
        currency: user.bank_currency,
        iban: user.bank_iban ? user.bank_iban.replace(/(.{4})(.*)(.{4})/, '$1****$3') : null
      },
      company: {
        department: user.company_department,
        name: user.company_name,
        title: user.company_title,
        address: {
          address: user.company_address_address,
          city: user.company_address_city,
          coordinates: {
            lat: user.company_address_coordinates_lat,
            lng: user.company_address_coordinates_lng
          },
          postalCode: user.company_address_postalCode,
          state: user.company_address_state,
          country: user.company_address_country
        }
      },
      crypto: {
        coin: user.crypto_coin,
        wallet: user.crypto_wallet,
        network: user.crypto_network
      }
    };
    
    res.status(200).json(formattedUser);
    
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to fetch user from database');
  }
}));

module.exports = router;
