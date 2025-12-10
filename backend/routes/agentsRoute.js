import express from 'express';
import AgentModel from '../models/AgentModel.js';

const router = express.Router();

// GET /api/agents - Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await AgentModel.getAll();
    res.json({
      success: true,
      data: agents
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching agents',
      error: error.message
    });
  }
});

// GET /api/agents/:id - Get single agent
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await AgentModel.getById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching agent',
      error: error.message
    });
  }
});

// POST /api/agents - Create agent (admin only)
router.post('/', async (req, res) => {
  try {
    // TODO: Add authentication middleware to check if admin
    const { name, email, phone, about, specialties, photo } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const agent = await AgentModel.create({
      name,
      email,
      phone,
      about,
      specialties,
      photo
    });

    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      data: agent
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating agent',
      error: error.message
    });
  }
});

export default router;
