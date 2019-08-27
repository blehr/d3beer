import * as d3 from "d3";
import { map } from "./map";
import { loadData } from "./loadData";
import { mapPoints } from "./mapPoints";
import { dropdownMenu } from "./dropdownMenu";

(async function() {
  // Selecting and appending elements
  const margin = {
    top: 50,
    bottom: 50,
    left: 100,
    right: 100
  };

  const svg = d3.select("svg");
  const mapG = svg.append("g");
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  svg
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .attr("transform", `translate(${margin.left},${margin.top})`);

  let states;
  let us;
  let selectedProperty = "annual_per_capita_consumption";
  let selectedOption = {
    value: "annual_per_capita_consumption",
    name: "Annual per capita consumption"
  };
  const colorValue = d => +d.properties[selectedProperty];

  const options = [
    {
      value: "annual_per_capita_consumption",
      name: "Annual per capita consumption"
    },
    { value: "total_beer_consumption", name: "Total beer consumption" },
    { value: "five_yr_consumption_change", name: "5 yr. consumption change" },
    {
      value: "bars_resturants_per_1000_people",
      name: "Bars and restaurants per 100,000 people"
    },
    { value: "beer_tax_rate", name: "Beer tax rate" }
  ];

  loadData().then(res => {
    states = res.states;
    us = res.us;
    render();
  });

  const onOptionClicked = property => {
    selectedProperty = property;
    selectedOption = options.find(o => o.value === property);
    render();
  };

  const render = () => {
    d3.select("#menu").call(dropdownMenu, {
      options: options,
      onOptionClicked: onOptionClicked,
      selectedOption: selectedProperty
    });
    map(mapG, {
      states,
      us,
      selectedProperty,
      selectedOption,
      colorValue,
      mapPoints,
      innerHeight,
      innerWidth
    });
  };
})();

// https://gist.github.com/mbostock/4090848#gistcomment-2102151 csv data
// https://247wallst.com/special-report/2018/04/30/states-drinking-the-most-beer-2/
