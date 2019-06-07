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

class AdStackNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.handleBackButton = this.handleBackButton.bind(this);
    this.navigate = this.navigate.bind(this);

    this.state = {
      cur: this.props.data.default,
      next: null,
      prev: null,
      backButton: false,
      stack: [this.props.data.default],
      leftAnimatedValue: new Animated.Value(0),
      leftValue: 0
    };

    let t_ = this;
    this.state.leftAnimatedValue.addListener(({ value }) => {
      t_.setState({
        leftValue: value
      });
    });
  }

  handleBackButton() {
    this.props.resetBackButton();
  }

  navigate(id, reset = false, newStack = null) {
    if (id === -1) {
      this.back();
      return;
    }
    if (this.state.cur === id) return;
    if (this.state.next !== null) return;

    if (reset && newStack === null) {
      this.setState({
        cur: id,
        stack: [id]
      });
      this.props.showBackButton(false);
    } else if (reset) {
      this.props.showBackButton(true);

      this.setState({
        next: id,
        stack: [...newStack]
      });
    } else {
      this.props.showBackButton(true);

      this.setState({
        next: id,
        stack: [...this.state.stack, this.state.cur]
      });
    }
  }

  back() {
    if (this.state.prev !== null) return;

    let cState = [...this.state.stack];
    let id = cState.pop();
    if (cState.length <= 1) {
      this.props.showBackButton(false);
    }

    this.setState({
      prev: id,
      stack: cState
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.backButtonFlag === true &&
      this.props.backButtonFlag !== prevProps.backButtonFlag
    ) {
      this.back();
    } else {
      if (this.state.next !== null && this.state.next !== prevState.next) {
        // AdTicker.start(
        //   0.4,
        //   "easeOutQuad",
        //   p => {
        //     this.stackEl.setNativeProps({ style: { left: -100 * p + "%" } });
        //   },
        //
        // );
        Animated.timing(this.state.leftAnimatedValue, {
          toValue: -100,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true
        }).start(() => {
          this.setState({
            cur: this.state.next,
            next: null
          });
          this.state.leftAnimatedValue.setValue(0);
          this.handleBackButton();
        });
      } else if (
        this.state.prev !== null &&
        this.state.prev !== prevState.prev
      ) {
        Animated.timing(this.state.leftAnimatedValue, {
          toValue: 100,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true
        }).start(() => {
          this.setState({
            cur: this.state.prev,
            prev: null
          });
          this.state.leftAnimatedValue.setValue(0);
          this.handleBackButton();
        });
        // AdTicker.start(
        //   0.4,
        //   "easeOutQuad",
        //   p => {
        //     this.stackEl.setNativeProps({ style: { left: 100 * p + "%" } });
        //   },
        //   () => {
        //     this.setState({
        //       cur: this.state.prev,
        //       prev: null
        //     });
        //     this.stackEl.setNativeProps({ style: { left: 0 } });
        //     this.handleBackButton();
        //   }
        // );
      }
    }
  }

  render() {
    const Cur = this.props.data[this.state.cur];
    let Next = null;
    if (this.state.next !== null) {
      Next = this.props.data[this.state.next];
    }
    let Prev = null;
    if (this.state.prev !== null) {
      Prev = this.props.data[this.state.prev];
    }

    return (
      <View style={[styles.container, { left: this.state.leftValue + "%" }]}>
        {Next !== null && (
          <View style={[styles.stackScreen, styles.stackTransitionIn]}>
            <Next />
          </View>
        )}
        {Prev !== null && (
          <View style={[styles.stackScreen, styles.stackTransitionOut]}>
            <Prev />
          </View>
        )}
        <View style={styles.stackScreen}>
          <Cur navigate={this.navigate} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stackScreen: {
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    position: "absolute"
  },
  stackTransitionIn: {
    left: "100%"
  },
  stackTransitionOut: {
    left: "-100%"
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
)(AdStackNavigation);
