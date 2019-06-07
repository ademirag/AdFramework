/*

Fix bottom padding for platforms.

*/

import React from "react";
import { View } from "react-native";
import { isIphoneX } from "./ad-utils";

export default class AdBottomFix extends React.Component {
  render() {
    if (isIphoneX()) {
      return <View style={[this.props.style, { height: 25, width: "100%" }]} />;
    } else {
      return null;
    }
  }
}
