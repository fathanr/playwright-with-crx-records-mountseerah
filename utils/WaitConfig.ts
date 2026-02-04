/**
 * Wait Configuration - Centralized timeout settings
 */
export const WaitConfig = {
  // Element visibility timeouts
  element: {
    visible: 10000,
    attached: 5000,
    detached: 5000
  },

  // Network and loading timeouts
  network: {
    idle: 5000,
    response: 15000,
    navigation: 10000
  },

  // Form interaction timeouts
  form: {
    submission: 15000,
    validation: 5000,
    fill: 3000
  },

  // Page loading timeouts
  page: {
    load: 30000,
    domContent: 10000,
    networkIdle: 5000
  },

  // Dynamic content timeouts
  dynamic: {
    content: 10000,
    search: 8000,
    filter: 5000
  }
} as const;

/**
 * Environment-specific timeout adjustments
 */
export function getTimeoutForEnv(baseTimeout: number): number {
  const env = process.env.NODE_ENV || 'development';
  
  const multipliers = {
    development: 1,
    staging: 1.5,
    production: 2,
    ci: 2.5
  };

  return baseTimeout * (multipliers[env as keyof typeof multipliers] || 1);
}
