import React, { Component } from 'react'
import { Image, Dimensions } from 'react-native'
import { Block, Text } from 'galio-framework';
import { Images } from './../constants';
var noData=Images.noData;

const { width } = Dimensions.get("screen");

const noDataIMG=<Image source={noData} style={{opacity:0.8,width:width/2, height:((width/2)/(820/781))}}></Image>;

export default class Empty extends Component {
    render() {
        if(!this.props.hide){
            return (
                <Block center style={{marginTop:80}}>
                    {noDataIMG}
                    <Text  h5 muted style={{marginTop:20}} backgroundColor={"whte"}>{this.props.text}</Text>
                </Block>
            )
        }else{
            return null
        }
        
    }
}
