/*

A data list to show multiple items. An item must be provide apart field information.
This is not a API connected list!.

*/

import React from "react";
import { connect } from "react-redux";
import { View } from "react-native";

const thisProps = ["fieldName", "item"];

class AdDataList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }
    let item = this.props.item;

    let items = [];
    if (this.props.data[this.props.fieldName]) {
      let l = this.props.data[this.props.fieldName].length;
      for (let i = 0; i < l; i++) {
        let iData = this.props.data[this.props.fieldName][i];
        let it = item(iData);

        items.push(it);
      }
    }
    return <View {...nativeProps}>{items}</View>;
  }
}

const mapStateToProps = state => {
  return {
    data: state.fields
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdDataList);
