/*

Fix top padding for platforms.

*/

import React from "react";
import { View } from "react-native";
import { isIphoneX } from "./ad-utils";

export default class AdTopFix extends React.Component {
  render() {
    if (isIphoneX()) {
      return (
        <View
          style={[this.props.style, { flex: 1, maxHeight: 44, width: "100%" }]}
        />
      );
    } else {
      return (
        <View
          style={[this.props.style, { flex: 1, maxHeight: 20, width: "100%" }]}
        />
      );
    }
  }
}
