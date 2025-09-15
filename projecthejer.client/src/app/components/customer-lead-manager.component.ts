import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer, CreateCustomer, Image, UploadImage } from '../services/customer.service';
import { LeadService, Lead, CreateLead } from '../services/lead.service';

@Component({
  selector: 'app-customer-lead-manager',
  template: `
    <div class="manager-container">
      <h2>Customer & Lead Manager</h2>
      
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          [class.active]="activeTab === 'customers'" 
          (click)="activeTab = 'customers'"
        >
          Customers ({{ customers.length }})
        </button>
        <button 
          [class.active]="activeTab === 'leads'" 
          (click)="activeTab = 'leads'"
        >
          Leads ({{ leads.length }})
        </button>
      </div>

      <!-- Customers Tab -->
      <div *ngIf="activeTab === 'customers'" class="tab-content">
        <div class="actions">
          <button (click)="showCreateCustomerForm = !showCreateCustomerForm" class="create-btn">
            {{ showCreateCustomerForm ? 'Cancel' : 'Add Customer' }}
          </button>
        </div>

        <!-- Create Customer Form -->
        <div *ngIf="showCreateCustomerForm" class="create-form">
          <h3>Create New Customer</h3>
          <form (ngSubmit)="createCustomer()" #customerForm="ngForm">
            <div class="form-group">
              <label>Name *</label>
              <input type="text" [(ngModel)]="newCustomer.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="newCustomer.email" name="email">
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" [(ngModel)]="newCustomer.phone" name="phone">
            </div>
            <div class="form-group">
              <label>Address</label>
              <textarea [(ngModel)]="newCustomer.address" name="address"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" [disabled]="!customerForm.form.valid">Create Customer</button>
              <button type="button" (click)="showCreateCustomerForm = false">Cancel</button>
            </div>
          </form>
        </div>

        <!-- Customers List -->
        <div class="entities-list">
          <div *ngFor="let customer of customers" class="entity-card">
            <div class="entity-header">
              <h3>{{ customer.name }}</h3>
              <span class="image-count">{{ customer.imageCount }}/10 images</span>
            </div>
            <div class="entity-details">
              <p *ngIf="customer.email"><strong>Email:</strong> {{ customer.email }}</p>
              <p *ngIf="customer.phone"><strong>Phone:</strong> {{ customer.phone }}</p>
              <p *ngIf="customer.address"><strong>Address:</strong> {{ customer.address }}</p>
              <p><strong>Created:</strong> {{ customer.createdDate | date:'medium' }}</p>
            </div>
            <div class="entity-actions">
              <button (click)="toggleCustomerImages(customer.id)">
                {{ expandedCustomer === customer.id ? 'Hide' : 'Show' }} Images
              </button>
              <button (click)="deleteCustomer(customer.id)" class="delete-btn">Delete</button>
            </div>
            
            <!-- Customer Images -->
            <div *ngIf="expandedCustomer === customer.id" class="images-section">
              <app-image-gallery
                [images]="customerImages"
                [entityId]="customer.id"
                entityType="customer"
                (upload)="uploadCustomerImages(customer.id, $event)"
                (delete)="deleteCustomerImage(customer.id, $event)"
              ></app-image-gallery>
            </div>
          </div>
        </div>
      </div>

      <!-- Leads Tab -->
      <div *ngIf="activeTab === 'leads'" class="tab-content">
        <div class="actions">
          <button (click)="showCreateLeadForm = !showCreateLeadForm" class="create-btn">
            {{ showCreateLeadForm ? 'Cancel' : 'Add Lead' }}
          </button>
        </div>

        <!-- Create Lead Form -->
        <div *ngIf="showCreateLeadForm" class="create-form">
          <h3>Create New Lead</h3>
          <form (ngSubmit)="createLead()" #leadForm="ngForm">
            <div class="form-group">
              <label>Name *</label>
              <input type="text" [(ngModel)]="newLead.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="newLead.email" name="email">
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" [(ngModel)]="newLead.phone" name="phone">
            </div>
            <div class="form-group">
              <label>Company</label>
              <input type="text" [(ngModel)]="newLead.company" name="company">
            </div>
            <div class="form-group">
              <label>Source</label>
              <input type="text" [(ngModel)]="newLead.source" name="source">
            </div>
            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="newLead.status" name="status">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" [disabled]="!leadForm.form.valid">Create Lead</button>
              <button type="button" (click)="showCreateLeadForm = false">Cancel</button>
            </div>
          </form>
        </div>

        <!-- Leads List -->
        <div class="entities-list">
          <div *ngFor="let lead of leads" class="entity-card">
            <div class="entity-header">
              <h3>{{ lead.name }}</h3>
              <span class="image-count">{{ lead.imageCount }}/10 images</span>
              <span class="status" [ngClass]="'status-' + lead.status.toLowerCase()">{{ lead.status }}</span>
            </div>
            <div class="entity-details">
              <p *ngIf="lead.email"><strong>Email:</strong> {{ lead.email }}</p>
              <p *ngIf="lead.phone"><strong>Phone:</strong> {{ lead.phone }}</p>
              <p *ngIf="lead.company"><strong>Company:</strong> {{ lead.company }}</p>
              <p *ngIf="lead.source"><strong>Source:</strong> {{ lead.source }}</p>
              <p><strong>Created:</strong> {{ lead.createdDate | date:'medium' }}</p>
            </div>
            <div class="entity-actions">
              <button (click)="toggleLeadImages(lead.id)">
                {{ expandedLead === lead.id ? 'Hide' : 'Show' }} Images
              </button>
              <button (click)="deleteLead(lead.id)" class="delete-btn">Delete</button>
            </div>
            
            <!-- Lead Images -->
            <div *ngIf="expandedLead === lead.id" class="images-section">
              <app-image-gallery
                [images]="leadImages"
                [entityId]="lead.id"
                entityType="lead"
                (upload)="uploadLeadImages(lead.id, $event)"
                (delete)="deleteLeadImage(lead.id, $event)"
              ></app-image-gallery>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manager-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .tab-navigation {
      display: flex;
      margin-bottom: 20px;
      border-bottom: 2px solid #ddd;
    }

    .tab-navigation button {
      padding: 10px 20px;
      border: none;
      background: none;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      font-size: 16px;
    }

    .tab-navigation button.active {
      border-bottom-color: #007bff;
      color: #007bff;
      font-weight: bold;
    }

    .actions {
      margin-bottom: 20px;
    }

    .create-btn {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }

    .create-form {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group textarea {
      resize: vertical;
      height: 80px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
    }

    .form-actions button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .form-actions button[type="submit"] {
      background-color: #007bff;
      color: white;
    }

    .form-actions button[type="button"] {
      background-color: #6c757d;
      color: white;
    }

    .entities-list {
      display: grid;
      gap: 20px;
    }

    .entity-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background: white;
    }

    .entity-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }

    .entity-header h3 {
      margin: 0;
      flex: 1;
    }

    .image-count {
      background: #e9ecef;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }

    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .status-new { background-color: #cce5ff; color: #0066cc; }
    .status-contacted { background-color: #fff3cd; color: #856404; }
    .status-qualified { background-color: #d1ecf1; color: #0c5460; }
    .status-converted { background-color: #d4edda; color: #155724; }
    .status-lost { background-color: #f8d7da; color: #721c24; }

    .entity-details p {
      margin: 5px 0;
      color: #666;
    }

    .entity-actions {
      margin-top: 15px;
      display: flex;
      gap: 10px;
    }

    .entity-actions button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .entity-actions button:first-child {
      background-color: #007bff;
      color: white;
    }

    .delete-btn {
      background-color: #dc3545 !important;
      color: white !important;
    }

    .images-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  `]
})
export class CustomerLeadManagerComponent implements OnInit {
  activeTab: 'customers' | 'leads' = 'customers';
  
  customers: Customer[] = [];
  leads: Lead[] = [];
  
  showCreateCustomerForm = false;
  showCreateLeadForm = false;
  
  newCustomer: CreateCustomer = { name: '' };
  newLead: CreateLead = { name: '', status: 'New' };
  
  expandedCustomer: number | null = null;
  expandedLead: number | null = null;
  
  customerImages: Image[] = [];
  leadImages: Image[] = [];

  constructor(
    private customerService: CustomerService,
    private leadService: LeadService
  ) {}

  ngOnInit() {
    this.loadCustomers();
    this.loadLeads();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }

  loadLeads() {
    this.leadService.getLeads().subscribe(leads => {
      this.leads = leads;
    });
  }

  createCustomer() {
    this.customerService.createCustomer(this.newCustomer).subscribe(() => {
      this.loadCustomers();
      this.newCustomer = { name: '' };
      this.showCreateCustomerForm = false;
    });
  }

  createLead() {
    this.leadService.createLead(this.newLead).subscribe(() => {
      this.loadLeads();
      this.newLead = { name: '', status: 'New' };
      this.showCreateLeadForm = false;
    });
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.loadCustomers();
      });
    }
  }

  deleteLead(id: number) {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.leadService.deleteLead(id).subscribe(() => {
        this.loadLeads();
      });
    }
  }

  toggleCustomerImages(customerId: number) {
    if (this.expandedCustomer === customerId) {
      this.expandedCustomer = null;
      this.customerImages = [];
    } else {
      this.expandedCustomer = customerId;
      this.loadCustomerImages(customerId);
    }
  }

  toggleLeadImages(leadId: number) {
    if (this.expandedLead === leadId) {
      this.expandedLead = null;
      this.leadImages = [];
    } else {
      this.expandedLead = leadId;
      this.loadLeadImages(leadId);
    }
  }

  loadCustomerImages(customerId: number) {
    this.customerService.getCustomerImages(customerId).subscribe(images => {
      this.customerImages = images;
    });
  }

  loadLeadImages(leadId: number) {
    this.leadService.getLeadImages(leadId).subscribe(images => {
      this.leadImages = images;
    });
  }

  uploadCustomerImages(customerId: number, files: File[]) {
    this.convertFilesToBase64(files).then(uploadImages => {
      this.customerService.uploadImages(customerId, uploadImages).subscribe(response => {
        if (response.success) {
          this.loadCustomerImages(customerId);
          this.loadCustomers(); // Refresh to update image count
        }
        alert(response.message);
      });
    });
  }

  uploadLeadImages(leadId: number, files: File[]) {
    this.convertFilesToBase64(files).then(uploadImages => {
      this.leadService.uploadImages(leadId, uploadImages).subscribe(response => {
        if (response.success) {
          this.loadLeadImages(leadId);
          this.loadLeads(); // Refresh to update image count
        }
        alert(response.message);
      });
    });
  }

  deleteCustomerImage(customerId: number, image: Image) {
    this.customerService.deleteImage(customerId, image.id).subscribe(() => {
      this.loadCustomerImages(customerId);
      this.loadCustomers(); // Refresh to update image count
    });
  }

  deleteLeadImage(leadId: number, image: Image) {
    this.leadService.deleteImage(leadId, image.id).subscribe(() => {
      this.loadLeadImages(leadId);
      this.loadLeads(); // Refresh to update image count
    });
  }

  private convertFilesToBase64(files: File[]): Promise<UploadImage[]> {
    const promises = files.map(file => this.convertFileToBase64(file));
    return Promise.all(promises);
  }

  private convertFileToBase64(file: File): Promise<UploadImage> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          imageData: base64String,
          fileName: file.name,
          contentType: file.type
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
