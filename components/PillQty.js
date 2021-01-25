import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import PropTypes from 'prop-types';
import { Button, Block,Text } from "galio-framework";

import argonTheme from "../constants/Theme";

class PillQty extends React.Component {
  render() {
    const { inc, dec, allowDec, small, shadowless, children, color, style, ...props } = this.props;
    
    const colorStyle = color && argonTheme.COLORS[color.toUpperCase()];

    const buttonStyles = [
      small && styles.smallButton,
      color && { backgroundColor: colorStyle },
      !shadowless && styles.shadow,
        {
            width:60,
            height:30,
            //backgroundColor:'white',
            borderRadius:15,
            borderColor:argonTheme.COLORS.PRIMARY,
            borderWidth:1
        },
      {...style}
    ];

    return (
      <Block row flex style={buttonStyles} >
          <TouchableWithoutFeedback onPress={allowDec?dec:()=>{}}><Block flex middle><Text bold style={{color:argonTheme.COLORS.DEFAULT}} style={{opacity:allowDec?1:0.2}}>-</Text></Block></TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={inc}><Block flex middle style={{backgroundColor:argonTheme.COLORS.PRIMARY,borderTopRightRadius:10,borderBottomRightRadius:10}}><Text bold style={{color:'white'}}>+</Text></Block></TouchableWithoutFeedback>
      </Block>
    );
  }
}


const styles = StyleSheet.create({
  smallButton: {
    width: 75,
    height: 28
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default PillQty;
