import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>ProjectHejer - Customer & Lead Management</h1>
        <p>Manage your customers and leads with image upload functionality</p>
      </header>
      <main>
        <app-customer-lead-manager></app-customer-lead-manager>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .app-header {
      background-color: #007bff;
      color: white;
      padding: 2rem 0;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      font-weight: 300;
    }

    .app-header p {
      margin: 0;
      font-size: 1.1rem;
      opacity: 0.9;
    }

    main {
      padding: 2rem 1rem;
    }

    /* Global styles */
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    button {
      transition: all 0.2s ease-in-out;
    }

    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    button:disabled {
      transform: none !important;
      box-shadow: none !important;
    }
  `]
})
export class AppComponent {
  title = 'ProjectHejer - Customer & Lead Management';
}
