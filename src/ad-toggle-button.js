/*

A toggle button

*/

import React from "react";
import { connect } from "react-redux";
import { TouchableOpacity, View } from "react-native";
import { setKeyValue, setDeepKeyValue } from "./ad-reducer";
import AdValidation from "./ad-validation";

const thisProps = ["fieldName", "validation", "fieldTitle"];

class AdToggleButton extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    let cv = this.getValue();

    let v = !cv;

    let valid = this.props.validation
      ? AdValidation.validate(
          v ? "true" : "",
          this.props.validation,
          this.props.fieldTitle
        )
      : true;

    this.props.setField(this.props.fieldName, v, valid);
  }

  getValue() {
    let v = this.props.fields[this.props.fieldName];

    v = typeof v === "boolean" ? v : false;

    return v;
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    let v = this.getValue();

    let childrenArr = [];

    let cl = this.props.children.length;

    for (let i = 0; i < cl; i++) {
      let c = this.props.children[i];
      if (c.props.whenChecked === true && v) {
        childrenArr.push(c);
      } else if (c.props.whenUnchecked === true && !v) {
        childrenArr.push(c);
      } else if (
        typeof c.props.whenUnchecked === "undefined" &&
        typeof c.props.whenChecked === "undefined"
      ) {
        childrenArr.push(c);
      }
    }

    return (
      <TouchableOpacity onPress={() => this.toggle()}>
        <View {...nativeProps}>{childrenArr}</View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    fields: state.fields
  };
};

const mapDispatchToProps = dispatch => ({
  setField: (n, v, iv) => {
    dispatch(setKeyValue("fields", n, v));
    dispatch(setDeepKeyValue("fields", "validation", n, iv));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdToggleButton);
