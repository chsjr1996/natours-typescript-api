export default {
  nodeEnv: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT,
  database: process.env.DATABASE,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
};
