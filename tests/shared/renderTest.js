/* eslint-disable no-undef */
import React from 'react';
import Select from '../../src/Select';
import Option from '../../src/Option';
import { shallow, render } from 'enzyme';
import { shallowToJson, renderToJson } from 'enzyme-to-json';
import { castValue } from '../util';

export default function maxTagTextLengthTest(mode) {
  describe('render', () => {
    it('renders value correctly', () => {
      const wrapper = render(
        <Select
          {...{ [mode]: true } }
          value={[castValue('1'), castValue('2')]}
        >
          <Option value={castValue('1')}>1</Option>
          <Option value={castValue('2')}>2</Option>
          <Option value={castValue('3')}>2</Option>
        </Select>
      );
      expect(renderToJson(wrapper)).toMatchSnapshot();
    });


    it('truncates values by maxTagTextLength', () => {
      const wrapper = render(
        <Select
          {...{ [mode]: true } }
          value={['one', 'two']}
          maxTagTextLength={2}
        >
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
        </Select>
      );

      expect(renderToJson(wrapper)).toMatchSnapshot();
    });

    it('renders animation correctly', () => {
      const wrapper = shallow(
        <Select
          {...{ [mode]: true } }
          choiceTransitionName="slide-up"
        >
          <Option value={castValue('1')}>1</Option>
          <Option value={castValue('2')}>2</Option>
        </Select>
      );

      expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
  });
}
