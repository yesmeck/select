/* eslint-disable no-undef */
import React from 'react';
import Select, { Option } from '../src';
import { mount, render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { castValue } from './util';

describe('Select.combobox', () => {
  it('renders correctly', () => {
    const wrapper = render(
      <Select combobox placeholder="Search">
        <Option value={castValue('1')}>1</Option>
        <Option value={castValue('2')}>2</Option>
      </Select>
    );

    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('set inputValue based on value', () => {
    const wrapper = mount(
      <Select combobox value={castValue('1')}>
        <Option value={castValue('1')}>1</Option>
        <Option value={castValue('2')}>2</Option>
      </Select>
    );

    expect(wrapper.state().inputValue).toBe('1');
  });

  it('display correct label when value changes', () => {
    const wrapper = mount(
      <Select
        combobox
        labelInValue
        value={{ value: '', key: '' }}
        optionLabelProp="children"
      >
        <Option value={castValue('1')}>One</Option>
        <Option value={castValue('2')}>Two</Option>
      </Select>
    );

    wrapper.setProps({ value: { label: 'One', key: castValue('1') } });
    expect(wrapper.find('input').props().value).toBe('One');
  });

  it('fire change event immediately when user inputing', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select combobox onChange={handleChange}>
        <Option value={castValue('11')}>11</Option>
        <Option value={castValue('22')}>22</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });

    expect(handleChange).toBeCalledWith('1');
  });

  it('set inputValue when user select a option', () => {
    const wrapper = mount(
      <Select combobox>
        <Option value={castValue('1')}>1</Option>
        <Option value={castValue('2')}>2</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());

    dropdownWrapper.find('MenuItem').first().simulate('click');
    expect(wrapper.state().inputValue).toBe('1');
  });
});
