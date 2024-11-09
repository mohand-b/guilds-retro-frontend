import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {ModalData} from "../../interfaces/modal-data.interface";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {ReportReasonEnum} from "../../../routes/console/state/reports/report.model";
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule
  ],
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss']
})
export class ReportFormComponent implements OnInit, ModalData {

  reasonControl = new FormControl('', [Validators.required]);
  otherReasonControl = new FormControl({value: '', disabled: true});

  conditionMet: WritableSignal<boolean> = signal<boolean>(false);

  public reasons = Object.values(ReportReasonEnum).map(reason => ({
    label: this.getReasonText(reason as ReportReasonEnum),
    value: reason
  }));

  ngOnInit(): void {
    this.reasonControl.valueChanges.subscribe(reason => {
      this.updateOtherReasonControlState(reason as string);
    });

    combineLatest({
      reason: this.reasonControl.valueChanges,
      otherReason: this.otherReasonControl.valueChanges
    }).subscribe(({reason, otherReason}) => {
      this.conditionMet.set(reason === ReportReasonEnum.OTHER ? !!otherReason : !!reason);
    })
  }

  getData(): { reason: string; reasonText: string } {
    return {
      reason: this.reasonControl.value as string,
      reasonText: this.otherReasonControl.value || this.getReasonText(this.reasonControl.value as ReportReasonEnum),
    };
  }

  getReasonText(reason: ReportReasonEnum): string {
    const reasonTexts = {
      [ReportReasonEnum.INAPPROPRIATE_CONTENT]: "Ce contenu est inapproprié.",
      [ReportReasonEnum.SPAM]: "Ceci est du spam.",
      [ReportReasonEnum.HARASSMENT]: "Ceci est du harcèlement.",
      [ReportReasonEnum.CHEATING]: "Ceci est de la triche.",
      [ReportReasonEnum.OTHER]: "Autre raison"
    };
    return reasonTexts[reason] || '';
  }

  private updateOtherReasonControlState(reason: string) {
    if (reason === ReportReasonEnum.OTHER) {
      this.otherReasonControl.enable();
      this.otherReasonControl.setValidators([Validators.required]);
    } else {
      this.otherReasonControl.disable();
      this.otherReasonControl.setValue('');
      this.otherReasonControl.clearValidators();
    }
    this.otherReasonControl.updateValueAndValidity();
  }
}
