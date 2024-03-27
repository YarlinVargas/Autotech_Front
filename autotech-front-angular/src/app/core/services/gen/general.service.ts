import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { Observable, zip } from 'rxjs';
import { RespService } from '../../models/general/resp-service.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  ListDocumentType(): Observable<any> {
    return this.http.get<RespService>(`${this.config.base}general/listTypeDocuments`);
  }

  ListCompanies(): Observable<any> {
    return this.http.get<RespService>(`${this.config.base}general/listCompany`);
  }

  ListPlans(id: string): Observable<any> {
    return this.http.get<RespService>(`${this.config.base}general/listPlan/${id}`);
  }

  ImgEnterprise(): Observable<any> {
    return this.http.get<RespService>(`${this.config.base}general/img`);
  }
  ListFiltersConsult(): Observable<RespService[]>{
    return zip(
      this.ImgEnterprise(),
      this.ListDocumentType(),
    )
  }
}
