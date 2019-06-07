/*

Header with several options, like title or custom component,
back button, right component....

*/

import React from "react";
import { connect } from "react-redux";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { setKeyValue } from "./ad-reducer";

import AdIcon from "./ad-icon";
import AdTopFix from "./ad-top-fix";

const thisProps = ["style", "backButton", "title"];

class AdHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1 && k !== "style") {
        nativeProps[k] = this.props[k];
      }
    }

    let middle;

    if (this.props.title) {
      middle = <Text style={this.props.style.title}>{this.props.title}</Text>;
    } else {
      middle = this.props.children;
    }

    let justifyContent = "center";
    if (
      this.props.backButton ||
      (this.props.title &&
        this.props.children &&
        this.props.children.length > 0)
    ) {
      justifyContent = "space-around";
    }

    let left;

    if (this.props.backButton) {
      left = (
        <TouchableOpacity onPress={() => this.props.navigate(-1)}>
          {this.props.backButton}
        </TouchableOpacity>
      );
    } else {
      left = <View />;
    }

    let right;

    if (this.props.title) {
      if (this.props.children) right = this.props.children;
      else {
        right = <View />;
      }
    } else {
      right = <View />;
    }

    return (
      <React.Fragment>
        <AdTopFix style={this.props.style.topFix} />
        <View
          {...nativeProps}
          style={[
            this.props.style.view,
            {
              justifyContent: justifyContent,
              alignItems: "center",
              flexDirection: "row"
            }
          ]}
        >
          {left}
          {middle}
          {right}
        </View>
      </React.Fragment>
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
)(AdHeader);
