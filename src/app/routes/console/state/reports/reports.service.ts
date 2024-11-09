import {inject, Injectable} from "@angular/core";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CreateReportDto} from "./report.model";

@Injectable({providedIn: 'root'})
export class ReportsService {

  private http = inject(HttpClient);

  private readonly reportsBaseUrl = `${environment.apiUrl}/reports`;

  report(createReportDto: CreateReportDto) {
    return this.http.post(
      `${this.reportsBaseUrl}`,
      createReportDto,
    );
  }

}
