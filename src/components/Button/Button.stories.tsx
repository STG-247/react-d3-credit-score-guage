import  React from "react";
import { ComponentStory, ComponentMeta, Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> =  {
  title: "CRIFComponentLibrary/Button",
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;
export const Primary: Story = {
  render: () => <Button label="Button" />,
};

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const HelloWorld = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HelloWorld.args = {
  label: "Hello world!",
};

export const ClickMe = Template.bind({});
ClickMe.args = {
  label: "Click me!",
};