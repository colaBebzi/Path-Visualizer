import React from "react";
import { shallow } from "enzyme";
import Visualizer from "./visualizer";

describe("Visualizer", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Visualizer />);
    expect(wrapper).toMatchSnapshot();
  });
});
