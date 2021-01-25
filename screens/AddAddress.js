import React, { useState, useEffect } from 'react';
import MapView , { Marker } from 'react-native-maps';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Block, Text, theme,Button} from 'galio-framework'
const { width , height} = Dimensions.get('screen');
import PlacesInput from 'react-native-places-input';
import Config from './../config';
import { Language, argonTheme } from '../constants';
import { Input } from './../components'
import API from './../services/api'

function AddAddress({navigation}){
    const [places, setPlaces] = useState([]);
    const [region, setRegion] = useState(null);
    return (
    <Block flex center style={styles.home}>
            <PlacesInput
                queryTypes={Config.queryTypes}
                stylesContainer={{marginTop:100}}
                placeHolder={Language.enterYourAddress}
                googleApiKey={Config.GOOGLE_API_KEY}
                queryCountries={Config.queryCountries}
                searchRadius={Config.searchRadius}
                searchLatitude={Config.searchLatitude}
                searchLongitude={Config.searchLongitude}
                onSelect={(place) => {
                    console.log(place);
                    setPlaces([place]);
                    setRegion({
                        latitude: place.result.geometry.location.lat,
                        longitude:place.result.geometry.location.lng,
                        latitudeDelta: 0.008,
                        longitudeDelta: 0.009,
                    });
                }} 
            />
         <MapView 
            region={region}
            style={styles.home}
            showsScale={true}
            showsBuildings={true}
         >
         {places.map((marker,index) => (
                <Marker draggable
                key={index}
                coordinate={{latitude:marker.result.geometry.location.lat,longitude:marker.result.geometry.location.lng}}
                title={marker.result.name}
                description={marker.formatted_address}
                onDragEnd={(e) =>{
                    var thePlace=places[0];
                    thePlace.result.geometry.location.lat=e.nativeEvent.coordinate.latitude;
                    thePlace.result.geometry.location.lng=e.nativeEvent.coordinate.longitude;
                    
                    setPlaces([thePlace]);

                    setRegion({
                        latitude: thePlace.result.geometry.location.lat,
                        longitude:thePlace.result.geometry.location.lng,
                        latitudeDelta: 0.008,
                        longitudeDelta: 0.009,
                    });

                    
                } }
                />
            ))}
            
                
        
         </MapView>
         <Block style={styles.buttonCallout}>
                {places.length==1?<Button onPress={()=>{navigation.navigate('CompleteAddress',{
                    lat:places[0].result.geometry.location.lat,
                    lng:places[0].result.geometry.location.lng,
                    fa:places[0].result.formatted_address}
          )}} shadowless color="success">{Language.continue}</Button>:null}
            </Block>
    </Block>
    )
}
exports.AddAddress=AddAddress;

function CompleteAddress({ route, navigation }){

    const lat =navigation.getParam('lat', '');
    const lng =navigation.getParam('lng', '');

    const [fa, setFa] = useState(navigation.getParam('fa', ''));
    const [addressNumber, setAddressNumber] = useState('');
    const [intercom, setIntercom] = useState('');
    const [floor, setFloor] = useState('');
    const [entry, setEntry] = useState('');
    const [appartment, setAppartment] = useState('');

    return (
        <Block flex center>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

       
                <Text bold size={16} style={styles.title}>
                    {Language.addressDetails}
                </Text>
                <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                    <Input right placeholder={Language.address} iconContent={<Block />} value={fa} onChange={({ nativeEvent: { text } }) => setFa(text)} />
                </Block>
                <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                    <Input right placeholder={Language.addressNumber} iconContent={<Block />} value={addressNumber} onChange={({ nativeEvent: { text } }) => setAddressNumber(text)}  />
                </Block>

                <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                    <Input right placeholder={Language.appartment} iconContent={<Block />} value={appartment} onChange={({ nativeEvent: { text } }) => setAppartment(text)} />
                </Block>
                <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                    <Input right placeholder={Language.intercom} iconContent={<Block />} value={intercom} onChange={({ nativeEvent: { text } }) => setIntercom(text)}  />
                </Block>
                <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                    <Input right placeholder={Language.entry} iconContent={<Block />} value={entry} onChange={({ nativeEvent: { text } }) => setEntry(text)}  />
                </Block>
                <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                    <Input right placeholder={Language.floor} iconContent={<Block />} value={floor}onChange={({ nativeEvent: { text } }) => setFloor(text)}   />
                </Block>
                <Block center>
                <Button shadowless uppercase color="success" style={[styles.button]}  onPress={()=>{
                    API.saveAddress({
                        lng:lng,
                        lat:lat,
                        address:addressNumber+", "+fa,
                        intercom:intercom,
                        floor:floor,
                        entry:entry,
                        appartment:appartment
                    },()=>{
                        console.log("address added");
                        navigation.navigate("SelectAddress",{newAddress:fa})
                    })

                }}>
                    {Language.addAddress}
                </Button>
            </Block>
          </ScrollView>
        </Block>
    )

}
exports.CompleteAddress=CompleteAddress;

const styles = StyleSheet.create({
    button: {
        marginTop: theme.SIZES.BASE,
        marginBottom: theme.SIZES.BASE,
        width: width - theme.SIZES.BASE * 2,
        paddingHorizontal: theme.SIZES.BASE
      },
  cartCheckout: {
    backgroundColor:"white"
    },
    listStyle:{
        padding:theme.SIZES.BASE,
    },
  home: {
    width: width,    
    height: height,
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center"
  },
  buttonCallout: {
    flexDirection:'row',
    position:'absolute',
    bottom:30,
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent"
  },
  group: {
    paddingTop: theme.SIZES.BASE * 2
  },
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    marginTop: 44,
    color: argonTheme.COLORS.HEADER
  },
});