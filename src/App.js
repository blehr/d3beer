import React, { Component } from "react";
import Map from "./map";
import { loadData } from "./loadData";
import { mapPoints } from "./mapPoints";
import DropdownMenu from "./dropdownMenu";

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

export default class App extends Component {
  state = {
    states: [],
    us: {},
    selectedProperty: "annual_per_capita_consumption",
    selectedOption: {
      value: "annual_per_capita_consumption",
      name: "Annual per capita consumption"
    },
  };
  componentDidMount() {
    this.loadAllData();
  }
  
  loadAllData = () => {
    loadData().then(res => {
      this.setState({ states: res.states, us: res.us });
    });
  };
  onOptionClicked = property => {
    this.setState({
      selectedProperty: property,
      selectedOption: options.find(o => o.value === property)
    });
  };
  

  render() {
    const { states, selectedOption } = this.state;
    return <div>
      <DropdownMenu options={options} onOptionClicked={this.onOptionClicked} selectedOption={selectedOption} />
      <Map
        states={states}
        selectedOption={selectedOption}
        mapPoints={mapPoints}
      />
    </div>;
  }
}
