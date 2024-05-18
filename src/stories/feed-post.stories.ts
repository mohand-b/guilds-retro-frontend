import {Meta, StoryObj} from '@storybook/angular';
import {
  CharacterClassEnum,
  GenderEnum,
  UserDto,
  UserRoleEnum,
} from '../app/routes/authenticated/state/authed/authed.model';
import {FeedPostComponent} from "../app/routes/feed/components/feed-post/feed-post.component";
import {Post} from "../app/routes/feed/state/posts/post.model";

const meta: Meta<FeedPostComponent> = {
  component: FeedPostComponent,
  argTypes: {},
};

export default meta;
type Story = StoryObj<FeedPostComponent>;

export const Defaut: Story = {
  args: {
    post: {
      id: 1,
      text: 'Hello, world!',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 1,
        username: 'JohnDoe',
        characterClass: CharacterClassEnum.IOP,
        role: UserRoleEnum.LEADER,
        guildId: 1,
        guildAlliesIds: [2],
        guild: {
          id: 1,
          name: 'GuildName',
          description: 'A powerful guild',
          members: [],
          allianceRequests: [],
          receivedRequests: [],
          allies: [{
            id: 2,
            name: 'GuildName',
            description: 'A powerful guild',
            members: [],
            allianceRequests: [],
            receivedRequests: [],
            allies: [],
          }],
        },
        gender: GenderEnum.MALE,
        level: 99,
      } as UserDto,
    } as Post,
    currentUser: {
      id: 2,
      username: 'JohnDoe',
      characterClass: CharacterClassEnum.IOP,
      role: UserRoleEnum.LEADER,
      guildId: 2,
      guildAlliesIds: [1],
      guild: {
        id: 2,
        name: 'GuildName',
        description: 'A powerful guild',
        members: [],
        allianceRequests: [],
        receivedRequests: [],
        allies: [{
          id: 1,
          name: 'GuildName',
          description: 'A powerful guild',
          members: [],
          allianceRequests: [],
          receivedRequests: [],
          allies: [],
        }],
      },
      gender: GenderEnum.MALE,
      level: 99,
    } as UserDto,
  }
}
