import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = '/api/customers';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: CreateCustomer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: number, customer: CreateCustomer): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCustomerImages(id: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}/${id}/images`);
  }

  uploadImages(id: number, images: UploadImage[]): Observable<UploadImagesResponse> {
    return this.http.post<UploadImagesResponse>(`${this.apiUrl}/${id}/images`, images);
  }

  deleteImage(customerId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${customerId}/images/${imageId}`);
  }
}
