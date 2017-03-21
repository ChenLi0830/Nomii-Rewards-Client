import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Location, Permissions} from 'expo';

class LocationComponent extends Component {
  state = {
    location: "",
  };
  
  async _getPosition() {
    // const {Location, Permissions} = expo;
    const {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      Location.getCurrentPositionAsync({enableHighAccuracy: true}).then((position) => {
        this.setState({lon: position.coords.longitude, lat: position.coords.latitude});
        this.callAPI();
      }).catch((e) => {
        // this one is firing the error instantly
        alert(e + ' Please make sure your location (GPS) is turned on.');
      });
      
    } else {
      throw new Error('Location permission not granted');
    }
  }
  
  componentWillMount(){
    this._getPosition();
  }
  
  
  render() {
    
    return <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>
        {JSON.stringify(this.state.location)}
      </Text>
    </View>
  }
}

// const {Location, Permissions} = expo;


// Permissions.askAsync(Permissions.LOCATION)
//     .then(data => {
//       setTimeout(()=>{
//
//         // console.warn(JSON.stringify(data));
//         let status = data.status;
//         // console.warn(status);
//         if (status === 'granted') {
//           const location = Location.getCurrentPositionAsync({enableHighAccuracy: true});
//           console.warn("set state");
//           this.setState({location});
//           // console.warn(JSON.stringify(location));
//         } else {
//           throw new Error('Location permission not granted');
//         }
//
//       }, 1000);
//
//     })
//     .catch(err => {
//       throw err;
//     });


// console.warn(status);


//Location.getCurrentPositionAsync().then((data)=>{console.warn(data)});

export default LocationComponent;