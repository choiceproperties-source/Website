import express from 'express';
import AgentModel from '../models/AgentModel.js';
import { adminAuth } from '../middleware/authMiddleware.js';

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
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, email, phone, about, specialties, photo } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, phone'
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

// DELETE /api/agents/:id - Delete agent (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if agent exists
    const agent = await AgentModel.getById(id);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    await AgentModel.delete(id);
    
    res.json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting agent',
      error: error.message
    });
  }
});

// PUT /api/agents/:id - Update agent (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const agent = await AgentModel.getById(id);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    const updatedAgent = await AgentModel.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Agent updated successfully',
      data: updatedAgent
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating agent',
      error: error.message
    });
  }
});

export default router;
