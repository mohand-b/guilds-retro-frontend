import {createStore, withProps} from "@ngneat/elf";
import {getAllEntities, selectAllEntities, setEntities, updateEntities, withEntities} from "@ngneat/elf-entities";
import {selectPaginationData, updatePaginationData, withPagination} from "@ngneat/elf-pagination";
import {inject, Injectable, Signal} from "@angular/core";
import {ReportsService} from "./state/reports/reports.service";
import {map, Observable, tap} from "rxjs";
import {ReportDecisionEnum, ReportDto, ReportStatusEnum, ReportTypeEnum} from "./state/reports/report.model";
import {toSignal} from "@angular/core/rxjs-interop";

export const REPORTS_STORE_NAME = 'reports';

export const reportsStore = createStore({
    name: REPORTS_STORE_NAME,
  },
  withEntities<ReportDto>(),
  withPagination(),
  withProps({
    reportTypes: []
  })
)

@Injectable({providedIn: 'root'})
export class ConsoleFacade {

  reports: Signal<ReportDto[]> = toSignal(reportsStore.pipe(
    selectAllEntities(),
    map(reports => reports.sort((a, b) => {
      if (a.status === ReportStatusEnum.PENDING && b.status !== ReportStatusEnum.PENDING) {
        return -1;
      }
      if (a.status !== ReportStatusEnum.PENDING && b.status === ReportStatusEnum.PENDING) {
        return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }))
  ), {
    initialValue: []
  });

  reportsPagination: Signal<any> = toSignal(reportsStore.pipe(selectPaginationData()));

  private reportsService = inject(ReportsService);

  loadReports(page: number, limit: number, reportTypes?: ReportTypeEnum[]): Observable<ReportDto[]> {
    return this.reportsService.getReports(page, limit, reportTypes).pipe(
      tap({
        next: (response) => {
          const {total, page, limit, data} = response;
          reportsStore.update(
            setEntities(data),
            updatePaginationData({
              currentPage: page,
              perPage: limit,
              total,
              lastPage: Math.ceil(total / limit)
            }),
          );
        },
        error: (error) => console.error(error)
      }),
      map(response => response.data)
    );
  }

  resolveReport(reportId: number, decision: ReportDecisionEnum): Observable<ReportDto> {
    return this.reportsService.resolveReport(reportId, decision).pipe(
      tap({
        next: (updatedReport) => {
          const reports: ReportDto[] = reportsStore.query(getAllEntities());

          const relatedReports: number[] = reports.filter(report => {
            if (updatedReport.reportType === ReportTypeEnum.COMMENT) {
              return report.comment?.id === updatedReport.comment?.id;
            } else if (updatedReport.reportType === ReportTypeEnum.POST) {
              return report.post?.id === updatedReport.post?.id;
            }
            return false;
          }).map(report => report.id)

          reportsStore.update(updateEntities(relatedReports, {
            status: ReportStatusEnum.PROCESSED,
            resolvedAt: updatedReport.resolvedAt,
            resolvedBy: updatedReport.resolvedBy,
            decision: updatedReport.decision
          }));
        }
      })
    );
  }


}
