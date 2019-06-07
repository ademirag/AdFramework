/*

A button in development.

*/

import React from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity, Text } from "react-native";
import AdValidation from "./ad-validation";
import AdIcon from "./ad-icon";

class AdButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enabled: this.props.enabled ? this.props.enabled : true
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.enableWithValidation) {
      let vals = this.props.enableWithValidation;
      let valRes = true;
      for (let k in vals) {
        let v = this.props.fields[k];

        if (AdValidation.validate(v, vals[k], "") !== true) {
          valRes = false;
          break;
        }
      }

      if (valRes === true && this.state.enabled === false) {
        this.setState({
          enabled: true
        });
      } else if (valRes === false && this.state.enabled === true) {
        this.setState({
          enabled: false
        });
      }
    }
  }

  render() {
    return (
      <TouchableOpacity
        disabled={!this.state.enabled}
        onPress={this.props.onPress}
        style={this.props.style.button}
      >
        <View
          style={[
            this.props.style.button,
            this.state.enabled === false ? this.props.style.buttonDisabled : {}
          ]}
        >
          {this.props.iconName && (
            <AdIcon
              name={this.props.iconName}
              type={this.props.iconType}
              style={this.props.style.icon}
            />
          )}
          <Text
            style={[
              this.props.style.buttonText,
              this.state.enabled === false
                ? this.props.style.buttonTextDisabled
                : {}
            ]}
          >
            {this.props.children}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    fields: state.fields
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdButton);
