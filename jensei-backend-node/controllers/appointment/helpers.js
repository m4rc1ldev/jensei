import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

// Helper function to get pagination parameters
export const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
