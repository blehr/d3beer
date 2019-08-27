import {csv} from 'd3-fetch'
import stateJson from './data/us-json.json'
import csvFile from './data/states.csv'
import brewJson from './data/open-beer-database-breweries.json';

import { feature } from "topojson";

export const loadData = () =>
  Promise.all([csv(csvFile)]).then(
    ([csvData]) => {
      const stateFeatures = feature(stateJson, stateJson.objects.states).features
      

      const rowById = csvData.reduce((accumulator, d) => {
        accumulator[+d.id] = d;
        return accumulator;
      }, {});

      stateFeatures.forEach(d => {
        Object.assign(d.properties, rowById[d.id]);
      });

      // filter out dc, virgin islands, Puerto Rico
      const states = stateFeatures.filter(
        s => s.id !== 11 && s.id !== 72 && s.id !== 78
      );

      const brewToReturn = brewJson.features.filter(d => d.geometry);

      return { states, us: stateJson, brews: brewToReturn };
    }
  ).catch(err => console.log(err));
