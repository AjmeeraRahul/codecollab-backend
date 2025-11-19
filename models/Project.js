const mongoose = require('mongoose');

// Define the Project Schema
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    htmlCode: {
      type: String,
      default: '<!-- Write your HTML here -->\n<h1>Hello CodeCollab!</h1>'
    },
    cssCode: {
      type: String,
      default: '/* Write your CSS here */\nbody {\n  font-family: Arial, sans-serif;\n  padding: 20px;\n}'
    },
    jsCode: {
      type: String,
      default: '// Write your JavaScript here\nconsole.log("CodeCollab is ready!");'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

// Create indexes for better query performance
ProjectSchema.index({ title: 1 });
ProjectSchema.index({ createdAt: -1 });

// Add a method to get formatted date
ProjectSchema.methods.getFormattedDate = function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Add a static method to get recent projects
ProjectSchema.statics.getRecentProjects = function(limit = 10) {
  return this.find()
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select('title description createdAt updatedAt');
};

// Export the model
module.exports = mongoose.model('Project', ProjectSchema);
