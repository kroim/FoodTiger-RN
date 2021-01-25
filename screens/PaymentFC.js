import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Linking,
  View
} from "react-native";
import { Block, theme, Text } from "galio-framework";
import {Language } from "../constants";
const { width, } = Dimensions.get("screen");
import Empty from './../components/Empty';
import  SimpleRow from './../components/SimpleRow'
import API from './../services/api'

function Payment({navigation}){
    const address=navigation.getParam('address', '');
    const subtitle=navigation.getParam('subtitle', '');
    return (
        <Block flex center style={styles.home}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.articles}>
                <Block flex>
               
                <Text muted size={16} style={styles.title}>
                    {Language.addressForDelivery}
                </Text>
                <SimpleRow title={address} subtitle={subtitle} />
                </Block>
            </ScrollView>
        </Block>
    )
}
export default Payment;

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
  });