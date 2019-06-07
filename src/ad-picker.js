/*

Form information connected picker with several options.

*/

import React from "react";
import { connect } from "react-redux";
import { TextInput, Platform, View } from "react-native";
import { setKeyValue, setDeepKeyValue } from "./ad-reducer";
import RNPickerSelect from "react-native-picker-select";
import AdValidation from "./ad-validation";
import AdIcon from "./ad-icon";

const thisProps = ["fieldName", "validation", "fieldTitle"];

class AdPicker extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      curLabel: null
    };

    this.fieldName =
      typeof this.props.fieldName === "string"
        ? this.props.fieldName
        : this.props.fieldName[0];
    this.fieldID =
      typeof this.props.fieldName === "string" ? null : this.props.fieldName[1];
  }

  componentDidMount() {
    if (this.props.fields[this.fieldName]) {
      let l = this.props.items.length;
      for (let i = 0; i < l; i++) {
        if (this.props.items[i].value === this.props.fields[this.fieldName]) {
          this.setState({
            curLabel: this.props.items[i].label
          });
          break;
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.fields[this.fieldName] &&
      this.props.fields[this.fieldName] != prevProps.fields[this.fieldName]
    ) {
      let l = this.props.items.length;
      for (let i = 0; i < l; i++) {
        if (this.props.items[i].value === this.props.fields[this.fieldName]) {
          this.setState({
            curLabel: this.props.items[i].label
          });
          break;
        }
      }
    }
  }

  validate(val) {
    let isValid = this.props.validation
      ? AdValidation.validate(val, this.props.validation, this.props.fieldTitle)
      : true;

    return isValid;
  }

  onChange(val) {
    let isValid;
    if (val === 0) {
      isValid = this.validate("");
    } else {
      isValid = this.validate(this.props.items[val - 1]);
    }

    if (
      typeof isValid === "string" &&
      this.props.validation.indexOf("showValidation:onChange") !== -1
    ) {
      this.showErrorMessage(isValid);
    }
    if (val > 0) {
      this.setState({
        curLabel: this.props.items[val - 1].label
      });
      if (this.fieldID) {
        this.props.setField(
          this.fieldName,
          this.props.items[val - 1].label,
          isValid
        );
        this.props.setField(
          this.fieldID,
          this.props.items[val - 1].value,
          isValid
        );
      } else {
        this.props.setField(
          this.fieldName,
          this.props.items[val - 1].value,
          isValid
        );
      }

      if (this.props.onChange) {
        this.props.onChange(this.props.items[val - 1].value);
      }
    } else {
      if (this.fieldID) {
        this.props.setField(this.fieldID, null, isValid);
      }
      this.props.setField(this.fieldName, null, isValid);

      if (this.props.onChange) {
        this.props.onChange(null);
      }
    }
  }

  showErrorMessage(msg) {
    alert(msg);
  }

  getValue() {
    let v = this.props.fields[this.fieldName];

    v = typeof v !== "undefined" ? v : null;

    return v;
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1 && k !== "style") {
        nativeProps[k] = this.props[k];
      }
    }

    let v = this.getValue();

    const placeholder = {
      label: this.props.placeholder ? this.props.placeholder : "",
      value: null
    };

    const props = {
      items: this.props.items,
      onValueChange: (val, index) => this.onChange(index),
      placeholder: placeholder
    };

    if (typeof v === "number" || this.state.curLabel) {
      v = this.state.curLabel;
    } else {
      v = this.props.fieldTitle;
    }

    return (
      <RNPickerSelect {...props} value={this.props.fields[this.fieldName]}>
        <View
          style={{
            alignItems: "center"
          }}
        >
          <TextInput
            style={[
              Platform.OS === "ios"
                ? this.props.style.inputIOS
                : this.props.style.inputAndroid,
              {
                width: "100%",
                top: 0,
                right: 0
              }
            ]}
            value={v}
            editable={false}
            {...nativeProps}
          />
        </View>
        <AdIcon
          style={[
            Platform.OS === "ios"
              ? this.props.style.inputIOS
              : this.props.style.inputAndroid,
            { borderWidth: 0, position: "absolute", right: 0 }
          ]}
          name={"caretDown"}
        />
      </RNPickerSelect>
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
)(AdPicker);
