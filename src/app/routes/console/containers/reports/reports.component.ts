import {Component, computed, inject, OnInit, Signal} from '@angular/core';
import {ConsoleFacade} from "../../console.facade";
import {ReportDecisionEnum, ReportDto, ReportStatusEnum, ReportTypeEnum} from "../../state/reports/report.model";
import {TableModule} from "primeng/table";
import {DatePipe} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {RouterLink} from "@angular/router";
import {TagModule} from "primeng/tag";
import {ButtonModule} from "primeng/button";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {OverlayPanelModule} from "primeng/overlaypanel";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    PaginatorModule,
    RouterLink,
    TagModule,
    ButtonModule,
    DateFormatPipe,
    OverlayPanelModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  private consoleFacade = inject(ConsoleFacade);

  currentPage: Signal<number> = computed(() => this.consoleFacade.reportsPagination().currentPage);
  pageSize: number = 10
  totalReports: Signal<number> = computed(() => this.consoleFacade.reportsPagination().total);
  reports: Signal<ReportDto[]> = this.consoleFacade.reports;
  expandedRows: Record<number, boolean> = {};

  ngOnInit(): void {
    this.loadReports(this.currentPage(), this.pageSize);
  }

  loadReports(page: number, pageSize: number): void {
    this.consoleFacade.loadReports(page, pageSize).subscribe();
  }

  onPageChange(event: any): void {
    this.loadReports(event.page + 1, event.rows);
  }

  onRowExpand(event: any): void {
    this.expandedRows[event.data.id] = true;
  }

  onRowCollapse(event: any): void {
    delete this.expandedRows[event.data.id];
  }

  protected readonly ReportStatusEnum = ReportStatusEnum;
  protected readonly ReportTypeEnum = ReportTypeEnum;

  deleteReport(id: number) {
    this.consoleFacade.resolveReport(id, ReportDecisionEnum.OBJECT_DELETED).subscribe();
  }

  archiveReport(id: number) {
    this.consoleFacade.resolveReport(id, ReportDecisionEnum.IGNORED).subscribe();
  }

  protected readonly ReportDecisionEnum = ReportDecisionEnum;
}
