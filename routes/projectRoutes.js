const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Find all projects, sort by most recently updated
    const projects = await Project.find().sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not fetch projects'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get a single project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not fetch project'
    });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, htmlCode, cssCode, jsCode, description } = req.body;
    
    // Validation: Title is required
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a project title'
      });
    }
    
    // Create new project
    const project = await Project.create({
      title: title.trim(),
      htmlCode: htmlCode || undefined, // Use default if not provided
      cssCode: cssCode || undefined,
      jsCode: jsCode || undefined,
      description: description ? description.trim() : undefined
    });
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not create project'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { title, htmlCode, cssCode, jsCode, description } = req.body;
    
    // Build update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (htmlCode !== undefined) updateData.htmlCode = htmlCode;
    if (cssCode !== undefined) updateData.cssCode = cssCode;
    if (jsCode !== undefined) updateData.jsCode = jsCode;
    if (description !== undefined) updateData.description = description.trim();
    
    // Find project and update
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not update project'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not delete project'
    });
  }
});

module.exports = router;