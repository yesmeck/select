import expect from 'expect.js';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import Select, { Option } from 'rc-select';
import $ from 'jquery';

describe('Select', () => {
  let instance;
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('render to body works', (done) => {
    instance = ReactDOM.render(
      <Select
        value="2"
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    instance.setState({
      open: true,
    }, () => {
      expect(instance.getPopupDOMNode().parentNode
        .parentNode.parentNode.nodeName.toLowerCase()).to.be('body');
      expect(instance.getPopupDOMNode().className).not.to.contain('hidden');
      done();
    });
  });

  it('should add css class of root dom node', () => {
    instance = ReactDOM.render(
      <Select className="forTest" openClassName="my-open" value="2">
        <Option value="1">1</Option>
        <Option value="2" disabled>2</Option>
      </Select>, div);
    expect(ReactDOM.findDOMNode(instance).className.indexOf('forTest') !== -1).to.be(true);
  });

  it('should default select the right option', (done) => {
    instance = ReactDOM.render(
      <Select defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    instance.setState({
      open: true,
    }, () => {
      expect(instance.getPopupMenuComponent().instanceArray[0].isSelected()).to.be(false);
      expect(instance.getPopupMenuComponent().instanceArray[1].isSelected()).to.be(true);
      done();
    });
  });

  it('should can select multiple items', (done) => {
    instance = ReactDOM.render(
      <Select multiple value={['1', '2']}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">2</Option>
      </Select>, div);
    instance.setState({
      open: true,
    }, () => {
      expect(instance.getPopupMenuComponent().instanceArray[0].isSelected()).to.be(true);
      expect(instance.getPopupMenuComponent().instanceArray[1].isSelected()).to.be(true);
      expect(instance.getPopupMenuComponent().instanceArray[2].isSelected()).to.be(false);
      done();
    });
  });

  it('should show clear button', () => {
    instance = ReactDOM.render(
      <Select value="1" allowClear>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(instance,
      'rc-select-selection__clear')[0].style.display).to.be('block');
  });

  it('should hide clear button', () => {
    instance = ReactDOM.render(
      <Select allowClear>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(instance,
      'rc-select-selection__clear')[0].style.display).to.be('none');
  });

  it('should not response click event when select is disabled', (done) => {
    instance = ReactDOM.render(
      <Select disabled defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    Simulate.click(ReactDOM.findDOMNode(instance.refs.selection));
    expect(instance.state.open).not.to.be.ok();
    done();
  });

  it('should show selected value in singleMode when close', (done) => {
    instance = ReactDOM.render(
      <Select value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    expect($(ReactDOM.findDOMNode(instance))
      .find('.rc-select-selection-selected-value').length).to.be(1);
    done();
  });

  it('should show placeholder in singleMode when value is undefined', (done) => {
    instance = ReactDOM.render(
      <Select placeholder="aaa">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    expect($(ReactDOM.findDOMNode(instance))
      .find('.rc-select-selection__placeholder').length).to.be(1);
    done();
  });

  describe('when open', function test() {
    this.timeout(400000);

    beforeEach((done) => {
      div = document.createElement('div');

      div.tabIndex = 0;
      document.body.appendChild(div);

      instance = ReactDOM.render(
        <Select>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
        div);


      Simulate.click(ReactDOM.findDOMNode(instance.refs.selection));
      done();
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(div);
    });

    it('should show not found', (done) => {
      instance.getInputDOMNode().value = '4';
      Simulate.change(instance.getInputDOMNode());
      setTimeout(() => {
        expect($(instance.getPopupDOMNode())
          .find('.rc-select-dropdown-menu-item').length).to.be(1);
        expect($(instance.getPopupDOMNode())
          .find('.rc-select-dropdown-menu-item')[0].innerHTML).to.be('Not Found');
        done();
      }, 100);
    });

    it('should show search input in single selection trigger', (done) => {
      expect($(instance.getInputDOMNode()).parents('.rc-select-open').length).to.be(1);
      done();
    });
  });

  it('display correct combobox label when it\'s under controllered', (done) => {
    class App extends Component {
      state = {
        value: {
          label: '',
          key: '',
        },
      }

      render() {
        return (
          <Select
            combobox
            labelInValue
            value={this.state.value}
            optionLabelProp="children"
          >
            <Option value="1">One</Option>
            <Option value="2">Two</Option>
          </Select>
        );
      }
    }

    instance = ReactDOM.render(<App />, div);
    instance.setState({ value: { label: 'One', key: '1' } }, () => {
      const input = TestUtils.findRenderedDOMComponentWithTag(instance, 'input');
      expect(input.value).to.be('One');
      done();
    });
  });
});
