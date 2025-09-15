import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status: string;
  createdDate: Date;
  imageCount: number;
}

export interface CreateLead {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status: string;
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
export class LeadService {
  private apiUrl = '/api/leads';

  constructor(private http: HttpClient) {}

  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiUrl);
  }

  getLead(id: number): Observable<Lead> {
    return this.http.get<Lead>(`${this.apiUrl}/${id}`);
  }

  createLead(lead: CreateLead): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl, lead);
  }

  updateLead(id: number, lead: CreateLead): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, lead);
  }

  deleteLead(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getLeadImages(id: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}/${id}/images`);
  }

  uploadImages(id: number, images: UploadImage[]): Observable<UploadImagesResponse> {
    return this.http.post<UploadImagesResponse>(`${this.apiUrl}/${id}/images`, images);
  }

  deleteImage(leadId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${leadId}/images/${imageId}`);
  }
}
