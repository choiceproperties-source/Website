import express from 'express';

const router = express.Router();

// GET /api/agents - Get all agents
router.get('/', async (req, res) => {
  try {
    // TODO: Fetch from Supabase agents table
    // const { data, error } = await supabase.from('agents').select('*');
    
    res.json({
      success: true,
      message: 'Agents fetched successfully',
      data: []
    });
  } catch (error) {
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
    
    // TODO: Fetch from Supabase agents table where id = id
    // const { data, error } = await supabase
    //   .from('agents')
    //   .select('*')
    //   .eq('id', id)
    //   .single();
    
    res.json({
      success: true,
      message: 'Agent fetched successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agent',
      error: error.message
    });
  }
});

export default router;
