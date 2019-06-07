/*

Switches form state between view / edit

*/

import React from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity } from "react-native";
import { setKeyValue, directSubmit } from "./ad-reducer";
import AdFormSubmitter from "./ad-form-submitter";

const thisProps = ["style"];

class AdFormManager extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.submit(
      this.props.screenName,
      this.props.fields[this.props.screenName + ".key"]
    );
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    let st = this.props.formState
      ? this.props.formState[this.props.formName]
      : "view";

    if (!st) st = "view";

    return (
      <View {...nativeProps} style={[this.props.style.view]}>
        {st === "view" && (
          <TouchableOpacity
            onPress={() => {
              if (this.props.onFormStateChange) {
                this.props.onFormStateChange("edit");
              }
              this.props.onPress("edit", this.props.formName);
            }}
          >
            {this.props.editButton}
          </TouchableOpacity>
        )}

        {st === "edit" && (
          <View>
            <TouchableOpacity
              onPress={() => {
                if (this.props.onFormStateChange) {
                  this.props.onFormStateChange("view");
                }
                this.props.onPress("view", this.props.formName);
              }}
            >
              {this.props.cancelButton}
            </TouchableOpacity>
            <AdFormSubmitter
              formName={this.props.formName}
              onPress={() => {
                if (this.props.onFormStateChange) {
                  this.props.onFormStateChange("view");
                }
                this.props.onPress("view", this.props.formName);
              }}
            >
              {this.props.saveButton}
            </AdFormSubmitter>
          </View>
        )}
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

const mapDispatchToProps = dispatch => ({
  submit: (fn, k) => {
    dispatch(directSubmit(fn, { key: k }));
  },
  onPress: (m, fn) => {
    dispatch(setKeyValue("__formState", fn, m));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdFormManager);
