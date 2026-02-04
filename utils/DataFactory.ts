import fs from 'fs';
import path from 'path';

interface TestData {
  auth: {
    validUser: { email: string; password: string };
    invalidUser: { email: string; password: string };
  };
  masterData: {
    entity: {
      valid: { entity: string; district: string; description: string };
      invalid: { entity: string; district: string; description: string };
    };
    description: {
      parent: { description: string };
      child: { description: string };
    };
  };
}

export class DataFactory {
  private static data: TestData;
  private static createdEntities: string[] = [];

  static {
    const dataPath = path.join(process.cwd(), 'fixtures/test-data.json');
    this.data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }

  // Auth data
  static getValidUser() {
    return { ...this.data.auth.validUser };
  }

  static getInvalidUser() {
    return { ...this.data.auth.invalidUser };
  }

  // Entity data with unique values
  static getEntityData(suffix?: string) {
    const timestamp = Date.now();
    const uniqueSuffix = suffix || timestamp.toString().slice(-4);
    
    const entityData = {
      entity: `${this.data.masterData.entity.valid.entity}_${uniqueSuffix}`,
      district: `${this.data.masterData.entity.valid.district}_${uniqueSuffix}`,
      description: `${this.data.masterData.entity.valid.description} ${uniqueSuffix}`
    };

    // Track created entities for cleanup
    this.createdEntities.push(entityData.entity);
    return entityData;
  }

  // Description data
  static getDescriptionData(type: 'parent' | 'child' = 'parent') {
    const timestamp = Date.now().toString().slice(-4);
    return {
      description: `${this.data.masterData.description[type].description} ${timestamp}`
    };
  }

  // Environment-specific data
  static getEnvironmentData() {
    const env = process.env.NODE_ENV || 'development';
    
    const envData = {
      development: {
        baseUrl: 'https://pamafix-dev.dot.co.id',
        timeout: 10000
      },
      staging: {
        baseUrl: 'https://pamafix-staging.dot.co.id',
        timeout: 15000
      },
      production: {
        baseUrl: 'https://pamafix.dot.co.id',
        timeout: 20000
      }
    };

    return envData[env as keyof typeof envData] || envData.development;
  }

  // Random data generators
  static generateRandomString(length = 8) {
    return Math.random().toString(36).substring(2, length + 2);
  }

  static generateRandomEmail() {
    return `test_${this.generateRandomString()}@example.com`;
  }

  static generateRandomNumber(min = 1, max = 1000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Cleanup tracking
  static getCreatedEntities() {
    return [...this.createdEntities];
  }

  static clearCreatedEntities() {
    this.createdEntities = [];
  }

  // Validation helpers
  static isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static isValidPassword(password: string) {
    return password.length >= 8;
  }
}
