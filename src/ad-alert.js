/*

The application global alert box, should be inserted in a quite parent view.

*/

import React from "react";
import { connect } from "react-redux";
import { TouchableOpacity, View } from "react-native";
import { setValue } from "./ad-reducer";
import { AdTicker } from "./ad-animation";

const thisProps = ["animation"];

class AdAlert extends React.Component {
  constructor(props) {
    super(props);

    this.close = this.close.bind(this);

    this.state = {
      visible: false
    };

    this.el = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.formAlert === false &&
      this.props.formAlert === true &&
      this.state.visible === false
    ) {
      if (this.props.animation === "fade") {
        AdTicker.start(0.6, "easeOutQuad", p => {
          this.el.setNativeProps({ style: { opacity: p } });
        });
      }
      this.setState({ visible: true });
    } else if (
      prevProps.formAlert === true &&
      this.props.formAlert === false &&
      this.state.visible === true
    ) {
      this.setState({
        visible: false
      });
    }
  }

  close() {
    this.props.closeAlert();
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    return (
      <TouchableOpacity
        ref={el => (this.el = el)}
        onPress={() => this.close()}
        style={
          this.state.visible
            ? {
                display: "flex",
                opacity: 0,
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0
              }
            : { display: "none", opacity: 0 }
        }
      >
        <View {...nativeProps}>{this.props.children}</View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    formAlert: state.formAlert
  };
};

const mapDispatchToProps = dispatch => ({
  closeAlert: () => {
    dispatch(setValue("formAlert", false));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdAlert);
