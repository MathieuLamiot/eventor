export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'postgres' as const,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: false, // Disable synchronize
    migrationsRun: true, // Run migrations on startup
    migrations: ['dist/migrations/*.js'],
  },
  events: {
    batchSize: parseInt(process.env.EVENT_BATCH_SIZE, 10) || 100,
    batchInterval: parseInt(process.env.EVENT_BATCH_INTERVAL, 10) || 5000,
  },
});
