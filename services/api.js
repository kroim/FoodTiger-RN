import config from '../config';
import {AsyncStorage} from "react-native";

/**
 * Gets list of restaurants
 * @param {Function} callback 
 */
function getRestaurants(callback) {
     fetch(config.domain+'/restorantslist')
         .then(response => response.json())
         .then(responseJson => {
            callback(responseJson.data)
         })
         .catch(error => {
           console.error(error);
         });
 }
 exports.getRestaurants=getRestaurants;


 /**
 * Gets list of restaurants
 * @param {Function} callback 
 */
function getRestaurantInfo(id,callback) {
  fetch(config.domain+'/restaurant/'+id+'/hours')
      .then(response => response.json())
      .then(responseJson => {
         callback(responseJson.data)
      })
      .catch(error => {
        console.error(error);
      });
}
exports.getRestaurantInfo=getRestaurantInfo;



 /**
 * Gets list of restaurants
 * @param {Function} callback 
 */
function getDeliveryFee(restaurant_id,address_id,callback) {
  fetch(config.domain+'/deliveryfee/'+restaurant_id+"/"+address_id)
      .then(response => response.json())
      .then(responseJson => {
         callback(responseJson.fee)
      })
      .catch(error => {
        console.error(error);
      });
}
exports.getDeliveryFee=getDeliveryFee;


 

/**
 * Get the restaurants items
 * @param {number} id The restaurant is
 * @param {Functino} callback 
 */
 function getItemsInRestaurant(id,callback){
    fetch(config.domain+'/restorant/'+id+'/items')
       .then(response => response.json())
       .then(responseJson => {
            callback(responseJson.data)
       })
       .catch(error => {
         console.error(error);
       });
   }
exports.getItemsInRestaurant=getItemsInRestaurant;


/**
 * Place order
 * @param {Object} paymentObject 
 * @param {function} callback 
 */
async function placeOrder(paymentObject,callback){
  var token = await AsyncStorage.getItem('token','');
  paymentObject.api_token=token;
  fetch(config.domain+'/make/order', {
   method: 'POST',
   headers: {
     Accept: 'application/json',
     'Content-Type': 'application/json',
   },
   body: JSON.stringify(paymentObject),
 }).then((response) => response.json())
 .then((responseJson) => {
   callback(responseJson);
 }).catch(error => {
   console.error(error);
 });
}
exports.placeOrder=placeOrder;


register = async () =>{
  const data = { 
    name: this.state.name,
    email:this.state.email,
    password:this.state.password,
    phone:this.state.phone,
    app_secret:"",
  };
   fetch(config.domain+'/client/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.json())
  .then((responseJson) => {
    console.log(JSON.stringify(responseJson))
    this.setToken(responseJson.token)
  }).catch(error => {
    console.error(error);
  });
}

function registerUser(name,email,password,phone,callback){
  const data = { 
    name: name,
    email:email,
    password:password,
    phone:phone,
    app_secret:config.APP_SECRET,
  };

  fetch(config.domain+'/client/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    }).then((response) => response.json())
    .then((responseJson) => {
      callback(responseJson);
    }).catch(error => {
      console.error(error);
    });

}
exports.registerUser=registerUser;

function loginUser(email,password,callback){
   fetch(config.domain+'/clientgettoken', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
     email:email,
     password:password
    }),
  }).then((response) => response.json())
  .then((responseJson) => {
    callback(responseJson);
  }).catch(error => {
    console.error(error);
  });
 }
 exports.loginUser=loginUser;


 async function getNotifications(callback){
  var token = await AsyncStorage.getItem('token','');
  //myaddresses
  fetch(config.domain+'/mynotifications?api_token='+token, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    if(responseJson.status){
     callback(responseJson.data);
    }else{
      alert(responseJson.message+" "+responseJson.errMsg)
      callback([]);
    }
    
    
  }).catch(error => {
    console.error(error);
  });

 }
 exports.getNotifications=getNotifications;


 async function getOrders(callback){
  var token = await AsyncStorage.getItem('token','');
  //myaddresses
  fetch(config.domain+'/myorders?api_token='+token, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    if(responseJson.status){
     callback(responseJson.data);
    }else{
      alert(responseJson.message+" "+responseJson.errMsg)
      callback([]);
    }
    
    
  }).catch(error => {
    console.error(error);
  });

 }
 exports.getOrders=getOrders;

 
 async function getAddress(callback){
  var token = await AsyncStorage.getItem('token','');
  //myaddresses
  fetch(config.domain+'/myaddresses?api_token='+token, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    if(responseJson.status){
     callback(responseJson.data);
    }else{
      alert(responseJson.message+" "+responseJson.errMsg)
      callback([]);
    }
    
    
  }).catch(error => {
    console.error(error);
  });

 }
 exports.getAddress=getAddress;


 async function saveAddress(addressElement,callback){
  var token = await AsyncStorage.getItem('token','');
  addressElement.api_token=token;
  console.log(addressElement);
  fetch(config.domain+'/make/address', {
   method: 'POST',
   headers: {
     Accept: 'application/json',
     'Content-Type': 'application/json',
   },
   body: JSON.stringify(addressElement),
 }).then((response) => response.json())
 .then((responseJson) => {
   if(responseJson.status){
    callback(responseJson);
   }else{
     alert(responseJson.message+" "+responseJson.errMsg)
   }
   console.log(responseJson);
   
 }).catch(error => {
   console.error(error);
 });
}
exports.saveAddress=saveAddress;