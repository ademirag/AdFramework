/*

*/

import React from "react";
import { connect } from "react-redux";
import { Text, View, TouchableOpacity, YellowBox } from "react-native";
import { directSubmit } from "./ad-reducer";

class AdTabbedSegments extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      index: 0
    };

    YellowBox.ignoreWarnings([
      "Warning: isMounted(...) is deprecated",
      "Module RCTImageLoader"
    ]);
  }
  onMove(e) {
    let newX = e.nativeEvent.pageX - this.startX + this.state.cachedX;
    if (newX > 0) newX = 0;
    else if (newX < -(this.totalWidth - this.viewWidth))
      newX = -(this.totalWidth - this.viewWidth);

    this.element.setNativeProps({ style: { marginLeft: newX } });

    this.forceUpdate();
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
          style={
            this.state.index === i
              ? this.props.style.selectedView
              : this.props.style.unselectedView
          }
          key={this.props.formName + "_" + this.props.fieldName + "_" + i}
          onPress={() => this.onChange(i)}
        >
          <View>
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

    return <View style={this.props.style.view}>{children}</View>;
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
)(AdTabbedSegments);
