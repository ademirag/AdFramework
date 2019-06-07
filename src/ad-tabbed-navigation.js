/*

Bottom bar with tab buttons, and their navigations.

*/

import React from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Animated,
  TouchableOpacity,
  View,
  Image,
  Easing
} from "react-native";
import { setValue } from "./ad-reducer";
import AdBottomFix from "./ad-bottom-fix";
import { AdTicker } from "./ad-animation";
import { isIphoneX } from "./ad-utils";

class AdTabbedNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.navigate = this.navigate.bind(this);

    this.state = {
      cur: this.props.data.default,
      next: null,
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

  navigate(id) {
    if (this.state.cur === id || this.state.next !== null) return;
    this.props.animate(true);
    this.setState({
      next: id
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.next !== null && this.state.next != prevState.next) {
      Animated.timing(this.state.leftAnimatedValue, {
        toValue: -100,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true
      }).start(() => {
        this.setState({
          cur: this.state.next,
          next: null
        });
        this.props.animate(false);
        this.state.leftAnimatedValue.setValue(0);
      });

      //
      // AdTicker.start(
      //   0.25,
      //   "easeOutQuad",
      //   p => {
      //     this.stackEl.setNativeProps({ style: { left: -100 * p + "%" } });
      //   },
      //   () => {
      //     this.setState({
      //       cur: this.state.next,
      //       next: null
      //     });
      //     this.stackEl.setNativeProps({ style: { left: 0 } });
      //   }
      // );
    }
  }

  getComponent(n) {
    const l = this.props.data.tabs.length;
    for (var i = 0; i < l; i++) {
      if (this.props.data.tabs[i].name === n) {
        let Cv = this.props.data.tabs[i].component;
        try {
          return Cv(this.navigate);
        } catch (e) {
          return <Cv navigate={this.navigate} />;
        }
      }
    }
    return null;
  }

  render() {
    const cur = this.getComponent(this.state.cur);

    let next = null;
    if (this.state.next !== null) {
      next = this.getComponent(this.state.next);
    }

    let tabButtons = [];

    for (let i = 0; i < this.props.data.tabs.length; i++) {
      let tabButton = this.props.data.tabs[i];
      let el = (
        <TouchableOpacity
          onPress={() => {
            if (tabButton.onSelect) tabButton.onSelect();
            this.navigate(tabButton.name);
          }}
          key={"tabbutton_" + i}
        >
          <View
            style={
              this.state.cur === tabButton.name
                ? tabButton.selectedStyle
                : tabButton.unselectedStyle
            }
          >
            <Image
              source={tabButton.icon}
              style={
                this.state.cur === tabButton.name
                  ? { tintColor: tabButton.tintColor }
                  : { tintColor: tabButton.unselectedTintColor }
              }
            />
          </View>
        </TouchableOpacity>
      );
      tabButtons.push(el);
    }

    return (
      <View style={styles.container}>
        <View style={[styles.container, { left: this.state.leftValue + "%" }]}>
          {next !== null && (
            <View style={[styles.stackScreen, styles.stackTransitionIn]}>
              {next}
            </View>
          )}

          <View style={styles.stackScreen}>{cur}</View>
        </View>
        <View style={[this.props.data.barStyle, styles.bar]}>{tabButtons}</View>
        <AdBottomFix style={this.props.data.bottomFixStyle} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)"
  },
  bar: {
    justifyContent: isIphoneX() ? "space-around" : "space-around",
    flexDirection: "row",
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
  return {};
};

const mapDispatchToProps = dispatch => ({
  animate: v => dispatch(setValue("formAnimation", v))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdTabbedNavigation);
