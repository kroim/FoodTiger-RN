import React from 'react';
import { TouchableOpacity,ScrollView, View,ImageBackground, Image, StyleSheet, StatusBar, Dimensions, Platform } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

const { height, width } = Dimensions.get('screen');
import { Images, argonTheme, Language } from '../constants/';
import { HeaderHeight } from "../constants/utils";
import config from "./../config";
//import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import stripe from 'tipsi-stripe'
import CartAPI from './../services/cart';
import materialTheme from './../constants/Theme';
import API from './../services/api'
import Tabs from './../components/Tabs';
import Button from './../components/Button';
import { FancyAlert, LoadingIndicator } from 'react-native-expo-fancy-alerts';
import { Ionicons } from '@expo/vector-icons';


function SelectableTabs(props){
  const { tabs, tabIndex, changeFunction } = props;
  const defaultTab = tabs && tabs[0] && tabs[0].id;
  
  if (!tabs) return null;

  return (
    <Tabs
      data={tabs || []}
      vertical={props.vertical}
      initialIndex={tabIndex || defaultTab}
      onChange={id => changeFunction(id)} />
  )
}


export default class Payment extends React.Component {

  constructor(props){
    super(props);

    var paymentOptions=[];
    if(config.enableCOD){
      paymentOptions.push({ id: 'cod', title: this.props.navigation.getParam('deliveryMethod', '')=="delivery"?Language.cod:Language.cop },)
    }
    if(config.enableStripe&&config.stripePublishKey.length>5){
      paymentOptions.push( { id: 'stripe', title: Language.pay_with_card });
    }
    this.state = {
        order:[],
        totalQty:0,
        totalValue:0,
        loading:true,
        loggedIn:false,
        deliveryFee:0,
        restaurant_id:this.props.navigation.getParam('restaurant_id',null),
        address:this.props.navigation.getParam('address', {}),
        deliveryMethod:this.props.navigation.getParam('deliveryMethod', ''),
        timeSlotUF:this.props.navigation.getParam('timeSlotUF', ''),
        timeSlot:this.props.navigation.getParam('timeSlot', ''),
        deliveryFeeCalucated:false,
        paymentMethod:null,
        processingPayment:false,
        showSuccessOrderAlert:false,
        showErrorOrderAlert:false,
        orderErrorMessage:"",
        paymentMethods:paymentOptions
    };

    this.getOrders = this.getOrders.bind(this);
    this.parseOrders=this.parseOrders.bind(this);
    this.setPaymentMethod=this.setPaymentMethod.bind(this);
    this.placeOrder=this.placeOrder.bind(this);
    this.processOrder=this.processOrder.bind(this);
    
  }

  componentDidMount() {
    this.getOrders();
    if(this.props.navigation.getParam('deliveryMethod', '')=="delivery"){
      //In delivery, calucate fee for delivery
      var _this=this;
      API.getDeliveryFee(this.state.restaurant_id,this.state.address.id,(fee)=>{
        _this.setState({
          deliveryFee:fee,
          deliveryFeeCalucated:true,
        })
      })
    }else{
      this.setState({
        deliveryFee:0,
        deliveryFeeCalucated:true,
      })
    }
    if(config.enableStripe&&config.stripePublishKey&&config.stripePublishKey.length>2){
      stripe.setOptions({
        publishableKey: config.stripePublishKey
      });
    }
		
  }

  processOrder(stripe_token=""){
    this.setState({
      processingPayment:true
    })
    theItems=[];
    this.state.order.forEach(element => {
      theItems.push({
        id:element.id,
        qty:element.qty
      })
    });
    var paymentObject={
      restaurant_id:this.state.restaurant_id,
      delivery_method:this.state.deliveryMethod,
      payment_method:this.state.paymentMethod ,
      address_id:this.state.address.id,
      items:theItems,
      order_price:this.state.deliveryMethod=="delivery"?parseFloat(this.state.totalValue)+parseFloat(this.state.deliveryFee):parseFloat(this.state.totalValue),
      comment:"",
      timeslot:this.state.timeSlot,
      stripe_token:stripe_token
    }

    console.log(paymentObject);
    
    var _this=this;
    //Send the paymnet object to api
    API.placeOrder(paymentObject,function(response){
      if(response.status){
        //OK
        _this.setState({
          showErrorOrderAlert:false,
          orderErrorMessage:"",
          processingPayment:false,
          showSuccessOrderAlert:true,
        })
      }else{
        //Failed
        _this.setState({
          showErrorOrderAlert:true,
          orderErrorMessage:response.errMsg,
          processingPayment:false
        })
       
      }
      console.log(response);
      
    })
  }


  placeOrder(){
    if(this.state.paymentMethod=="cod"){
      //Save order is server
      this.processOrder("");
    }else if(this.state.paymentMethod=="stripe"){
      //Start payment
      this.openAddCardView();
    }
  }

  async goToHome(){
    //Clear all cart
    await CartAPI.clearCartContent(()=>{
      //Go to home screen
      this.props.navigation.navigate('Home');
    })
  }


  placeOrderButton(){
    active=this.state.paymentMethod!=null&&this.state.deliveryFeeCalucated;
  return (<Block style={{opacity:active?1:0.5}}>
    <Button  onPress={this.placeOrder}
             disabled={!active} color="success">{Language.place_order.toUpperCase()}</Button>
    </Block>)
  }
  


  async openAddCardView() {
    try {
      console.warn("Start payment")
      const options = {
      };
      const token = await stripe.paymentRequestWithCardForm(options);
     
      
      if(token.id){
        this.processOrder(token.id);
      }else{
        alert("error on card");
      }
    }
    catch(error) {

    }
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
  
  setPaymentMethod(method){
    this.setState({
      paymentMethod:method
    })
  }

  render() {
    const { navigation,route } = this.props;
    const deliveryMethod=navigation.getParam('deliveryMethod', '');
    const timeSlot=navigation.getParam('timeSlot', '');
    const timeSlotUF=navigation.getParam('timeSlotUF', '');
    const address=navigation.getParam('address', '');
   

    

    const cardContainer = [styles.card, styles.shadow];

   function showDeliveryAddress(){
     if(deliveryMethod=="delivery"){
      return ( <Text  size={14} style={styles.cardTitle}>{Language.addressForDelivery+": "+address.address}</Text>)
     }else{
       return null;
     }
   }


    return (
      <Block flex center style={styles.home}>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block>
          
          {/**  Delivery or pickup */}
          <Block row={true} card flex style={cardContainer}>


              <Block flex space="between" style={styles.cardDescription}>
                <Text bold style={styles.cardTitle}>{Language.summary}</Text>
                <Text size={14} style={styles.cardTitle}>{Language.deliveryMethod+": "+(deliveryMethod=="delivery"?Language.delivery:Language.pickup)}</Text>
                <Text size={14} style={styles.cardTitle}>{(deliveryMethod=="delivery"?Language.deliveryTime:Language.pickupTime)+": "+timeSlotUF}</Text>
                 {showDeliveryAddress()}
                 <Text bold style={[styles.cardTitle,{marginTop:16}]}>{Language.items}</Text>

                 {
                   this.state.order.map((item,index)=>{
                    return (
                    <Text size={14} style={styles.cardTitle}>{item.qty+" x "+item.name}</Text>
                    )
                    })
                 }
                 <Block row space={"between"} style={{marginTop:16}}>
                    <Block><Text bold style={[styles.cardTitle]}>{Language.subtotal}</Text></Block>
                    <Block><Text  >{this.state.totalValue}{config.currencySign}</Text></Block>
                 </Block>
                 <Block row space={"between"} style={{marginTop:0}}>
                    <Block><Text bold style={[styles.cardTitle]}>{Language.delivery}</Text></Block>
                    <Block><Text  >{this.state.deliveryFee}{config.currencySign}</Text></Block>
                 </Block>

                 <Block row space={"between"} style={{marginTop:16}}>
                    <Block><Text bold style={[styles.cardTitle]}>{Language.total}</Text></Block>
                    <Block><Text bold >{parseFloat(this.state.totalValue)+parseFloat(this.state.deliveryFee)}{config.currencySign}</Text></Block>
                 </Block>
                </Block>


               

          </Block>

           {/**  Payment methods */}
          <Block row={true} card flex style={cardContainer} >
              <Block flex space="between" style={styles.cardDescription}>
                <Text bold style={styles.cardTitle}>{Language.paymentMethod}</Text>
                <Block left>
                   <SelectableTabs tabs={this.state.paymentMethods} changeFunction={this.setPaymentMethod}   />
                </Block>
                
                </Block>
          </Block>

          {/** Place order */}
          {this.placeOrderButton()}

          </Block>
        </ScrollView>
        <LoadingIndicator visible={this.state.processingPayment} />

        <FancyAlert
              visible={this.state.showErrorOrderAlert}
              icon={
                <View style={{
                  flex: 1,
                  display: 'flex',
                  justify : 'center',
                  alignItems: 'center',
                  backgroundColor: 'red',
                  borderRadius: 39,
                  width: '100%',
                  paddingTop:8,
                }}>
                  <Ionicons
                      name={Platform.select({ ios: 'ios-cash', android: 'md-cash' })}
                      size={36}
                      color="#FFFFFF"
                  /></View> 
                }
                style={{ backgroundColor: 'white' }}
              >
              
              <View style={styles.content}>
              <Text bold style={styles.contentText}>{Language.errorOnOrder}</Text>
              <Text style={styles.contentText}>{this.state.orderErrorMessage}</Text>

                <TouchableOpacity style={styles.btn} onPress={()=>{
                  this.setState({
                    showErrorOrderAlert:false
                  });

                  //this.goToHome();
                }
                }
                >
                  <Text style={styles.btnText}>{Language.ok}</Text>
                </TouchableOpacity>
              </View>
              
        
          </FancyAlert>

        <FancyAlert
              visible={this.state.showSuccessOrderAlert}
              icon={
                <View style={{
                  flex: 1,
                  display: 'flex',
                  justify : 'center',
                  alignItems: 'center',
                  backgroundColor: 'green',
                  borderRadius: 39,
                  width: '100%',
                  paddingTop:8,
                }}>
                  <Ionicons
                      name={Platform.select({ ios: 'ios-cash', android: 'md-cash' })}
                      size={36}
                      color="#FFFFFF"
                  /></View> 
                }
                style={{ backgroundColor: 'white' }}
              >
              
              <View style={styles.content}>
              <Text bold style={styles.contentText}>{Language.orderSuccesfull}</Text>
              <Text style={styles.contentText}>{Language.trackOrder}</Text>

                <TouchableOpacity style={styles.btn} onPress={()=>{
                  this.setState({
                    showSuccessOrderAlert:false
                  });

                  this.goToHome();
                }
                }
                >
                  <Text style={styles.btnText}>{Language.ok}</Text>
                </TouchableOpacity>
              </View>
              
        
          </FancyAlert>

       </Block>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C3272B',
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
    marginBottom: 16,
  },
  contentText: {
    textAlign: 'center',
  },
  btn: {
    borderRadius: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignSelf: 'stretch',
    backgroundColor: '#4CB748',
    marginTop: 16,
    minWidth: '50%',
    paddingHorizontal: 16,
  },
  btnwarning: {
    borderRadius: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignSelf: 'stretch',
    backgroundColor: 'red',
    marginTop: 16,
    minWidth: '50%',
    paddingHorizontal: 16,
  },
  btnText: {
    color: '#FFFFFF',
  },
  container: {
    backgroundColor: theme.COLORS.BLACK,
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    zIndex: 3,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  pro: {
    backgroundColor: argonTheme.COLORS.INFO,
    paddingHorizontal: 8,
    marginLeft: 3,
    borderRadius: 4,
    height: 22,
    marginTop: 15
  },
  gradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66,
  },
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
