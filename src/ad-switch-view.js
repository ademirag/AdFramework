/*

Tabs that switch current view.

*/

import React from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity, Text } from "react-native";
import { directSubmit, setKeyValue } from "./ad-reducer";

const thisProps = ["style", "labels"];

class AdField extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);

    this.state = {
      selectedIndex:
        typeof this.props.selected === "undefined" ? 0 : this.props.selected
    };
  }

  onSelect(index) {
    if (this.getSelectedIndex() !== index) {
      this.setState({
        selectedIndex: index
      });
      if (this.props.fieldName && this.props.fields[this.props.fieldName]) {
        this.props.setSelectedIndex(this.props.fieldName, index);
      }
    }
  }

  getSelectedIndex() {
    let selectedIndex;
    if (this.props.fieldName && this.props.fields[this.props.fieldName]) {
      selectedIndex = this.props.fields[this.props.fieldName];
    } else {
      selectedIndex = this.state.selectedIndex;
    }
    return selectedIndex;
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    let selectedIndex = this.getSelectedIndex();

    let buttons = [];
    let l = this.props.labels.length;
    for (let i = 0; i < l; i++) {
      let styles = [
        i === selectedIndex
          ? this.props.style.selectedButton
          : this.props.style.unselectedButton
      ];
      if (i === selectedIndex && i === 0) {
        styles.push(this.props.style.selectedFirstButton);
      } else if (i === 0) {
        styles.push(this.props.style.unselectedFirstButton);
      }
      if (i === selectedIndex && i === l - 1) {
        styles.push(this.props.style.selectedLastButton);
      } else if (i === l - 1) {
        styles.push(this.props.style.unselectedLastButton);
      }

      buttons.push(
        <TouchableOpacity
          key={"switchView_" + i}
          onPress={() => this.onSelect(i)}
          style={{ flex: 1 }}
        >
          <View style={styles}>
            <Text
              style={
                i === selectedIndex
                  ? this.props.style.selectedText
                  : this.props.style.unselectedText
              }
            >
              {this.props.labels[i]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    let current = this.props.views[selectedIndex];

    return (
      <View {...nativeProps} style={this.props.style.view}>
        <View style={this.props.style.container}>{buttons}</View>
        <View style={this.props.style.view}>{current}</View>
      </View>
    );
  }
}
// https://www.amino.fit/raceDetail/345711
const mapStateToProps = state => {
  return {
    formState: state.__formState,
    fields: state.fields
  };
};

const mapDispatchToProps = dispatch => ({
  setSelectedIndex: (fn, v) => {
    dispatch(setKeyValue("fields", fn, v));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdField);
