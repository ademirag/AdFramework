/*

A button in development.

*/

import React from "react";
import { connect } from "react-redux";
import { directSubmit } from "./ad-reducer";

class AdItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.submit(this.props.formName);
  }

  render() {
    let ItemComponent = this.props.component;
    let item = {};
    let cnt = 0;
    for (let i = 0; i < this.props.fieldNames.length; i++) {
      if (
        this.props.fields[this.props.formName + "." + this.props.fieldNames[i]]
      ) {
        cnt++;
      }
      item[this.props.fieldNames[i]] = this.props.fields[
        this.props.formName + "." + this.props.fieldNames[i]
      ];
    }
    if (cnt === 0) return null;
    return <ItemComponent item={item} />;
  }
}

const mapStateToProps = state => {
  return {
    fields: state.fields
  };
};

const mapDispatchToProps = dispatch => ({
  submit: fn => {
    dispatch(directSubmit(fn));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdItem);
