import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@dev/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private url=`${environment.api}`
  constructor(private http: HttpClient) { }


  getConsumoMedidores(id:number, fechaIncial:string, fechaFinal:string){
    return this.http.get(`${this.url}/get-report/${id}/${fechaIncial}/${fechaFinal}/`);

  }
}
