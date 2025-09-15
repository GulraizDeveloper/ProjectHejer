import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomerService, Customer, CreateCustomer, Image, UploadImage } from '../services/customer.service';
import { LeadService, Lead, CreateLead } from '../services/lead.service';

@Component({
  selector: 'app-customer-lead-manager',
  templateUrl: './customer-lead-manager.component.html',
  styleUrls: ['./customer-lead-manager.component.css']
})
export class CustomerLeadManagerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();
  private searchLeadsSubject$ = new Subject<string>();

  // Tab Management
  activeTab: 'customers' | 'leads' = 'customers';
  
  // Data Arrays
  customers: Customer[] = [];
  leads: Lead[] = [];
  
  // Filtered Arrays
  filteredCustomers: Customer[] = [];
  filteredLeads: Lead[] = [];
  
  // Form States
  showCreateCustomerForm = false;
  showCreateLeadForm = false;
  
  // Form Models
  newCustomer: CreateCustomer = { name: '' };
  newLead: CreateLead = { name: '', status: 'New' };
  
  // Expanded States
  expandedCustomer: number | null = null;
  expandedLead: number | null = null;
  
  // Images
  customerImages: Image[] = [];
  leadImages: Image[] = [];
  
  // Image Modal State - NEW: Added for full-screen modal
  selectedImage: Image | null = null;
  
  // Search and Filters
  searchTerm = '';
  searchTermLeads = '';
  statusFilter = '';
  
  // Loading States
  loading = {
    customers: false,
    leads: false,
    creatingCustomer: false,
    creatingLead: false
  };

  // Notification State
  notification: { message: string; type: 'success' | 'error' | 'info'; show: boolean } = {
    message: '',
    type: 'info',
    show: false
  };

  constructor(
    private customerService: CustomerService,
    private leadService: LeadService
  ) {
    this.initializeSearchSubscriptions();
  }

  ngOnInit() {
    this.loadCustomers();
    this.loadLeads();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSearchSubscriptions() {
    // Customer search
    this.searchSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.filterCustomers(searchTerm);
    });

    // Lead search
    this.searchLeadsSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.filterLeads(searchTerm);
    });
  }

  // Data Loading
  loadCustomers() {
    this.loading.customers = true;
    this.customerService.getCustomers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (customers) => {
        this.customers = customers;
        this.filteredCustomers = customers;
        this.loading.customers = false;
      },
      error: (error) => {
        this.showNotification('Error loading customers. Please check your backend server.', 'error');
        this.loading.customers = false;
      }
    });
  }

  loadLeads() {
    this.loading.leads = true;
    this.leadService.getLeads().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (leads) => {
        this.leads = leads;
        this.filteredLeads = leads;
        this.loading.leads = false;
      },
      error: (error) => {
        this.showNotification('Error loading leads. Please check your backend server.', 'error');
        this.loading.leads = false;
      }
    });
  }

  // Search Functionality
  onSearch() {
    this.searchSubject$.next(this.searchTerm);
  }

  onSearchLeads() {
    this.searchLeadsSubject$.next(this.searchTermLeads);
  }

  onFilterChange() {
    this.filterLeads(this.searchTermLeads);
  }

  private filterCustomers(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredCustomers = this.customers;
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredCustomers = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term) ||
      customer.address?.toLowerCase().includes(term)
    );
  }

  private filterLeads(searchTerm: string) {
    let filtered = this.leads;

    // Apply text search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        lead.phone?.toLowerCase().includes(term) ||
        lead.company?.toLowerCase().includes(term) ||
        lead.source?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(lead => lead.status === this.statusFilter);
    }

    this.filteredLeads = filtered;
  }

  // Customer Operations
  createCustomer() {
    if (!this.newCustomer.name.trim()) {
      this.showNotification('Customer name is required', 'error');
      return;
    }

    this.loading.creatingCustomer = true;
    this.customerService.createCustomer(this.newCustomer).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (customer) => {
        this.loadCustomers();
        this.resetCustomerForm();
        this.showNotification('Customer created successfully!', 'success');
        this.loading.creatingCustomer = false;
      },
      error: (error) => {
        this.showNotification('Error creating customer. Please try again.', 'error');
        this.loading.creatingCustomer = false;
      }
    });
  }

  deleteCustomer(id: number) {
    if (!this.confirmAction('Are you sure you want to delete this customer and all their images?')) {
      return;
    }

    this.customerService.deleteCustomer(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.loadCustomers();
        if (this.expandedCustomer === id) {
          this.expandedCustomer = null;
          this.customerImages = [];
        }
        this.showNotification('Customer deleted successfully', 'success');
      },
      error: (error) => {
        this.showNotification('Error deleting customer. Please try again.', 'error');
      }
    });
  }

  // Lead Operations
  createLead() {
    if (!this.newLead.name.trim()) {
      this.showNotification('Lead name is required', 'error');
      return;
    }

    this.loading.creatingLead = true;
    this.leadService.createLead(this.newLead).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (lead) => {
        this.loadLeads();
        this.resetLeadForm();
        this.showNotification('Lead created successfully!', 'success');
        this.loading.creatingLead = false;
      },
      error: (error) => {
        this.showNotification('Error creating lead. Please try again.', 'error');
        this.loading.creatingLead = false;
      }
    });
  }

  deleteLead(id: number) {
    if (!this.confirmAction('Are you sure you want to delete this lead and all their images?')) {
      return;
    }

    this.leadService.deleteLead(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.loadLeads();
        if (this.expandedLead === id) {
          this.expandedLead = null;
          this.leadImages = [];
        }
        this.showNotification('Lead deleted successfully', 'success');
      },
      error: (error) => {
        this.showNotification('Error deleting lead. Please try again.', 'error');
      }
    });
  }

  // Form Management
  resetCustomerForm() {
    this.newCustomer = { name: '' };
    this.showCreateCustomerForm = false;
  }

  resetLeadForm() {
    this.newLead = { name: '', status: 'New' };
    this.showCreateLeadForm = false;
  }

  // Image Management
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
    this.customerService.getCustomerImages(customerId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (images) => {
        this.customerImages = images;
      },
      error: (error) => {
        this.showNotification('Error loading customer images.', 'error');
      }
    });
  }

  loadLeadImages(leadId: number) {
    this.leadService.getLeadImages(leadId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (images) => {
        this.leadImages = images;
      },
      error: (error) => {
        this.showNotification('Error loading lead images.', 'error');
      }
    });
  }

  uploadCustomerImages(customerId: number, files: File[]) {
    this.convertFilesToBase64(files).then(uploadImages => {
      this.customerService.uploadImages(customerId, uploadImages).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCustomerImages(customerId);
            this.loadCustomers();
            this.showNotification(`${response.uploadedImages.length} image(s) uploaded successfully`, 'success');
          } else {
            this.showNotification(response.message, 'error');
          }
        },
        error: (error) => {
          this.showNotification('Error uploading images. Please try again.', 'error');
        }
      });
    }).catch(error => {
      this.showNotification('Error processing image files.', 'error');
    });
  }

  uploadLeadImages(leadId: number, files: File[]) {
    this.convertFilesToBase64(files).then(uploadImages => {
      this.leadService.uploadImages(leadId, uploadImages).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadLeadImages(leadId);
            this.loadLeads();
            this.showNotification(`${response.uploadedImages.length} image(s) uploaded successfully`, 'success');
          } else {
            this.showNotification(response.message, 'error');
          }
        },
        error: (error) => {
          this.showNotification('Error uploading images. Please try again.', 'error');
        }
      });
    }).catch(error => {
      this.showNotification('Error processing image files.', 'error');
    });
  }

  deleteCustomerImage(customerId: number, image: Image) {
    this.customerService.deleteImage(customerId, image.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.loadCustomerImages(customerId);
        this.loadCustomers();
        this.showNotification('Image deleted successfully', 'success');
      },
      error: (error) => {
        this.showNotification('Error deleting image. Please try again.', 'error');
      }
    });
  }

  deleteLeadImage(leadId: number, image: Image) {
    this.leadService.deleteImage(leadId, image.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.loadLeadImages(leadId);
        this.loadLeads();
        this.showNotification('Image deleted successfully', 'success');
      },
      error: (error) => {
        this.showNotification('Error deleting image. Please try again.', 'error');
      }
    });
  }

  // Utility Methods
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }

  trackByLeadId(index: number, lead: Lead): number {
    return lead.id;
  }

  private convertFilesToBase64(files: File[]): Promise<UploadImage[]> {
    const promises = files.map(file => this.convertFileToBase64(file));
    return Promise.all(promises);
  }

  private convertFileToBase64(file: File): Promise<UploadImage> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
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

  // Enhanced Notification System
  private showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notification = { message, type, show: true };
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification() {
    this.notification.show = false;
  }

  private confirmAction(message: string): boolean {
    return confirm(message);
  }

  // Image Modal Management - NEW: Full-screen modal methods
  showImageModal(image: Image) {
    this.selectedImage = image;
    // Add class to body to prevent scrolling
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  closeImageModal() {
    this.selectedImage = null;
    // Remove class from body and restore scrolling
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  onModalOverlayClick(event: Event) {
    event.stopPropagation();
    this.closeImageModal();
  }

  onModalContentClick(event: Event) {
    event.stopPropagation();
  }

  onModalKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeImageModal();
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  // Legacy methods for backward compatibility
  private showSuccessNotification(message: string) {
    this.showNotification(message, 'success');
  }

  private showErrorNotification(message: string) {
    this.showNotification(message, 'error');
  }
}
