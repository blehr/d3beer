import { csv } from "d3-fetch";
import stateJson from "./data/us-json.json";
import csvFile from "./data/states.csv";
import drivingCsv from "./data/Impaired_Driving_Death_Rate__by_Age_and_Gender__2012___2014__All_States.csv";
import brewJson from "./data/open-beer-database-breweries.json";

import { feature } from "topojson";

export const loadData = () =>
  Promise.all([csv(csvFile), csv(drivingCsv)])
    .then(([csvData, csvDriving]) => {
      const stateFeatures = feature(stateJson, stateJson.objects.states)
        .features;
      const countyFeatures = feature(stateJson, stateJson.objects.counties)
        .features;

      const rowById = csvData.reduce((accumulator, d) => {
        accumulator[+d.id] = d;
        return accumulator;
      }, {});

      const rowByName = csvDriving.reduce((acc, d) => {
        acc[d.State] = d;
        return acc;
      }, {});


      stateFeatures.forEach(d => {
        Object.assign(d.properties, rowById[d.id]);
      });

      stateFeatures.forEach(d => {
        Object.assign(d.properties, rowByName[d.properties.name]);
      });

      // filter out dc, virgin islands, Puerto Rico
      const states = stateFeatures.filter(
        s => s.id !== 11 && s.id !== 72 && s.id !== 78
      );

      // console.log(states)

      const brewToReturn = brewJson.features.filter(d => d.geometry);
      return {
        states,
        us: stateJson,
        brews: brewToReturn,
        counties: countyFeatures
      };
    })
    .catch(err => console.log(err));
