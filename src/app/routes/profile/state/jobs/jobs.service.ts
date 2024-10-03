import {inject, Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {AddJobDto, JobDto} from "./job.model";

@Injectable({providedIn: 'root'})
export class JobsService {

  private http = inject(HttpClient);
  private readonly usersBaseUrl = `${environment.apiUrl}/users`;

  addJob(addJobDto: AddJobDto): Observable<JobDto> {
    return this.http.post<JobDto>(`${this.usersBaseUrl}/jobs`, addJobDto);
  }

  removeJob(jobId: number): Observable<void> {
    return this.http.delete<void>(`${this.usersBaseUrl}/jobs/${jobId}`);
  }

  updateJobLevel(jobId: number, level: number): Observable<JobDto> {
    return this.http.patch<JobDto>(`${this.usersBaseUrl}/jobs/${jobId}/level`, {level});
  }

}
