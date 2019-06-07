/*

A Twitter's Tweet Button

*/

import React from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity } from "react-native";
import AdIcon from "./ad-icon";

const thisProps = ["style"];

class AdBonusButton extends React.Component {
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
        style={[
          this.props.style.view,
          { position: "absolute", right: "6%", bottom: "5%", zIndex: 9999 }
        ]}
      >
        <TouchableOpacity onPress={this.props.onPress}>
          <AdIcon
            style={this.props.style.icon}
            name={this.props.name}
            type={this.props.type}
          />
        </TouchableOpacity>
      </View>
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
)(AdBonusButton);
