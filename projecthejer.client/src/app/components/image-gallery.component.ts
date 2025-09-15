import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Image } from '../services/customer.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class ImageGalleryComponent implements OnInit, OnChanges {
  @Input() images: Image[] = [];
  @Input() entityId!: number;
  @Input() entityType: 'customer' | 'lead' = 'customer';
  @Output() imagesChange = new EventEmitter<Image[]>();
  @Output() upload = new EventEmitter<File[]>();
  @Output() delete = new EventEmitter<Image>();
  @Output() imageClick = new EventEmitter<Image>(); // NEW: Event for image clicks

  selectedFiles: File[] = [];
  uploading = false;
  deleting = false;
  uploadMessage = '';
  uploadSuccess = false;
  remainingSlots = 10;
  isDragOver = false;

  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  ngOnInit() {
    this.updateRemainingSlots();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['images']) {
      this.updateRemainingSlots();
    }
  }

  updateRemainingSlots() {
    this.remainingSlots = Math.max(0, 10 - this.images.length);
  }

  // Drag and Drop Handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = Array.from(event.dataTransfer?.files || []);
    this.processFiles(files);
  }

  // File Selection Handler
  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.processFiles(files);
    
    // Clear the input
    event.target.value = '';
  }

  private processFiles(files: File[]) {
    if (files.length === 0) return;

    // Filter and validate files
    const validFiles = this.validateFiles(files);
    
    if (validFiles.length === 0) {
      this.showMessage('No valid image files selected', false);
      return;
    }

    // Check remaining slots
    const availableSlots = this.remainingSlots;
    if (validFiles.length > availableSlots) {
      this.selectedFiles = validFiles.slice(0, availableSlots);
      this.showMessage(
        `Only ${availableSlots} file(s) selected due to the 10-image limit. ${validFiles.length - availableSlots} file(s) were ignored.`,
        false
      );
    } else {
      this.selectedFiles = validFiles;
      this.showMessage(
        `${validFiles.length} file(s) selected and ready for upload`,
        true
      );
    }
  }

  private validateFiles(files: File[]): File[] {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      // Check file type
      if (!this.allowedTypes.includes(file.type.toLowerCase())) {
        errors.push(`${file.name}: Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.`);
        return;
      }

      // Check file size
      if (file.size > this.maxFileSize) {
        errors.push(`${file.name}: File too large. Maximum size is 5MB.`);
        return;
      }

      // Check file name length
      if (file.name.length > 255) {
        errors.push(`${file.name}: Filename too long.`);
        return;
      }

      validFiles.push(file);
    });

    // Show errors if any
    if (errors.length > 0) {
      this.showMessage(`Validation errors:\n${errors.join('\n')}`, false);
    }

    return validFiles;
  }

  uploadSelectedFiles() {
    if (this.selectedFiles.length === 0) {
      this.showMessage('Please select files to upload', false);
      return;
    }

    if (this.uploading) {
      return;
    }

    this.uploading = true;
    this.showMessage(`Uploading ${this.selectedFiles.length} file(s)...`, true);
    
    this.upload.emit(this.selectedFiles);
    
    // Clear selected files
    this.selectedFiles = [];
    
    // Reset uploading state after a delay (will be updated by parent component)
    setTimeout(() => {
      this.uploading = false;
    }, 3000);
  }

  confirmDeleteImage(image: Image) {
    if (confirm(`Are you sure you want to delete "${image.fileName || 'this image'}"?`)) {
      this.deleteImage(image);
    }
  }

  deleteImage(image: Image) {
    if (this.deleting) return;
    
    this.deleting = true;
    this.delete.emit(image);
    
    // Reset deleting state after a delay
    setTimeout(() => {
      this.deleting = false;
    }, 2000);
  }

  // Active image click handler
  onImageClick(image: Image) {
    this.imageClick.emit(image);
  }

  showMessage(message: string, success: boolean) {
    this.uploadMessage = message;
    this.uploadSuccess = success;
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      this.uploadMessage = '';
    }, 5000);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  trackByImageId(index: number, image: Image): number {
    return image.id;
  }

  // Enhanced keyboard navigation for accessibility - Fix modal close flickering
  onModalKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeModal();
    }
  }

  // Enhanced modal click handling to prevent flickering
  onModalOverlayClick(event: Event) {
    event.stopPropagation();
    this.closeModal();
  }

  onModalContentClick(event: Event) {
    event.stopPropagation();
  }

  // Get image dimensions (for future enhancement)
  getImageDimensions(image: Image): Promise<{width: number, height: number}> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = `data:${image.contentType || 'image/jpeg'};base64,${image.imageData}`;
    });
  }

  // Download image (for future enhancement)
  downloadImage(image: Image) {
    const link = document.createElement('a');
    link.href = `data:${image.contentType || 'image/jpeg'};base64,${image.imageData}`;
    link.download = image.fileName || `image-${image.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  showImageModal(image: Image) {
    // Emit event to parent component instead of showing local modal
    this.imageClick.emit(image);
  }

  closeModal() {
    // This method is no longer needed for local modal
    // but kept for backward compatibility
  }
}
