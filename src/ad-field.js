/*

Field based on view and edit states. In view mode it shows the value,
in edit mode it shows related input component provided.

*/

import React from "react";
import { connect } from "react-redux";
import { View, FlatList, Text } from "react-native";
import { directSubmit } from "./ad-reducer";

const thisProps = [
  "formName",
  "fieldName",
  "fieldFilter",
  "placeholderValue",
  "style",
  "label"
];

class AdField extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);

    this.state = {
      data: this.props.fieldFilter
        ? this.props.fieldFilter()
        : this.props.fields[this.props.fieldName]
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.fieldFilter &&
      this.props.fields[this.props.fieldName] !== this.state.data
    ) {
      this.setState({
        data: this.props.fields[this.props.fieldName]
      });
    }

    if (!this.props.mode) {
      if (
        this.props.formState &&
        this.props.formState[this.props.formName] !== this.state.formState
      ) {
        this.setState({
          formState: this.props.formState[this.props.formName]
        });
      }
    }
  }

  onSelect(key) {
    console.log(key);
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    let viewSpecialStyle;
    if (typeof this.props.specialStyle !== "undefined") {
      viewSpecialStyle = "view" + this.props.specialStyle;
    }

    let mode = this.props.mode ? this.props.mode : this.state.formState;

    return (
      <View
        {...nativeProps}
        style={[this.props.style.view, this.props.style[viewSpecialStyle]]}
      >
        <Text style={this.props.style.label}>{this.props.label}</Text>
        {mode !== "edit" && (
          <Text style={this.props.style.value}>
            {this.state.data ? this.state.data : this.props.placeholderValue}
          </Text>
        )}
        {mode === "edit" && this.props.children}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    formState: state.__formState,
    fields: state.fields
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdField);
