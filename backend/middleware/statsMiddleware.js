import StatsModel from '../models/Stats.js';

export const trackAPIStats = async (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    try {
      if (!['OPTIONS', 'HEAD'].includes(req.method)) {
        const duration = Date.now() - start;
        await StatsModel.create({
          endpoint: req.originalUrl,
          method: req.method,
          responseTime: duration,
          statusCode: res.statusCode
        });
      }
    } catch (error) {
      console.error('Error tracking API stats:', error);
    }
  });
  
  next();
};
