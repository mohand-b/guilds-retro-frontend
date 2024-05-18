import {Component, inject, Input, OnInit} from '@angular/core';
import {Post} from "../../state/posts/post.model";
import {CharacterIconPipe} from "../../../../shared/pipes/character-icon.pipe";
import {DatePipe, NgIf} from "@angular/common";
import {GuildMembershipPipe} from "../../../../shared/pipes/guild-membership.pipe";
import {AuthenticatedFacade} from "../../../authenticated/authenticated.facade";
import {UserDto} from "../../../authenticated/state/authed/authed.model";

@Component({
  selector: 'app-feed-post',
  standalone: true,
  imports: [
    CharacterIconPipe,
    DatePipe,
    GuildMembershipPipe,
    NgIf
  ],
  templateUrl: './feed-post.component.html',
  styles: ``
})
export class FeedPostComponent implements OnInit {

  @Input() post!: Post;
  @Input() currentUser!: UserDto;
  private authedFacade = inject(AuthenticatedFacade);

  ngOnInit() {
  }
}
