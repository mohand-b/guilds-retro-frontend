import {Meta, moduleMetadata, StoryFn} from '@storybook/angular';
import {MatButtonModule} from '@angular/material/button';

export default {
  title: 'Components/Material Button',
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule],
    }),
  ],
  argTypes: {
    label: {control: 'text'},
    color: {
      control: 'select',
      options: ['primary', 'accent', 'warn'],
    },
    disabled: {control: 'boolean'},
  },
} as Meta;

const Template: StoryFn = (args: any) => ({
  template: `
    <button mat-raised-button [color]="color" [disabled]="disabled">{{ label }}</button>
  `,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary Button',
  color: 'primary',
  disabled: false,
};

export const Accent = Template.bind({});
Accent.args = {
  label: 'Accent Button',
  color: 'accent',
  disabled: false,
};

export const Warn = Template.bind({});
Warn.args = {
  label: 'Warn Button',
  color: 'warn',
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled Button',
  color: 'primary',
  disabled: true,
};
