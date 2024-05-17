import {Meta, StoryObj} from '@storybook/angular';
import {CreatePostTriggerComponent} from "./create-post-trigger/create-post-trigger.component";
import {
  CharacterClassEnum,
  GenderEnum,
  UserDto,
  UserRoleEnum
} from "../app/routes/authenticated/state/authed/authed.model";


const meta: Meta<CreatePostTriggerComponent> = {
  component: CreatePostTriggerComponent,
  argTypes: {},
};


export default meta;
type Story = StoryObj<CreatePostTriggerComponent>;

export const Defaut: Story = {
  args: {
    currentUser: {
      id: 1,
      username: 'JohnDoe',
      characterClass: CharacterClassEnum.IOP,
      role: UserRoleEnum.LEADER,
      guild: {
        id: 1,
        name: 'GuildName',
        description: 'A powerful guild',
        members: [],
        allianceRequests: [],
        receivedRequests: [],
        allies: [],
      },
      gender: GenderEnum.MALE,
      level: 99,
    } as UserDto,
  },
};
