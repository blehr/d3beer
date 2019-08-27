import React, { Component } from "react";
import * as d3 from "d3";

import d3Tip from "d3-tip";

const showBottomTipIds = [
  23,
  33,
  50,
  36,
  25,
  9,
  44,
  26,
  55,
  27,
  38,
  46,
  30,
  16,
  53,
  41
];

export default class Map extends Component {
  getValue = (option, value) => {
    switch (option) {
      case "annual_per_capita_consumption":
        return `${value} gallons`;
      case "total_beer_consumption":
        return `${value} million gallons`;
      case "five_yr_consumption_change":
        return `${value}%`;
      case "bars_resturants_per_1000_people":
        return `${value}`;
      case "beer_tax_rate":
        return `$${value} per gallon`;
      default:
        return "";
    }
  };

  renderMap = () => {
    const { states, brews, selectedOption } = this.props;

    const svg = d3.select("svg");
    svg.select("g").remove();
    const mapG = svg.append("g");
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const colorValue = d => +d.properties[selectedOption.value];

    const margin = {
      top: 25,
      bottom: 50,
      left: 100,
      right: 100
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // set projection
    var projection = d3
      .geoAlbersUsa()
      .scale(1440)
      .translate([innerWidth / 2, innerHeight / 2 - 50]);

    // create path variable
    var path = d3.geoPath().projection(projection);

    const blue = d3
      .scaleSequential()
      .domain(d3.extent(states.map(colorValue)))
      .interpolator(d3.interpolateYlGnBu);

    const gUpdate = mapG.selectAll("g").data([null]);
    const gEnter = gUpdate.enter().append("g");
    const g = gUpdate.merge(gEnter);

    mapG.call(
      d3.zoom().on("zoom", () => {
        g.attr("transform", d3.event.transform);
      })
    );

    const statePaths = g.selectAll(".states").data(states);

    var tip = d3Tip()
      .attr("class", "d3-tip")
      .html(d => {
        return [
          d.properties.name,
          `<div><p>${selectedOption.name}: </p><p>${this.getValue(
            selectedOption.value,
            d.properties[selectedOption.value]
          )}</p></div>`
        ].join("");
      });
    mapG.call(tip);

    const statePathsEnter = statePaths
      .enter()
      .append("path")
      .attr("class", "states");

    statePaths
      .merge(statePathsEnter)
      .attr("d", path)
      .attr("fill", d => blue(colorValue(d)))
      .on("mouseover", function(d) {
        if (showBottomTipIds.includes(d.id)) {
          tip.direction("s");
        } else {
          tip.direction("n");
        }
        tip.show(d, this);
      })
      .on("mouseout", tip.hide);

    statePaths.exit().remove();

    var brewTip = d3Tip()
    .attr("class", "d3-tip")
    .html(d => {
      return [
        `${d.properties.name_breweries} - ${d.properties.city}, ${d.properties.state}`,
      ].join("");
    });
  mapG.call(brewTip);

    const brewGs = g.selectAll(".breweries").data(brews);
    const brewGsEnter = brewGs.enter().append("path");
    brewGs
      .merge(brewGsEnter)
      .attr("class", "breweries")
      .attr("d", path)
      .attr("r", "3px")
      .on("mouseover", function(d) {
        brewTip.show(d, this);
      })
      .on("mouseout", brewTip.hide);

    // const circles = g.selectAll("circle").data(mapPoints);

    // const circlesEnter = circles.enter().append("circle");

    // circles
    //   .merge(circlesEnter)
    //   .attr("cx", d => projection(d)[0])
    //   .attr("cy", d => projection(d)[1])
    //   .attr("r", "4px")
    //   .attr("fill", "red");
  };

  render() {
    this.renderMap();
    return <svg></svg>;
  }
}
