import React from 'react'
import { StyleSheet,ScrollView,Dimensions } from 'react-native'
import { Block, theme, Text, } from "galio-framework";
const { height, width } = Dimensions.get('screen');
import { Language } from '../constants';
import config from "./../config";
import MapView , { Marker } from 'react-native-maps';




const InfoBox = (props) => {
    const cardContainer = [styles.card, styles.shadow];
    return (
        <Block row={true} card flex style={cardContainer}>
             <Block flex space="between" style={styles.cardDescription}>
                <Text bold style={styles.cardTitle}>{props.title}</Text>
                {props.children}
            </Block>
        </Block>
    )
}




function OrderDetails({navigation}){
    const order=navigation.getParam('order',{});

    function showDeliveryAddress(){
        if(order.delivery_method==1){
         return ( 
            <InfoBox title={Language.deliveryAddress}>
                 <Text  size={14} style={styles.cardTitle}>{order.address.address}</Text>
            </InfoBox>
        
         )
        }else{
          return null;
        }
      }

      function showDriver(){
        if(order.delivery_method==1&&order.driver){
         return ( 
            <InfoBox title={Language.driver}>
                 <Text  size={14} style={styles.cardTitle}>{Language.driverName+": "}{order.driver.name}</Text>
                 <Text  size={14} style={styles.cardTitle}>{Language.driverPhone+": "}{order.driver.phone}</Text>
            </InfoBox>
        
         )
        }else{
          return null;
        }
      }

      function showMap(){
        if(order.delivery_method==1&&order.driver&&order.status[order.status.length-1].alias=="picked_up"){
         return ( 
            <InfoBox title={Language.orderTracking}>
                 <MapView 
                    region={{
                        latitude: order.lat,
                        longitude:order.lng,
                        latitudeDelta: 0.008,
                        longitudeDelta: 0.009,
                    }}
                    style={[{height:300,marginVertical:10}]}
                    showsScale={true}
                    showsBuildings={true}
                >
                    <Marker 
                key={1}
                coordinate={{latitude:order.lat,longitude:order.lng}}
                title={"Location"}
                description={""} 
                />
                </MapView>
            </InfoBox>
        
         )
        }else{
          return null;
        }
      }

    return (
        <Block flex center style={styles.home}>
        <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.articles}>
                    <Block flex  >

                        {/* info */}
                        <InfoBox title={Language.order}>
                            <Text size={14} style={styles.cardTitle}>{Language.orderNumber+": #"}{order.id}</Text>
                            <Text size={14} style={styles.cardTitle}>{Language.created+": "}{order.created_at}</Text>
                            <Text bold size={14} style={styles.cardTitle}>{Language.status+": "}{order.status[order.status.length-1].name}</Text>
                        </InfoBox>

                         {/* map */}
                         {showMap()}

                        {/* Driver */}
                        {showDriver()}

                        {/* Restaurant */}
                        <InfoBox title={Language.restaurant}>
                        <Text bold style={styles.cardTitle}>{order.restorant.name}</Text>
                        <Text muted size={14} style={styles.cardTitle}>{order.restorant.address}</Text>
                        <Text size={14} style={styles.cardTitle}>{order.restorant.phone}</Text>
                        </InfoBox>

                        {/* Items */}
                        <InfoBox title={Language.items}>
                           {
                               order.items.map((item,index)=>{
                                return (
                                    <Text size={14} style={styles.cardTitle}>{item.pivot.qty+" x "+item.name}</Text>
                                )
                                })
                           }
                        </InfoBox>

                        {/* Address */}
                        {showDeliveryAddress()}

                         {/* deliveryMethod */}
                         <InfoBox title={Language.deliveryMethod}>
                         <Text size={14} style={styles.cardTitle}>{Language.deliveryMethod+": "+(order.delivery_method==1?Language.delivery:Language.pickup)}</Text>
                         <Text size={14} style={styles.cardTitle}>{(order.delivery_method==1==1?Language.deliveryTime:Language.pickupTime)+": "+order.delivery_pickup_interval}</Text>
                        </InfoBox>

                         

                        {/* summary */}
                        <InfoBox title={Language.summary}>
                            <Block row space={"between"} style={{marginTop:16}}>
                                <Block><Text bold style={[styles.cardTitle]}>{Language.subtotal}</Text></Block>
                                <Block><Text  >{order.order_price}{config.currencySign}</Text></Block>
                            </Block>
                            <Block row space={"between"} style={{marginTop:0}}>
                                <Block><Text bold style={[styles.cardTitle]}>{Language.delivery}</Text></Block>
                                <Block><Text  >{order.delivery_price}{config.currencySign}</Text></Block>
                            </Block>

                            <Block row space={"between"} style={{marginTop:16}}>
                                <Block><Text bold style={[styles.cardTitle]}>{Language.total}</Text></Block>
                                <Block><Text bold >{parseFloat(order.order_price)+parseFloat(order.delivery_price)}{config.currencySign}</Text></Block>
                            </Block>
                        </InfoBox>

                       
                    
                </Block>
            </ScrollView>
        </Block>
    )
}

export default OrderDetails

const styles = StyleSheet.create({
    home: {
        width: width,    
      },
    card: {
        backgroundColor: theme.COLORS.WHITE,
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 114,
        marginBottom: 16
      },
      cardTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingBottom: 6
      },
      cardDescription: {
        padding: theme.SIZES.BASE / 2
      },
      shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 2,
      },
      articles: {
        width: width - theme.SIZES.BASE * 2,
        paddingVertical: theme.SIZES.BASE,
      },
})
