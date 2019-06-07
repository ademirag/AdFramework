/*

Just a line

*/

import React from "react";
import { connect } from "react-redux";
import { View } from "react-native";

const thisProps = ["style"];

class AdHr extends React.Component {
  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    return (
      <View
        {...nativeProps}
        style={[this.props.style, { flex: 1, flexDirection: "row" }]}
      />
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdHr);
