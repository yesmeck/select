/* eslint-disable no-undef */
import React from 'react';
import Select from '../../src/Select';
import Option from '../../src/Option';
import { mount } from 'enzyme';
import { castValue } from '../util';

export default function blurTest(mode) {
  it('clears inputValue', () => {
    const wrapper = mount(
      <Select {...{ [mode]: true }}>
        <Option value={castValue('1')}>1</Option>
        <Option value={castValue('2')}>2</Option>
      </Select>
    );

    jest.useFakeTimers();
    wrapper.find('input').simulate('change', { target: { value: '1' } });
    wrapper.find('div').first().simulate('blur');
    jest.runAllTimers();

    expect(wrapper.find('input').node.value).toBe('');
    expect(wrapper.state().inputValue).toBe('');
  });
}
