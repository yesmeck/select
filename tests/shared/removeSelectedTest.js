/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Select from '../../src/Select';
import Option from '../../src/Option';
import { castValue } from '../util';

export default function removeSelectedTest(mode) {
  describe('remove selected options', () => {
    it('fires deselect and change', () => {
      const handleDeselect = jest.fn();
      const handleChange = jest.fn();
      const wrapper = mount(
        <Select
          value={[castValue('1'), castValue('2')]}
          onChange={handleChange}
          onDeselect={handleDeselect}
          {...{ [mode]: true }}
        >
          <Option value={castValue('1')}>1</Option>
          <Option value={castValue('2')}>2</Option>
        </Select>
      );
      wrapper.find('.rc-select-selection__choice__remove').first().simulate('click');

      expect(handleDeselect).toBeCalledWith(castValue('1'));
      expect(handleChange).toBeCalledWith([castValue('2')]);
    });

    it('noop if select is disabled', () => {
      const handleDeselect = jest.fn();
      const handleChange = jest.fn();
      const wrapper = mount(
        <Select
          value={[castValue('1')]}
          onChange={handleChange}
          onDeselect={handleDeselect}
          disabled
          {...{ [mode]: true }}
        >
          <Option value={castValue('1')}>1</Option>
          <Option value={castValue('2')}>2</Option>
        </Select>
      );
      wrapper.find('.rc-select-selection__choice__remove').first().simulate('click');

      expect(handleDeselect).not.toHaveBeenCalled();
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('wrap value when labelInValue', () => {
      const handleDeselect = jest.fn();
      const handleChange = jest.fn();
      const wrapper = mount(
        <Select
          value={[{ key: castValue('1') }, { key: castValue('2') }]}
          onChange={handleChange}
          onDeselect={handleDeselect}
          labelInValue
          {...{ [mode]: true }}
        >
          <Option value={castValue('1')}>1</Option>
          <Option value={castValue('2')}>2</Option>
        </Select>
      );
      wrapper.find('.rc-select-selection__choice__remove').first().simulate('click');

      expect(handleDeselect).toHaveBeenCalledWith({
        key: castValue('1'),
        label: castValue('1'),
      });
      expect(handleChange).toHaveBeenCalledWith([{
        key: castValue('2'),
        label: castValue('2'),
      }]);
    });

    it('remove by backspace key', () => {
      const wrapper = mount(
        <Select
          defaultValue={[castValue('1'), castValue('2')]}
          {...{ [mode]: true }}
        >
          <Option value={castValue('1')}>1</Option>
          <Option value={castValue('2')}>2</Option>
        </Select>
      );

      wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.BACKSPACE });
      expect(wrapper.state().value).toEqual([{
        key: castValue('1'),
        label: castValue('1'),
        title: undefined,
      }]);
    });

    it('remove by menu deselect', () => {
      const wrapper = mount(
        <Select
          defaultValue={[castValue('1')]}
          {...{ [mode]: true }}
        >
          <Option value={castValue('1')}>1</Option>
        </Select>
      );

      wrapper.find('.rc-select').simulate('click');
      const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
      dropdownWrapper.find('MenuItem').simulate('click');

      expect(wrapper.state().inputValue).toBe('');
      expect(wrapper.state().value).toEqual([]);
    });
  });
}
