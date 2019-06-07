/*

Form information connected search filter widget.

*/

import React from "react";
import { connect } from "react-redux";
import { TextInput, View, TouchableOpacity } from "react-native";
import { directSubmit } from "./ad-reducer";
import AdIcon from "./ad-icon";

const thisProps = ["style", "placeholder", "placeholderTextColor"];

class AdSearchFilter extends React.Component {
  constructor(props) {
    super(props);

    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      clearable: false,
      text: ""
    };

    this.textInput = null;
  }

  onChange(text) {
    let o = {};
    o[this.props.fieldName] = text;
    this.props.submit(this.props.formName, o);

    if (text === "") {
      this.setState({
        clearable: false,
        text: text
      });
    } else {
      this.setState({
        clearable: true,
        text: text
      });
    }
  }

  onReset(e) {
    this.onChange("");

    this.setState({
      clearable: false
    });
  }

  onBlur() {
    this.setState({
      clearable: false
    });
  }

  onFocus() {
    if (this.state.text === "") {
      this.setState({
        clearable: false
      });
    } else {
      this.setState({
        clearable: true
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.focused !== prevProps.focused &&
      this.props.focused === true
    ) {
      this.textInput.focus();
    }
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    return (
      <View
        {...nativeProps}
        style={[this.props.style.view, { flexDirection: "row" }]}
      >
        <AdIcon name={"search"} style={this.props.style.icon} />
        <TextInput
          ref={el => (this.textInput = el)}
          value={this.state.text}
          style={[this.props.style.input, { flex: 1 }]}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          onChangeText={text => this.onChange(text)}
          onBlur={() => this.onBlur()}
          onFocus={() => this.onFocus()}
        />
        <TouchableOpacity
          onPress={e => this.onReset(e)}
          style={{
            position: "absolute",
            right: 0,
            display: this.state.clearable ? "flex" : "none"
          }}
        >
          <AdIcon
            style={[this.props.style.resetIcon, { borderWidth: 0, top: 0 }]}
            name={"timesCircle"}
          />
        </TouchableOpacity>
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
)(AdSearchFilter);
