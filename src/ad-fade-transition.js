/*

Stack navigation where screens added comes from right to the left,
with 'back' enabled.

*/

import React from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  Animated,
  Easing
} from "react-native";
import { setValue } from "./ad-reducer";
import { AdTicker } from "./ad-animation";

class AdFadeTransition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animatedValue: new Animated.Value(1),
      value: 1
    };

    let t_ = this;
    this.state.animatedValue.addListener(({ value }) => {
      t_.setState({
        value: value
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.fading === true && this.props.fading !== prevProps.fading) {
      alert("fading");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.stackScreen1, { opacitiy: value }]}>
          {this.props.children[0]}
        </View>
        <View style={styles.stackScreen2}>{this.props.children[1]}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stackScreen1: {
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 10
  },
  stackScreen2: {
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 5
  }
});

const mapStateToProps = state => {
  return {
    backButtonFlag: state.__backButtonFlag
  };
};

const mapDispatchToProps = dispatch => ({
  showBackButton: v => {
    dispatch(setValue("__showBackButton", v));
  },
  resetBackButton: () => {
    dispatch(setValue("__backButtonFlag", false));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdFadeTransition);
