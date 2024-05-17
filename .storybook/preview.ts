import type {Preview} from "@storybook/angular";
import {Decorator} from '@storybook/angular';
import '../src/styles/main.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

const withBackground: Decorator = (storyFn: any) => {
  const story = storyFn();
  return {
    ...story,
    template: `
      <div class="body-background" style="padding: 20px;">
        ${story.template}
      </div>
    `,
  };
};

export const decorators = [
  withBackground,
];

export default preview;
