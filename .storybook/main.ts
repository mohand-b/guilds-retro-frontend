import type {StorybookConfig} from "@storybook/angular";

const path = require('path');

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  webpackFinal: async (config) => {
    config.module.rules = config.module.rules.filter((rule) => {
      return !(
        rule &&
        typeof rule !== 'string' &&
        typeof rule.test !== 'undefined' &&
        rule.test.toString().includes('scss')
      );
    });

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            },
          },
        },
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            implementation: require('sass'),
            sassOptions: {
              includePaths: [path.resolve(__dirname, '../src')],
            },
          },
        },
      ],
      include: path.resolve(__dirname, '../src'),
    });

    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: path.resolve(__dirname, '../src'),
    });

    return config;
  },
};
export default config;
