import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  effect,
  inject,
  signal,
  ViewChild,
  ViewContainerRef,
  WritableSignal
} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule],
})
export class GenericModalComponent implements AfterViewInit {
  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef})
  container!: ViewContainerRef;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  public buttonText: string = this.config.data.buttonText;
  public buttonColor: 'primary' | 'danger' = this.config.data.buttonColor;
  public buttonIcon: string = this.config.data.buttonIcon;
  public contentText?: string = this.config.data.contentText;
  public payload: any = this.config.data.payload;
  public contentComponent: any = this.config.data.contentComponent;
  public buttonDisabled: WritableSignal<boolean> = signal(this.config.data.disableButtonUntilConditionMet);
  private cdr = inject(ChangeDetectorRef);
  private contentComponentRef?: ComponentRef<any>;

  constructor() {
    effect(() => {
      if (this.config.data.disableButtonUntilConditionMet && this.contentComponentRef?.instance) {
        this.buttonDisabled.set(!this.contentComponentRef.instance.conditionMet());
      }
    }, {allowSignalWrites: true});
  }

  ngAfterViewInit(): void {
    if (this.contentComponent) {
      this.container.clear();
      this.contentComponentRef = this.container.createComponent(this.contentComponent);

      if (this.contentComponentRef.instance) {
        this.contentComponentRef.instance.data = this.payload;

        if (this.contentComponentRef.instance.conditionMet) {
          this.buttonDisabled.set(!this.contentComponentRef.instance.conditionMet());
        }
      }
      this.cdr.detectChanges();
    }
  }

  onCancel(): void {
    this.ref.close(null);
  }

  onAction(): void {
    const returnValue = this.contentComponentRef?.instance?.getData?.();
    this.ref.close(returnValue ?? 'OK');
  }
}
