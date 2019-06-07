/*

Form information connected text input with several options.

*/

import React from "react";
import { connect } from "react-redux";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import {
  setKeyValue,
  setValue,
  setDeepKeyValue,
  formSubmit
} from "./ad-reducer";

import AdValidation from "./ad-validation";
import AdFormSubmitter from "./ad-form-submitter";
import AdIcon from "./ad-icon";

const thisProps = ["fieldName", "style", "validation", "fieldTitle"];

class AdTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);

    this.state = {
      clearable: false
    };

    this.element = null;
  }

  componentDidMount() {
    let v = this.getValue();
    if (!this.props.fields[this.props.fieldName]) {
      this.props.setField(this.props.fieldName, v, this.validate(v));
    }
  }

  validate(text) {
    let isValid = this.props.validation
      ? AdValidation.validate(
          text,
          this.props.validation,
          this.props.fieldTitle
        )
      : true;

    if (isValid === true) {
      if (
        this.props.validation &&
        this.props.validation.indexOf("sameas:") !== -1
      ) {
        let varr = this.props.validation.split(",");
        let samesEl = varr.find(function(e) {
          return e.indexOf("sameas:") === 0;
        });
        let samesField = samesEl.split(":")[1];
        if (this.props.fields[samesField] !== text) {
          isValid = AdValidation.sameAsError(this.props.fieldTitle);
        }
      }
    }

    return isValid;
  }

  onChangeText(text) {
    let isValid = this.validate(text);

    if (
      typeof isValid === "string" &&
      this.props.validation.indexOf("showValidation:onChange") !== -1
    ) {
      this.showErrorMessage(isValid);
    }
    this.props.setField(this.props.fieldName, text, isValid);

    if (this.getValue() === "") {
      this.setState({
        clearable: false
      });
    } else {
      this.setState({
        clearable: true
      });
    }
  }

  onReset(e) {
    this.onChangeText("");

    this.setState({
      clearable: false
    });
  }

  onBlur() {
    if (
      this.props.validation &&
      this.props.validation.indexOf("showValidation:onBlur") !== -1
    ) {
      let isValid = this.validate(this.getValue());

      if (typeof isValid === "string") {
        this.showErrorMessage(isValid);
      }
    }

    this.setState({
      clearable: false
    });
  }

  onFocus() {
    this.element.measureInWindow((x, y, w, h) => {
      this.props.setFocusedY(y);
    });

    if (this.getValue() === "") {
      this.setState({
        clearable: false
      });
    } else {
      this.setState({
        clearable: true
      });
    }
  }

  showErrorMessage(msg) {
    alert(msg);
  }

  getValue() {
    let v = this.props.fields[this.props.fieldName];

    v = typeof v === "string" ? v : "";

    return v;
  }

  onSubmit() {
    const fn = this.props.submitter.formName;
    const fs = AdFormSubmitter.prepareFields(this.props.fields, fn);

    this.props.submit(fn, fs, this.props.submitter.navigate);
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    let v = this.getValue();

    let st = StyleSheet.flatten(this.props.style);
    let pad = st.paddingTop;

    if (typeof pad === "undefined" || pad === null) {
      pad = 3;
    }

    let submitterEvent = this.props.submitter
      ? { onSubmitEditing: this.onSubmit }
      : {};

    let specialStyleInput;
    if (typeof this.props.specialStyle !== "undefined") {
      specialStyleInput = "input" + this.props.specialStyle;
    }

    return (
      <View style={this.props.style.view}>
        <TextInput
          ref={el => (this.element = el)}
          value={v}
          placeholder={this.props.fieldTitle}
          onChangeText={text => this.onChangeText(text)}
          onBlur={() => this.onBlur()}
          onFocus={() => this.onFocus()}
          style={[this.props.style.input, this.props.style[specialStyleInput]]}
          {...submitterEvent}
          {...nativeProps}
        />
        <TouchableOpacity
          onPress={e => this.onReset(e)}
          style={{
            position: "absolute",
            right: 0,
            display: this.state.clearable ? "flex" : "none"
          }}
        >
          <AdIcon style={this.props.style.clearIcon} name={"timesCircle"} />
        </TouchableOpacity>
      </View>
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
  },
  submit: (fn, fs, nv) => {
    dispatch(formSubmit(fn, fs, nv));
  },
  setFocusedY: y => {
    dispatch(setValue("focusedInputY", y));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdTextInput);
