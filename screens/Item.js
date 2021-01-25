import React from "react";
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
import { Block, Text, theme} from "galio-framework";
import config from '../config';
import { Button,PillQty } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { AsyncStorage } from 'react-native';
const { width, height } = Dimensions.get("screen");
import Toast, {DURATION} from 'react-native-easy-toast'

import Cart from './../services/cart';


const thumbMeasure = (width - 48 - 32) / 3;

// header for screens
import Header from "../components/Header";
import { Language } from '../constants'
import API from './../services/api'
import ArgonTheme from './../constants/Theme'

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.state.params ? this.props.navigation.state.params.item : {},
      qty:1,
    };

    this.inc=this.inc.bind(this);
    this.dec=this.dec.bind(this);
    this.addToCart=this.addToCart.bind(this);
  }

  static navigationOptions = ({ navigation }) => ({
    header: (<Header  white back transparent   options title={navigation.state.params.item.name} navigation={navigation} />), 
    headerTransparent: true
  });

  addToCart(){
    console.log("Item to add");
    console.log(this.state.item);
    var itemToAdd=this.state.item;
    itemToAdd.qty=this.state.qty;
    var _this=this;
    Cart.addCartContent(itemToAdd,(error=null)=>{
      this.refs.toast.show(_this.state.qty==1?Language.itemAddedInCart:_this.state.qty+" "+Language.itemsAddedInCart, 1500, () => {
        _this.props.navigation.goBack();
      });
      
    },(message)=>{
      //Error occured
      this.refs.toasterror.show(message, 2000, () => {});
    });
    
  }

  inc(){
    this.setState({
      qty:this.state.qty+1
    })
  }

  dec(){
    this.setState({
      qty:this.state.qty-1
    })
  }

  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              <Block flex style={styles.itemCard}>
                <Block middle style={styles.avatarContainer}>
                  <Image
                    source={{ uri: this.state.item.icon.indexOf('http')!=-1?this.state.item.icon:(config.domain.replace("api","")+this.state.item.icon)     }}
                    style={styles.avatar}
                  />
                </Block>
                
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      {this.state.item.name}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {this.state.item.description}
                    </Text>
                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  <Block middle>
                    <Text
                      h4
                      bold
                      color={ArgonTheme.COLORS.LABEL}
                      style={{ textAlign: "center" }}
                    >
                      {this.state.item.price} {config.currencySign}
                    </Text>

                  </Block>
                  </Block>
                  




              </Block>

              <Block transparent flex  style={styles.group}>
                <Text bold size={16} style={styles.title}>
                  {Language.quatity.toUpperCase()}
                </Text>
                <Block flex row  middle style={styles.qtyManager}>
                  <Block flex={3}>
                    <Text>{this.state.qty} {this.state.qty>1?Language.items:Language.item}</Text>
                  </Block>
                  <Block flex={1} right>
                     <PillQty allowDec={this.state.qty>1} inc={this.inc} dec={this.dec}></PillQty>
                  </Block>
                </Block>
              </Block>

              



              <Block transparent flex style={styles.orderCard}>
                  <Block flex>
                    <Block middle>
                      <Button onPress={this.addToCart}>{Language.addToOrder.toUpperCase()+"         "+(this.state.qty*this.state.item.price)+"  "+config.currencySign}</Button>
                    </Block>
                  </Block>
              </Block>

              

            </ScrollView>
            
          </ImageBackground>

        </Block>
        <Toast ref="toast" style={{backgroundColor:argonTheme.COLORS.SUCCESS}}/>
        <Toast ref="toasterror" style={{backgroundColor:argonTheme.COLORS.ERROR}}/>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE,
    marginTop: 44,
    color: argonTheme.COLORS.HEADER
  },
  group: {
    paddingTop: theme.SIZES.BASE
  },
  qtyManager:{
    paddingHorizontal: theme.SIZES.BASE,
  },
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  itemCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  orderCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 20,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
   // backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default Item;
