import React, { Component } from "react";
import Map from "./map";
import { loadData } from "./loadData";
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
  { value: "beer_tax_rate", name: "Beer tax rate" },
  {
    value: "All Ages, 2012",
    name: "Impaired Driving Deaths All Ages - 2012"
  },
  {
    value: "All Ages, 2014",
    name: "Impaired Driving Deaths All Ages - 2014"
  },
];

export default class App extends Component {
  state = {
    states: [],
    brews: [],
    counties: [],
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
      this.setState({ states: res.states, us: res.us, brews: res.brews, counties: res.counties });
    });
  };
  onOptionClicked = property => {
    this.setState({
      selectedProperty: property,
      selectedOption: options.find(o => o.value === property)
    });
  };
  

  render() {
    const { states, selectedOption, brews, counties } = this.state;
    return <div>
      <h1>Beer in the USA</h1>
      <p>zoom in and hover to view Breweries</p>
      <DropdownMenu options={options} onOptionClicked={this.onOptionClicked} selectedOption={selectedOption} />
      <Map
        states={states}
        counties={counties}
        brews={brews}
        selectedOption={selectedOption}
      />
    </div>;
  }
}
