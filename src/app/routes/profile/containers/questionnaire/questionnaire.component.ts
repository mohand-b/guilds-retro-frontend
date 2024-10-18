import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {OneWordQuestionnaireDto} from "../../state/questionnaire/questionnaire.model";
import {ProfileFacade} from "../../profile.facade";
import {singleWordValidator} from "../../../../shared/validators/single-word.validator";
import {AlertComponent} from "../../../../shared/components/alert/alert.component";
import {PageBlockComponent} from "../../../../shared/components/page-block/page-block.component";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    PageBlockComponent,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent implements OnInit {
  @Input() questionnaire: OneWordQuestionnaireDto | undefined;
  @Input() isCurrentUser: boolean = false;
  isEditable: boolean = false;
  alertMessage: string | null = null;
  private fb = inject(FormBuilder);
  public questionnaireForm = this.fb.group({
    age: ['', singleWordValidator()],
    firstName: ['', singleWordValidator()],
    favoritePizza: ['', singleWordValidator()],
    favoriteDessert: ['', singleWordValidator()],
    favoriteIceCreamFlavor: ['', singleWordValidator()],
    favoriteSeason: ['', singleWordValidator()],
    favoriteDofus: ['', singleWordValidator()],
    favoriteZone: ['', singleWordValidator()],
    favoriteFamiliar: ['', singleWordValidator()],
    reasonForRetro: ['', singleWordValidator()],
  });
  private readonly profileFacade = inject(ProfileFacade);

  ngOnInit(): void {
    if (this.questionnaire) {
      this.questionnaireForm.patchValue(this.questionnaire);
    }
  }

  onSubmit() {
    this.profileFacade.updateQuestionnaire(this.questionnaireForm.value as Partial<OneWordQuestionnaireDto>)
      .subscribe(() => {
          this.isEditable = false;
          this.alertMessage = 'Le formulaire a été enregistré avec succès sur ce compte et les comptes associés.';

          setTimeout(() => {
            this.alertMessage = null;
          }, 8000);
        }
      );
  }

  onEdit() {
    this.isEditable = true;
  }

  onCancel() {
    this.isEditable = false;
  }
}
