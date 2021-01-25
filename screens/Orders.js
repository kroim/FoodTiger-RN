import React, { useState, useEffect,useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl
} from "react-native";
import { Block, theme, Text, } from "galio-framework";
import {Language } from "../constants";
const { width, } = Dimensions.get("screen");
import Empty from './../components/Empty';
import  SimpleRow from './../components/SimpleRow'
import API from './../services/api'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from "../components/";
import Tabs from './../components/Tabs';
import Button from './../components/Button';
import { or } from 'react-native-reanimated';
import config from './../config'
import { FancyAlert, LoadingIndicator } from 'react-native-expo-fancy-alerts';
import { NavigationEvents } from 'react-navigation';

function Orders({navigation}){
    
    const [orders,setOrders]=useState([]);
    const [ordersLoaded,setOrdersLoaded]=useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const cardContainer = [styles.card, styles.shadow];

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);

      API.getOrders((ordersResponse)=>{
        setOrders(ordersResponse);
        setRefreshing(false);
      })
    }, [refreshing]);


    function renderOrderItem(item){
        return (
        <Block row={true} card flex style={cardContainer}>
          <TouchableOpacity onPress={()=>{
            navigation.navigate("OrderDetails",{order:item});
          }}>
             <Block flex space="between" style={styles.cardDescription}>
                <Text bold style={styles.cardTitle}>#{item.id} {item.restorant.name}</Text>
                <Text muted  style={styles.cardTitle}>{Language.created+": "}{item.created_at}</Text>
                <Text muted bold style={styles.cardTitle}>{Language.status+": "}{item.status[item.status.length-1].name}</Text>
                <Text bold style={styles.cardTitle}>{item.order_price+item.delivery_price}{config.currencySign}</Text>  
            </Block>
          </TouchableOpacity>
           
        </Block>)
    }

    useEffect(()=>{
        API.getOrders((ordersResponse)=>{
            setOrders(ordersResponse);
            setOrdersLoaded(true);
          })
    },[])


return (
    <Block flex center style={styles.home}>
      <NavigationEvents
              onWillFocus={() => {
                API.getOrders((ordersResponse)=>{
                  setOrders(ordersResponse);
                  setOrdersLoaded(true);
                })
              }}
            />
       <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.articles}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >
                <Block flex  >
                {
                    orders.map((item)=>{
                        return renderOrderItem(item)
                    })
                }
                
            </Block>
        </ScrollView>
        <LoadingIndicator  visible={!ordersLoaded}/>
    </Block>

      
    
    
)

}
export default Orders;

const styles = StyleSheet.create({
    cartCheckout: {
      backgroundColor:"white"
      },
      listStyle:{
          padding:theme.SIZES.BASE,
      },
    home: {
      width: width,    
    },
    articles: {
      width: width - theme.SIZES.BASE * 2,
      paddingVertical: theme.SIZES.BASE,
    },
    actionButtons:{
  
      //width: 100,
      backgroundColor: '#DCDCDC',
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom:9.5,
      borderRadius: 3,
      shadowColor: "rgba(0, 0, 0, 0.1)",
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      shadowOpacity: 1,
    
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
    imageContainer: {
      borderRadius: 3,
      elevation: 1,
      overflow: 'hidden',
      resizeMode: "cover"
    },
    image: {
      // borderRadius: 3,
    },
    horizontalImage: {
      height: 122,
      width: 'auto',
    },
    horizontalStyles: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    verticalStyles: {
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0
    },
    fullImage: {
      height: 200
    },
    shadow: {
      shadowColor: theme.COLORS.BLACK,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      shadowOpacity: 0.1,
      elevation: 2,
    },
  });
