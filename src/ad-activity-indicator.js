/*

A native activity indicator wrapper that
shows itself if the form state changes to loading

*/

import React from "react";
import { connect } from "react-redux";
import { ActivityIndicator } from "react-native";

// To seprate Ad's props from native ones
const thisProps = ["formName"];

class AdActivityIndicator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Fix part for seprating Ad's props.
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    // FormState's defines if activityindicator is visible

    if (this.props.formState[this.props.formName] === "loading") {
      return <ActivityIndicator {...nativeProps} />;
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => {
  return {
    formState: state.formState
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdActivityIndicator);
