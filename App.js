import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';

class Country {
  constructor(json) {
    this.name = json['name']['common'];
    this.region = json['region'];
    this.population = json['population'];
    this.flag = json['flags'][0];
    this.capital = json['capital'] ? json['capital'][0] : null;
    this.population = json['population'];
  }
}

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentCountry: null,
    };
  }

  componentDidMount() {
    this.getRandomCountry();
  }

  fetchAllCountries = async () => {
    const response = await fetch("https://restcountries.com/v3/all");
    const json = await response.json();
    this.countries = json.map(countryData => new Country(countryData));
    return this.countries;
  }

  getAllCountries = async () => {
    if (this.countries == null) {
      this.countries = await this.fetchAllCountries();
    }
    return this.countries;
  }

  getRandomCountry = async () => {
    const countries = await this.getAllCountries();
    const randomIndex = Math.floor(Math.random() * countries.length);
    const randomCountry = countries[randomIndex];

    this.setState({
      currentCountry: randomCountry,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.currentCountry
          ? <CountryDetails {...this.state.currentCountry} />
          : <ActivityIndicator size="large" />}
        <TouchableOpacity style={styles.roundButton} onPress={this.getRandomCountry}>
          <Icon name="repeat" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
}

const CountryDetails = (props) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Image source={{ uri: props.flag }} style={{ marginBottom: 10, width: 300, height: 200 }} />
      <CountryProperty property="Name" value={props.name} />
      <CountryProperty property="Region" value={props.region} />
      {props.capital && <CountryProperty property="Capital" value={props.capital} />}
      <CountryProperty property="Population" value={props.population.toLocaleString("en-US")} />
    </View>
  )
}

const CountryProperty = (props) => {
  return (
    <View style={{ marginBottom: 5 }}>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>{props.property + ": "}</Text>
        <Text>{props.value}</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  roundButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#1068eb',
  },
});