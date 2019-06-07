/*

A Twitter's Tweet Button

*/

import React from "react";
import { connect } from "react-redux";
import { ScrollView } from "react-native";
import AdIcon from "./ad-icon";

const thisProps = ["style"];

class AdHScrollView extends React.Component {
  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }
    return (
      <ScrollView
        {...nativeProps}
        decelerationRate={"fast"}
        snapToInterval={this.props.childWidth}
        onScroll={e => console.log(e.nativeEvent)}
        horizontal={true}
        style={[this.props.style.view]}
      >
        {this.props.children}
      </ScrollView>
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
)(AdHScrollView);
