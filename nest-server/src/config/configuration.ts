export default () => ({
  port: parseInt(process.env.PORT || '1337', 10),
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/todos-app',
  saltWorkFactor: parseInt(process.env.SALT_WORK_FACTOR || '10', 10),
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '1y',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey1234567890',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshjwtkey1234567890',
});
