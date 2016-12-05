/* eslint-disable no-undef */
import React, { PropTypes } from 'react';
import FilterMixin from '../src/FilterMixin';
import Menu from 'rc-menu';
import OptGroup from '../src/OptGroup';
import Option from '../src/Option';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { castValue } from './util';

describe('FilterMixin', () => {
  const Select = React.createClass({
    propTypes: {
      value: PropTypes.any,
      inputValue: PropTypes.string,
    },

    mixins: [FilterMixin],

    getInitialState() {
      const value = this.props.value ? [{ key: this.props.value }] : null;
      return {
        inputValue: this.props.inputValue,
        value,
      };
    },

    render() {
      return (
        <Menu>
          {this.renderFilterOptions(this.state.inputValue)}
        </Menu>
      );
    },
  });

  describe('renderFilterOptionsFromChildren', () => {
    const filterFn = (input, child) => {
      return String(child.props.value).includes(input);
    };

    it('renders options correctly', () => {
      const wrapper = render(
        <Select inputValue="1">
          <OptGroup label="group1">
            <Option value={castValue('1')}>1</Option>
            <Option value={castValue('2')}>2</Option>
          </OptGroup>
          <OptGroup label="group2">
            <Option value={castValue('3')} disabled>3</Option>
            <Option value={castValue('4')}>4</Option>
          </OptGroup>
        </Select>
      );

      expect(renderToJson(wrapper)).toMatchSnapshot();
    });

    it('set label as key for OptGroup', () => {
      const wrapper = mount(
        <Select>
          <OptGroup key="group1">
            <Option value={castValue('1')}>1</Option>
            <Option value={castValue('2')}>2</Option>
          </OptGroup>
        </Select>
      );

      expect(wrapper.find('MenuItemGroup').props().title).toBe('group1');
    });

    it('filters children by inputValue', () => {
      const wrapper = render(
        <Select inputValue="1" filterOption={filterFn}>
          <Option value={castValue('1')}>1</Option>
          <Option value={castValue('2')}>2</Option>
          <Option value={castValue('11')} disabled>11</Option>
        </Select>
      );

      expect(renderToJson(wrapper)).toMatchSnapshot();
    });

    it('renders not found when search result is empty', () => {
      const wrapper = render(
        <Select inputValue="3" filterOption={filterFn} notFoundContent="not found">
          <Option value={castValue('1')}>1</Option>
          <Option value={castValue('2')}>2</Option>
        </Select>
      );

      expect(renderToJson(wrapper)).toMatchSnapshot();
    });

    describe('tag mode', () => {
      it('renders unlisted item in value', () => {
        const wrapper = render(
          <Select tags value={castValue('3')}>
            <Option value={castValue('1')}>1</Option>
            <Option value={castValue('2')}>2</Option>
          </Select>
        );

        expect(renderToJson(wrapper)).toMatchSnapshot();
      });

      it('renders search value when not fount', () => {
        const wrapper = render(
          <Select tags value={castValue('22')} inputValue="2" filterOption={filterFn}>
            <Option value={castValue('1')}>1</Option>
          </Select>
        );

        expect(renderToJson(wrapper)).toMatchSnapshot();
      });
    });
  });
});
