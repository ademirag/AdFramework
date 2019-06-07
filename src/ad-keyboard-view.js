/*

A view that arranges it self according to keyboar state (shown/hidden)

*/

import React from "react";
import { connect } from "react-redux";
import { View, Keyboard, Dimensions } from "react-native";
import { AdTicker } from "./ad-animation";

const thisProps = ["style"];

class AdKeyboardView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      style: {
        top: 0
      },
      keyboardVisible: false,
      animation: null
    };

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);

    this.element = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.state.keyboardVisible != prevState.keyboardVisible ||
        this.props.focusedInputY != prevProps.focusedInputY) &&
      this.state.keyboardVisible &&
      this.props.focusedInputY > 0
    ) {
      const dim = Dimensions.get("window");

      this.setState({
        animation: "open",
        target: -Math.max(0, 300 - (dim.height - this.props.focusedInputY))
      });
    }

    if (this.state.animation != prevState.animation) {
      AdTicker.start(0.25, "linear", p => {
        console.log(p * this.state.target);
        this.element.setNativeProps({ style: { top: p * this.state.target } });
      });
    }
  }

  keyboardWillShow() {
    this.setState({
      keyboardVisible: true
    });
  }

  keyboardDidHide() {
    this.setState({
      animation: "close",
      target: 0,
      keyboardVisible: false
    });
  }

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }
    nativeProps.style = Object.assign(
      {},
      this.props.style ? this.props.style : {},
      this.state.style
    );

    return <View ref={el => (this.element = el)} {...nativeProps} />;
  }
}

const mapStateToProps = state => {
  return {
    focusedInputY: state.focusedInputY
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdKeyboardView);
