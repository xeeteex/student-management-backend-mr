import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  age: {
    type: Number,
    required: [true, 'Please provide age'],
  },
  course: {
    type: String,
    required: [true, 'Please provide course name'],
    trim: true,
    maxlength: [100, 'Course name cannot be more than 100 characters']
  }
}, {
  timestamps: true,
});

// Add indexes for better query performance
studentSchema.index({ email: 1 });
studentSchema.index({ name: 'text' });

const Student = mongoose.model('Student', studentSchema);

export default Student;
