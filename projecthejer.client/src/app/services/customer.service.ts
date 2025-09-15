import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdDate: Date;
  imageCount: number;
}

export interface CreateCustomer {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Image {
  id: number;
  imageData: string;
  fileName?: string;
  contentType?: string;
  fileSize: number;
  uploadedDate: Date;
}

export interface UploadImage {
  imageData: string;
  fileName?: string;
  contentType?: string;
}

export interface UploadImagesResponse {
  success: boolean;
  message: string;
  uploadedImages: Image[];
  totalImages: number;
  remainingSlots: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // Replace hardcoded URL with configurable environment variable
  private readonly apiUrl = `${environment.apiUrl}/customers`;
  
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.status === 404) {
      errorMessage = 'API endpoint not found. Make sure the backend server is running.';
    } else if (error.status === 0) {
      errorMessage = 'Cannot connect to server. Please check your backend connection.';
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  createCustomer(customer: CreateCustomer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateCustomer(id: number, customer: CreateCustomer): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, customer).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getCustomerImages(id: number): Observable<Image[]> {
    // Replace hardcoded URL with configurable variable
    return this.http.get<Image[]>(`${this.apiUrl}/${id}/images`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  uploadImages(id: number, images: UploadImage[]): Observable<UploadImagesResponse> {
    // Replace hardcoded URL with configurable variable
    return this.http.post<UploadImagesResponse>(`${this.apiUrl}/${id}/images`, images).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteImage(customerId: number, imageId: number): Observable<void> {
    // Replace hardcoded URL with configurable variable
    return this.http.delete<void>(`${this.apiUrl}/${customerId}/images/${imageId}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}
