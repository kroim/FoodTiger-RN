import React from 'react';
import { StyleSheet, Dimensions, ScrollView,TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import { Block, theme, Text, Button } from 'galio-framework';


import { Card } from '../components';
const { width } = Dimensions.get('screen');
import { AsyncStorage } from 'react-native';

// header for screens
import Header from "../components/Header";
import { Language } from '../constants'
import API from './../services/api'
import CartAPI from './../services/cart';
import materialTheme from './../constants/Theme';
import Empty from './../components/Empty';
import config from '../config';

class Cart extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    header: <Header back options title={Language.order} navigation={navigation} />
  });

  constructor(props) {
    super(props);
    this.state = {
        order:[],
        totalQty:0,
        totalValue:0,
        loading:true,
        loggedIn:false
    };
    this.getOrders = this.getOrders.bind(this);
    this.parseOrders=this.parseOrders.bind(this);
    this.renderProceedButton=this.renderProceedButton.bind(this);
    this.checkIfUserIsLoggedIn=this.checkIfUserIsLoggedIn.bind(this);
   
  }

  componentWillMount(){
   this.getOrders();
   this.checkIfUserIsLoggedIn();
  }

   checkIfUserIsLoggedIn = async () => {
    const userToken = await AsyncStorage.getItem('token');
    this.setState({
      loggedIn:userToken!=null
    })
  }

  

  parseOrders(items){
    var totalQty=0;
    var totalValue=0;
    items.forEach(element => {
      totalQty+=element.qty;
      totalValue+=element.qty*element.price;
    });


    this.setState({
      order:items,
      totalValue:totalValue.toFixed(2),
      totalQty:totalQty,
      loading:false
    })
  }
  
  getOrders() {
    CartAPI.getCartContent(this.parseOrders)
  }

  renderProceedButton(){
    if(this.state.loggedIn){
      return (<Button style={{backgroundColor:materialTheme.COLORS.DEFAULT}} onPress={()=>{this.props.navigation.navigate('SelectAddress',{"restaurant_id":this.state.order[0].restaurant_id})}} shadowless >{Language.proceedToCheckout.toUpperCase()}</Button>)
    }else{
      return  (<Button style={{backgroundColor:materialTheme.COLORS.DEFAULT}} onPress={()=>{this.props.navigation.navigate('Login')}} shadowless >{Language.proceedToLoginFirst.toUpperCase()}</Button>)
    }
  }

  showProceedButton(){
    if(this.state.order.length>0){
        
          return (
            <Block center space={"evenly"} width={width} height={100}  >
              <Block >
                <Block row	>
                  <Text>{Language.cartSubtotal}:</Text><Text bold color={materialTheme.COLORS.PRIMARY}>{this.state.totalValue}{config.currencySign}</Text>
                </Block>
              </Block>
              {this.renderProceedButton()}
            </Block>
          )
        
        
    }else{
        return null;
    }
}

renderEmpty(){
  if(this.state.totalQty == 0 && this.state.loading == false){
     return (
         <Empty text={Language.noItemsInCart} />
      )
  }else{
    return null;
  }
}


  renderItems = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
          { this.renderEmpty() }
        <Block flex>
          { this.showProceedButton()}
          {
            this.state.order.map((item,index)=>{
              return (
                <TouchableOpacity  key={item.id+index}>
                    <Card callback={(qty,id)=>{CartAPI.updateQty(id,qty,this.parseOrders)}} isCart key={item.id+index} id={item.id} item={item} horizontal from={"items"} />
                </TouchableOpacity>)
            })
          }
          
        </Block>
      </ScrollView>
    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderItems()}
      </Block>
    );
  }
}

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

export default Cart;
