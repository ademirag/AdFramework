/*

Just a line

*/

import React from "react";
import { connect } from "react-redux";
import { View, ImageBackground, Animated, Easing } from "react-native";

const thisProps = ["style", "data"];

class AdSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftAnimatedValue: new Animated.Value(0),
      leftValue: 0
    };

    let t_ = this;
    this.state.leftAnimatedValue.addListener(({ value }) => {
      t_.setState({
        leftValue: value
      });
    });

    this.onImageLoad = this.onImageLoad.bind(this);

    this.loadedImageCnt = 0;
  }

  animateNext() {
    let cur = this.state.leftValue;
    cur++;
    if (cur >= this.props.data.length) cur = 0;

    Animated.timing(this.state.leftAnimatedValue, {
      toValue: cur,
      duration: 400,
      delay: 3000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        leftValue: cur
      });
      this.animateNext();
    });
  }

  onImageLoad() {
    this.loadedImageCnt++;
    if (this.loadedImageCnt == this.props.data.length) {
      // this.animateNext();
    }
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    let slides = [];
    let slideL = this.props.data.length;
    for (let i = 0; i < slideL; i++) {
      let slide = (
        <View
          key={"slider-" + i}
          style={[
            {
              position: "absolute",
              left: i * (100 / slideL) + "%",
              top: 0,
              width: 100 / slideL + "%",
              height: "100%"
            }
          ]}
        >
          <ImageBackground
            source={{ uri: this.props.data[i].imageURL }}
            style={{ width: "100%", height: "100%" }}
            resizeMode={"cover"}
            onLoad={this.onImageLoad}
          />
        </View>
      );

      slides.push(slide);
    }
    return (
      <View {...nativeProps} style={[this.props.style.view, { width: "100%" }]}>
        <View
          style={{
            height: "100%",
            width: slideL * 100 + "%",
            marginLeft: this.state.leftValue * -100 + "%"
          }}
        >
          {slides}
        </View>
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
)(AdSlider);
