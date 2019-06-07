/*

Submit the forms.

*/

import React from "react";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native";
import { formSubmit } from "./ad-reducer";

const thisProps = ["fieldName"];

class AdFormSubmitter extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  static prepareFields(fields, fn) {
    const fs = {};

    for (let k in fields) {
      let arr = k.split(".");

      if (arr[0] === fn) {
        fs[k] = fields[k];
      }
    }

    return fs;
  }

  onSubmit() {
    if (this.props.onPress) {
      this.props.onPress();
    }

    const fn = this.props.formName;
    const fs = AdFormSubmitter.prepareFields(this.props.fields, fn);

    this.props.submit(fn, fs, this.props.navigate);
  }

  render() {
    if (this.props.customComponent) {
      return this.props.customComponent(this.onSubmit);
    } else {
      return (
        <TouchableOpacity onPress={this.onSubmit} style={this.props.style}>
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    fields: state.fields
  };
};

const mapDispatchToProps = dispatch => ({
  submit: (fn, fs, nv) => {
    dispatch(formSubmit(fn, fs, nv));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdFormSubmitter);
