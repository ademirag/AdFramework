/*

Text tab segments that can be scrolled horizontally

*/

import React from "react";
import { connect } from "react-redux";
import { Text, View, TouchableOpacity, YellowBox } from "react-native";
import { directSubmit } from "./ad-reducer";
import { AdTicker } from "./ad-animation";

class AdSegments extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.start = this.start.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onUp = this.onUp.bind(this);

    this.state = {
      index: this.props.selectedIndex,
      cachedX: 0,
      padding: 0
    };

    this.startX = 0;
    this.element = null;
    this.chilElements = [];
    this.childWidths = [];
    this.childPositions = [];
    this.totalWidth = 0;
    this.viewWidth = 0;

    YellowBox.ignoreWarnings([
      "Warning: isMounted(...) is deprecated",
      "Module RCTImageLoader"
    ]);
  }

  componentDidMount() {
    let t_ = this;
    setTimeout(function() {
      t_.totalWidth = 0;
      let l = t_.props.data.length;
      for (let i = 0; i < l; i++) {
        t_.chilElements[i].measureInWindow((x, y, w, h) => {
          t_.childPositions[i] = t_.totalWidth;
          t_.totalWidth += w;
          t_.childWidths[i] = w;
        });
      }

      t_.element.measureInWindow((x, y, w, h) => {
        t_.viewWidth = w;
      });
    }, 300);
  }

  start(e) {
    this.startX = e.nativeEvent.pageX;
  }

  onMove(e) {
    let newX = e.nativeEvent.pageX - this.startX + this.state.cachedX;
    if (newX > 0) newX = 0;
    else if (newX < -(this.totalWidth - this.viewWidth))
      newX = -(this.totalWidth - this.viewWidth);

    this.element.setNativeProps({ style: { marginLeft: newX } });

    this.forceUpdate();
  }

  onUp(e) {
    let newX = e.nativeEvent.pageX - this.startX + this.state.cachedX;
    if (newX > 0) newX = 0;
    else if (newX < -(this.totalWidth - this.viewWidth))
      newX = -(this.totalWidth - this.viewWidth);

    let curX = newX;

    if (newX * -1 < this.childWidths[0] / 2) {
      newX = 0;
    } else if (
      newX * -1 >
      this.totalWidth -
        this.viewWidth -
        this.childWidths[this.childWidths.length - 1] / 2
    ) {
      newX = -(this.totalWidth - this.viewWidth);
    } else {
      let minIndex = 0;
      for (let i = 1; i < this.childPositions.length; i++) {
        let mint = Math.abs(this.childPositions[i] - newX * -1);
        let min = Math.abs(this.childPositions[minIndex] - newX * -1);
        if (min > mint) {
          minIndex = i;
        }
      }
      newX = -this.childPositions[minIndex];
    }

    AdTicker.start(0.4, "easeOutQuad", p => {
      this.element.setNativeProps({
        style: { marginLeft: curX + (newX - curX) * p }
      });
    });

    this.setState({
      cachedX: newX
    });
  }

  onChange(index) {
    if (index === this.state.index) return;

    this.setState({
      index: index
    });

    let obj = {};

    obj[this.props.fieldName] = this.props.data[index].value;

    this.props.submit(this.props.formName, obj);
  }

  render() {
    const children = [];

    const l = this.props.data.length;

    for (let i = 0; i < l; i++) {
      let item = (
        <TouchableOpacity
          key={this.props.formName + "_" + this.props.fieldName + "_" + i}
          onPress={() => this.onChange(i)}
        >
          <View
            ref={el => (this.chilElements[i] = el)}
            style={
              this.state.index === i
                ? this.props.style.selectedView
                : this.props.style.unselectedView
            }
          >
            <Text
              style={
                this.state.index === i
                  ? this.props.style.selected
                  : this.props.style.unselected
              }
            >
              {this.props.data[i].label}
            </Text>
          </View>
        </TouchableOpacity>
      );
      children.push(item);
    }

    return (
      <View
        ref={el => (this.element = el)}
        style={[this.props.style.view, { flexDirection: "row" }]}
        onStartShouldSetResponder={e => true}
        onMoveShouldSetResponder={e => true}
        onResponderGrant={this.start}
        onResponderMove={this.onMove}
        onResponderRelease={this.onUp}
        onResponderTerminationRequest={e => false}
      >
        {children}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  submit: (fn, q) => {
    dispatch(directSubmit(fn, q));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdSegments);
