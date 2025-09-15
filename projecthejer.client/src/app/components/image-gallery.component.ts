import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Image } from '../services/customer.service';

@Component({
  selector: 'app-image-gallery',
  template: `
    <div class="image-gallery">
      <h4>Images ({{ images.length }}/10)</h4>
      
      <!-- Upload Section -->
      <div class="upload-section" *ngIf="remainingSlots > 0">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          (change)="onFileSelected($event)"
          #fileInput
        >
        <button 
          (click)="uploadSelectedFiles()" 
          [disabled]="!selectedFiles.length || uploading"
          class="upload-btn"
        >
          {{ uploading ? 'Uploading...' : 'Upload Images' }}
        </button>
        <p class="remaining-slots">{{ remainingSlots }} slots remaining</p>
      </div>

      <!-- Upload Message -->
      <div *ngIf="uploadMessage" class="upload-message" [ngClass]="uploadSuccess ? 'success' : 'error'">
        {{ uploadMessage }}
      </div>

      <!-- Image Gallery -->
      <div class="images-container" *ngIf="images.length > 0">
        <div class="image-item" *ngFor="let image of images; let i = index">
          <img 
            [src]="'data:' + (image.contentType || 'image/jpeg') + ';base64,' + image.imageData" 
            [alt]="image.fileName || 'Image ' + (i + 1)"
            (click)="showImageModal(image)"
          >
          <div class="image-info">
            <p class="filename">{{ image.fileName || 'Image ' + (i + 1) }}</p>
            <p class="filesize">{{ formatFileSize(image.fileSize) }}</p>
            <button 
              (click)="deleteImage(image)" 
              class="delete-btn"
              [disabled]="deleting"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Image Modal -->
      <div *ngIf="selectedImage" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <span class="close-btn" (click)="closeModal()">&times;</span>
          <img 
            [src]="'data:' + (selectedImage.contentType || 'image/jpeg') + ';base64,' + selectedImage.imageData"
            [alt]="selectedImage.fileName || 'Image'"
          >
          <div class="modal-info">
            <h4>{{ selectedImage.fileName || 'Image' }}</h4>
            <p>Size: {{ formatFileSize(selectedImage.fileSize) }}</p>
            <p>Uploaded: {{ selectedImage.uploadedDate | date:'medium' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .image-gallery {
      max-width: 800px;
      margin: 0 auto;
    }

    .upload-section {
      margin-bottom: 20px;
      padding: 15px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      text-align: center;
    }

    .upload-btn {
      margin-left: 10px;
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .upload-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .remaining-slots {
      margin-top: 10px;
      color: #666;
      font-size: 14px;
    }

    .upload-message {
      padding: 10px;
      margin-bottom: 15px;
      border-radius: 4px;
    }

    .upload-message.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .upload-message.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .images-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }

    .image-item {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      background: white;
    }

    .image-item img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      cursor: pointer;
    }

    .image-info {
      padding: 10px;
    }

    .filename {
      margin: 0 0 5px 0;
      font-weight: bold;
      font-size: 14px;
    }

    .filesize {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 12px;
    }

    .delete-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .delete-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .modal-content img {
      width: 100%;
      height: auto;
      max-height: 80vh;
      object-fit: contain;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 15px;
      color: white;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
      z-index: 1001;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-info {
      padding: 15px;
    }

    .modal-info h4 {
      margin: 0 0 10px 0;
    }

    .modal-info p {
      margin: 5px 0;
      color: #666;
    }
  `]
})
export class ImageGalleryComponent implements OnInit {
  @Input() images: Image[] = [];
  @Input() entityId!: number;
  @Input() entityType: 'customer' | 'lead' = 'customer';
  @Output() imagesChange = new EventEmitter<Image[]>();
  @Output() upload = new EventEmitter<File[]>();
  @Output() delete = new EventEmitter<Image>();

  selectedFiles: File[] = [];
  uploading = false;
  deleting = false;
  uploadMessage = '';
  uploadSuccess = false;
  selectedImage: Image | null = null;
  remainingSlots = 10;

  ngOnInit() {
    this.updateRemainingSlots();
  }

  updateRemainingSlots() {
    this.remainingSlots = 10 - this.images.length;
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (this.selectedFiles.length > this.remainingSlots) {
      this.selectedFiles = this.selectedFiles.slice(0, this.remainingSlots);
      this.showMessage(`Only ${this.remainingSlots} images can be selected (remaining slots)`, false);
    }
  }

  uploadSelectedFiles() {
    if (this.selectedFiles.length === 0) return;

    this.upload.emit(this.selectedFiles);
  }

  deleteImage(image: Image) {
    if (confirm('Are you sure you want to delete this image?')) {
      this.delete.emit(image);
    }
  }

  showImageModal(image: Image) {
    this.selectedImage = image;
  }

  closeModal() {
    this.selectedImage = null;
  }

  showMessage(message: string, success: boolean) {
    this.uploadMessage = message;
    this.uploadSuccess = success;
    setTimeout(() => {
      this.uploadMessage = '';
    }, 5000);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
