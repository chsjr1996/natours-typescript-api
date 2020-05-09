import env from '../utils/env';

export default {
  /*
  |--------------------------------------------------------------------------
  | Server core
  |--------------------------------------------------------------------------
  |
  | This is core variables that define app mode, port and some other very
  | important things
  |
  */
  core: {
    nodeEnv: env('NODE_ENV'),
    isDev: env('NODE_ENV') === 'development',
    port: env('PORT'),
  },

  /*
  |--------------------------------------------------------------------------
  | Database configurations
  |--------------------------------------------------------------------------
  |
  | All configurations about database, like connection string, port,
  | password and others
  |
  */
  database: {
    connectionString: env('DATABASE'),
  },

  /*
  |--------------------------------------------------------------------------
  | JWT configurations
  |--------------------------------------------------------------------------
  |
  | All configurations about JWT, these vars is used for internal
  | validations
  |
  */
  jwt: {
    jwtSecret: env('JWT_SECRET'),
    jwtExpiration: env('JWT_EXPIRATION'),
  },
};
