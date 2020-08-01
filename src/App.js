import React,{useState,useEffect} from 'react';
import logo from './Utils/virus.png';
import {
MenuItem,
FormControl,
Select,
Card,
CardContent,
} from '@material-ui/core';
import InfoBox from './Component/InfoBox';
import Map from './Component/Map';
import Table from './Component/Table';
import LineGraph from './Component/LineGraph';
import './App.css';
import {sortData, prettyPrintStat} from "./Utils/util"
import "leaflet/dist/leaflet.css";

function App() {


// https://disease.sh/v3/covid-19/countries
//useeffect = runs a piece of code  based on a given condition only one time data load
const [countries,setcountries]=useState([]);
const [country,setcountry]=useState('worldwide');
const [countryInfo,setcountryInfo]=useState([]);
const [tableData,setTableData]=useState([]);
const [mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796});
const [mapZoom,setMapZoom]=useState(3);
const [mapCountries,setMapCountries]=useState([]);
const [casesType, setCasesType] = useState("cases");
useEffect(()=>{

  fetch("https://disease.sh/v3/covid-19/all")
  .then(response => response.json())
  .then(data=>{
    setcountryInfo(data);
  })
},[])


useEffect(()=>{
  // async code always
     const getCountriesData= async()=>{
       await fetch("https://disease.sh/v3/covid-19/countries")
       .then((respone)=> respone.json())
       .then((data)=>{

         const countries=data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
         ));
         const sortedData=sortData(data)
         setTableData(sortedData)
         setMapCountries(data)
         setcountries(countries)
       })
     }

     getCountriesData();
  },[]);

  const onCountryChange=async(event)=>{
    const countryCode= event.target.value;
    console.log("yoo===>",countryCode);
    setcountry(countryCode)
    const url=countryCode==='worldwide' ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[countryCode]
    await fetch(url)
    .then(response => response.json())
    .then(data=>{
      setcountry(countryCode);
      setcountryInfo(data);
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(3);
    })
  }
  console.log("co",countryInfo)



  return (
    <div className="App">
      <div className="app_left">
         <div className="app_header">
        <h1> <img src={logo} alt="Logo" /> COVID-19 TRACKER</h1>
        <FormControl className="app_dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
           <MenuItem value="worldwide">Worldwide</MenuItem>
           {/* Loop through all the countries and 
           show a drop down list of the options */}
           {countries.map((country)=>(
           <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
        
          </Select>
        </FormControl>

       {/* Header done */}
      {/* Title + Select input dropdown field  done*/}
    </div>
        <div className="app_stats">
   <InfoBox 
   isRed
   active={casesType === "cases"}
   onClick={(e) => setCasesType("cases")}
   title="Coronavirus Cases" 
   cases={prettyPrintStat(countryInfo.todayCases)}  
   total={prettyPrintStat(countryInfo.cases)}/>
   <InfoBox 
   isGreen
   active={casesType === "recovered"}
   onClick={(e) => setCasesType("recovered")}
   title="Recoverd" 
   cases={prettyPrintStat(countryInfo.todayRecovered)}  
   total={prettyPrintStat(countryInfo.recovered)}/>
   <InfoBox 
   isOrange
   active={casesType === "deaths"}
   onClick={(e) => setCasesType("deaths")}
   title="Deaths" 
   cases={prettyPrintStat(countryInfo.todayDeaths)}  
   total={prettyPrintStat(countryInfo.deaths)}
   />

       {/* InfoBoxs title="Coronavirus cases"*/}
       {/* InfoBoxs title="Coronavirus  recoveries"*/}
       {/* InfoBoxs */}
      
       
       
  </div>
          {/* map */}
          <Map 
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter} 
          zoom={mapZoom}/> 
         

      </div>

       <Card className="app__right">
       {/* table */}
       {/* graph */}

         <CardContent>
           <h3 className="app__tableTitle">Live Cases by Country</h3>
           <Table countries={tableData} />
           <h3 className="app__graphTitle">Worldwide new {casesType} </h3>
           <LineGraph className="app__graph" casesType={casesType}/>
         </CardContent>
         



       </Card>
    </div>
  );
}

export default App;
