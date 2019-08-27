// import d3, {
//   select,
//   selectAll,
//   geoPath,
//   geoAlbersUsa,
//   max,
//   scaleSequential,
//   interpolateBlues,
//   event,
//   zoom,
//   tip,
//   extent
// } from "d3";

import React, {Component} from 'react'
import * as d3 from 'd3'

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
  
  renderMap = () => {
    const {
      states,
      mapPoints,
      selectedOption
    } = this.props;

    const svg = d3.select("svg");
    svg.select('g').remove();
    const mapG = svg.append("g");
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const colorValue = d => +d.properties[selectedOption.value];

    const margin = {
      top: 50,
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
      .scale(1600)
      .translate([innerWidth / 2, innerHeight / 2]);

    // create path variable
    var path = d3.geoPath().projection(projection);

    const blue = d3
      .scaleSequential()
      .domain(d3.extent(states.map(colorValue)))
      .interpolator(d3.interpolateBlues);

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
      .html(function(d) {
        return [
          d.properties.name,
          `<div><p>${selectedOption.name}: </p><p>${
            d.properties[selectedOption.value]
          }</p></div>`
          // "<div><p>Annual per capita consumption: </p><p>",
          // d.properties.annual_per_capita_consumption,
          // " gallons</p></div>",
          // "<div><p>Total Beer Consumption: </p><p> ",
          // d.properties.total_beer_consumption,
          // " million gallons</p></div>",
          // "<div><p>5 yr Consumption Change: </p><p>",
          // d.properties.five_yr_consumption_change,
          // "%",
          // "</p></div>",
          // "<div><p>Bars and restaurants / 100,000 people: </p><p>",
          // d.properties.bars_resturants_per_1000_people,
          // "</p></div>",
          // "<div><p>Beer tax rate: </p><p>$",
          // d.properties.beer_tax_rate,
          // " per gallon</p></div>"
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

    const circles = g.selectAll("circle").data(mapPoints);

    const circlesEnter = circles.enter().append("circle");

    circles
      .merge(circlesEnter)
      .attr("cx", d => projection(d)[0])
      .attr("cy", d => projection(d)[1])
      .attr("r", "4px")
      .attr("fill", "red");
  };
  

  render() {
    this.renderMap();
    return <svg></svg>;
  }
}
