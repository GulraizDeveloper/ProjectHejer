import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  /**
   * Get the base API URL from environment configuration
   * This allows for easy switching between development, staging, and production APIs
   */
  get apiUrl(): string {
    return environment.apiUrl;
  }

  /**
   * Get the full API endpoint for customers
   */
  get customersApiUrl(): string {
    return `${this.apiUrl}/customers`;
  }

  /**
   * Get the full API endpoint for leads
   */
  get leadsApiUrl(): string {
    return `${this.apiUrl}/leads`;
  }

  /**
   * Check if running in production mode
   */
  get isProduction(): boolean {
    return environment.production;
  }

  /**
   * Get environment-specific configuration
   */
  getEnvironmentInfo(): { production: boolean; apiUrl: string } {
    return {
      production: environment.production,
      apiUrl: environment.apiUrl
    };
  }
}
