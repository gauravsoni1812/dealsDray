const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const cookieParser = require('cookie-parser');
const {upload }= require('./upload');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

app.use(express.json());
app.use(cookieParser());
app.use(cors("*"));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test Database Connection
prisma.$connect()
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

// Middleware to authenticate user from JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
};

// User Login API
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'None'
        });

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Create a new Employee (Protected)
app.post('/employees', authenticateToken, upload.single('Image'), async (req, res) => {
    const { Name, Email, Mobile, Designation, Gender, Course, CreateDate } = req.body;
    const Image = req.file ? req.file.path.replace(/\\/g, '/') : null;

    try {
        const userId = req.user.userId;

        // Check if email or mobile number already exists
        const existingEmployee = await prisma.employee.findFirst({
            where: {
                OR: [
                    { Email },
                    { Mobile }
                ]
            }
        });

        if (existingEmployee) {
            return res.status(400).json({ message: 'Email or Mobile number already in use' });
        }

        const newEmployee = await prisma.employee.create({
            data: {
                Name,
                Image,
                Email,
                Mobile,
                Designation,
                Gender,
                Course,
                CreateDate,
                User: { connect: { id: userId } },
            },
        });

        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Email or Mobile number already in use' });
        }
        res.status(500).json({ error: 'Failed to create employee', details: error.message });
    }
});

// Get all Employees (Protected)
app.get('/employees', authenticateToken, async (req, res) => {
    try {
        const employees = await prisma.employee.findMany();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.patch('/employees/:id', authenticateToken, upload.single('Image'), async (req, res) => {
    const { id } = req.params;
    const { Name, Email, Mobile, Designation, Gender, Course, CreateDate } = req.body;
    const Image = req.file ? req.file.path.replace(/\\/g, '/') : null;

    try {
        const userId = req.user.userId;

        // Find the existing employee
        const existingEmployee = await prisma.employee.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if email or mobile number is being updated and already exists for another employee
        const conflictingEmployee = await prisma.employee.findFirst({
            where: {
                AND: [
                    { id: { not: parseInt(id) } }, // Ensure not checking the current employee
                    {
                        OR: [
                            { Email },
                            { Mobile }
                        ]
                    }
                ]
            }
        });

        if (conflictingEmployee) {
            return res.status(400).json({ message: 'Email or Mobile number already in use by another employee' });
        }

        // Update employee data
        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: {
                Name,
                Email,
                Mobile,
                Designation,
                Gender,
                Course,
                CreateDate,
                Image: Image || existingEmployee.Image, // Use the existing image if a new one is not provided
            }
        });

        res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update employee', details: error.message });
    }
});
