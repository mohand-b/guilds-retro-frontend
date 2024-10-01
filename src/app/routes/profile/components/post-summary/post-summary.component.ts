import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PostDto} from "../../../feed/state/posts/post.model";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-post-summary',
  standalone: true,
  imports: [
    DateFormatPipe,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './post-summary.component.html',
  styleUrl: './post-summary.component.scss'
})
export class PostSummaryComponent {

  @Input() post!: PostDto;

}
