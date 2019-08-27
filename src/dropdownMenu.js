import React, { Component } from "react";
import * as d3 from "d3";

export default class DropdownMenu extends Component {
  componentDidMount() {
    this.drawSelect();
  }

  drawSelect = () => {
    const { options, onOptionClicked, selectedOption } = this.props;

    let select = d3.select("#menu").selectAll("select").data([null]);
    select = select
      .enter()
      .append("select")
      .merge(select)
      .on("change", function() {
        onOptionClicked(this.value);
      });

    const option = select.selectAll("option").data(options);
    option
      .enter()
      .append("option")
      .merge(option)
      .attr("value", d => d.value)
      .property("selected", d => d.value === selectedOption)
      .text(d => d.name);
  };

  render() {
    return <div id="menu"></div>;
  }
}
