import {inject, Injectable} from "@angular/core";
import {environment} from "../../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CreateReportDto, PaginatedReports, ReportDto} from "./report.model";
import {Observable} from "rxjs";

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

  getReports(page: number, limit: number, reportTypes?: string[]): Observable<PaginatedReports> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (reportTypes && reportTypes.length) {
      reportTypes.forEach(type => {
        params = params.append('reportTypes', type);
      });
    }

    return this.http.get<PaginatedReports>(this.reportsBaseUrl, {params});
  }

  resolveReport(reportId: number, decision: string): Observable<ReportDto> {
    return this.http.patch<ReportDto>(
      `${this.reportsBaseUrl}/${reportId}/resolve`,
      {decision},
    );
  }
}
