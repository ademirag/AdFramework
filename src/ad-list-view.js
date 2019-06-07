/*

A data list to show multiple items. An item component function must be provide apart field information.
This is a API connected list!.

*/

import React from "react";
import { connect } from "react-redux";
import { View, FlatList } from "react-native";
import { directSubmit, setKeyValue } from "./ad-reducer";

const thisProps = [
  "formName",
  "refreshing",
  "navigate",
  "itemComponent",
  "itemView",
  "style"
];

class AdListView extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onScroll = this.onScroll.bind(this);

    this.element = null;
    this.canUpdate = true;

    this.state = {
      data: this.props.data[this.props.formName],
      iteration: 0,
      refreshing: false
    };
  }

  componentDidMount() {
    if (
      typeof this.props.cache[this.props.formName + ".scrollPos"] !==
      "undefined"
    ) {
      this.canAutoScroll = true;
      for (let i = 50; i <= 10000; i += 500) {
        setTimeout(() => {
          if (this.mounted === false || !this.canAutoScroll) return;
          this.element.scrollToOffset({
            offset: Number(
              this.props.cache[this.props.formName + ".scrollPos"]
            ),
            animated: false
          });
        }, i);
      }
    } else {
      this.props.submit(this.props.formName);
    }
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.formAnimation != prevProps.formAnimation &&
      this.props.formAnimation === true
    ) {
      this.canUpdate = false;
      let scrollValue = 0;
      if (
        typeof this.props.cache[this.props.formName + ".scrollPos"] !==
        "undefined"
      ) {
        scrollValue = Math.round(
          this.props.cache[this.props.formName + ".scrollPos"] /
            this.props.itemHeight
        );
      }

      // setTimeout(() => {
      //   this.element.scrollToOffset({
      //     animted: false,
      //     offset: 0
      //   });
      // }, 1);
      // alert(scrollValue);
      // this.setState({
      //   data: this.props.data[this.props.formName].slice(0, scrollValue + 8)
      // });
    }

    if (
      this.canUpdate &&
      this.props.data[this.props.formName] !== this.state.data
    ) {
      this.setState({
        data: this.props.data[this.props.formName],
        refreshing: false
      });
    }

    if (this.props.itemComponent != prevProps.itemComponent) {
      this.setState({
        iteration: this.state.iteration + 1
      });
    }
  }

  onSelect(item) {
    if (this.props.onSelect) {
      this.props.onSelect(item);
    }
    if (this.props.navigate) {
      let fieldName = this.props.itemView + ".key";
      this.props.setField(fieldName, item.key);

      this.props.navigate(this.props.itemView);
    }
  }

  onRefresh() {
    this.props.submit(this.props.formName);
    this.setState({
      refreshing: true
    });
  }

  onScroll(e) {
    if (this.canUpdate) {
      this.props.cacheIt(this.props.formName, e.nativeEvent.contentOffset.y);
      this.canAutoScroll = false;
    }
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    let Item = this.props.itemComponent;

    let refreshHandle;

    if (this.props.refreshing) {
      refreshHandle = this.onRefresh;
    }

    return (
      <View {...nativeProps} style={this.props.style.view}>
        <FlatList
          ref={el => (this.element = el)}
          extraData={this.state.iteration}
          removeClippedSubviews={true}
          data={this.state.data}
          onRefresh={refreshHandle}
          onScroll={this.onScroll}
          scrollEventThrottle={100}
          refreshing={this.state.refreshing}
          keyExtractor={item => String(item.key)}
          style={this.props.style.list}
          renderItem={({ item }) => (
            <Item
              item={item}
              onSelect={() => {
                this.onSelect(item);
                if (this.props.onPressItem) {
                  this.props.onPressItem(item);
                }
              }}
            />
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.formData,
    cache: state.cache,
    formAnimation: state.formAnimation
  };
};

const mapDispatchToProps = dispatch => ({
  submit: fn => {
    dispatch(directSubmit(fn));
  },
  setField: (fn, v) => {
    dispatch(setKeyValue("fields", fn, v));
  },
  cacheIt: (fn, v) => {
    dispatch(setKeyValue("cache", fn + ".scrollPos", v));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdListView);
