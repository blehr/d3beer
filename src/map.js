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
    const returnValue = value ? value : "unknown";
    switch (option) {
      case "annual_per_capita_consumption":
        return `${returnValue} gallons`;
      case "total_beer_consumption":
        return `${returnValue} million gallons`;
      case "five_yr_consumption_change":
        return `${returnValue}%`;
      case "bars_resturants_per_1000_people":
        return `${returnValue}`;
      case "beer_tax_rate":
        return `$${returnValue} per gallon`;
      case "All Ages, 2012":
        return `${returnValue}`;
      case "All Ages, 2014":
        return `${returnValue}`;
      default:
        return "";
    }
  };

  renderMap = () => {
    const { states, brews, selectedOption, counties } = this.props;
    let zoom = 5;

    const svg = d3.select("svg");
    svg.select("g").remove();
    const mapG = svg.append("g");
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const colorValue = d => +d.properties[selectedOption.value];
    const drivingValue = d => +d.properties["All Ages, 2014"];

    const margin = {
      top: 25,
      bottom: 0,
      left: 10,
      right: 10
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
      .scale(innerWidth)
      .translate([
        innerWidth / 2,
        Math.min(innerWidth / 2 - 75, innerHeight / 2 - 75)
      ]);

    // create path variable
    var path = d3.geoPath().projection(projection);

    states.forEach(d => {
      d.properties.projected = projection(d3.geoCentroid(d));
    })

    const blue = d3
      .scaleSequential()
      .domain(d3.extent(states.map(colorValue)))
      .interpolator(d3.interpolateYlGnBu);

    const gUpdate = mapG.selectAll("g").data([null]);
    const gEnter = gUpdate.enter().append("g");
    const g = gUpdate.merge(gEnter);

    const scale = d3
      .scaleSqrt()
      .domain([0.1, 40])
      .range([1, 1.2]);

      
    const drivingScale = d3
      .scaleSqrt()
      .domain(d3.extent(states.map(drivingValue)))
      .range([3, 25]);

    mapG.call(
      d3.zoom().on("zoom", () => {
        zoom = d3.event.transform.k;
        if (zoom > 40) return;
        g.attr("transform", d3.event.transform);

        brewGUpdate.attr(
          "d",
          path.pointRadius(d => scale(Math.max(40 - zoom, 0.1)))
        );
      })
    );

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

    var brewTip = d3Tip()
      .attr("class", "d3-tip")
      .html(d => {
        return [
          `${d.properties.name_breweries} - ${d.properties.city}, ${d.properties.state}`
        ].join("");
      });
    mapG.call(brewTip);

    const statePaths = g.selectAll(".states").data(states);

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
        d3.select(".d3-tip")
          .attr("x", innerWidth / 2)
          .attr("y", innerHeight / 2);
      })
      .on("mouseout", tip.hide);

    statePaths.exit().remove();

    const countyPaths = g.selectAll(".counties").data(counties);

    const countyPathsEnter = countyPaths
      .enter()
      .append("path")
      .attr("class", "counties");

    countyPaths.merge(countyPathsEnter).attr("d", path);

    const brewGs = g.selectAll(".breweries").data(brews);
    const brewGsEnter = brewGs.enter().append("path");
    const brewGUpdate = brewGs
      .merge(brewGsEnter)
      .attr("class", "breweries")
      .attr("d", path.pointRadius(d => scale(39)))
      .on("mouseover", function(d) {
        brewTip.show(d, this);
      })
      .on("mouseout", brewTip.hide);

    
    
  //   const drivingGs = g.selectAll(".driving").data(states);
  //   const drivingGsEnter = drivingGs.enter().append("circle");
  //   const drivingGsUpdate = drivingGs
  //     .merge(drivingGsEnter)
  //     .attr("class", "driving")
  //     .attr('cx', d => d.properties.projected[0])
  //     .attr('cy', d => d.properties.projected[1])
  //     .attr('r', d => drivingScale(drivingValue(d)))
  };

  render() {
    this.renderMap();
    return <svg></svg>;
  }
}
