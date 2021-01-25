import {AsyncStorage} from "react-native";
import { Language } from "../constants";

/**
*
*      CART FUNCTIONS
*
*/

/*
* Add item in the Cart
* @param object object to insert
* @param callback
*/
async function addCartContent(object,callback,errorCallback){
    getCartContent(async function(data,error){
      if(error==false){
        var cart=data;

        //Validate if the new object is in same restaurant
        if(cart.length==0||cart[0].restaurant_id==object.restaurant_id){
          //ok, empty card or item from same restaurant
          cart.push(object);
          try {
              await AsyncStorage.setItem('@MySuperStore:cart', JSON.stringify(cart),function(done){
              //AppEventEmitter.emit('product.added');
              getCartContent(callback);
            });
          } catch (error) {
            // Error saving data
            errorCallback("Error on storage");
          }
        }else{
          errorCallback(Language.you_can_order_items_from_different_restaurants)
        }

        
      }
    })
 }
 exports.addCartContent=addCartContent;


 async function clearCartContent(callback){
  await AsyncStorage.setItem('@MySuperStore:cart', JSON.stringify([]),function(done){
    //AppEventEmitter.emit('product.added');
    callback();
  });
 }
 exports.clearCartContent=clearCartContent;
 
 /*
 * Update item qty - or remove it
 * @param {String} id object id to change
 * @param {Number}  qty id to change
 * @param {Function} callback
 */
 async function updateQty(id,qty,callback){
   console.log("updateQty:"+id);
    getCartContent(async function(data,error){
      if(error==false){
        var cart=data;
        var index=null;
        for (var i = 0; i < cart.length; i++) {
         //Just find it for now
 
         if(cart[i].id==id){
           index=i;
 
         }
        }
        if(index!=null){
         if(qty!=0){
           //It is update, not delete
 
           cart[index].qty=qty;
         }else{
           //It is delete
           cart.splice(index, 1);
         }
        }
 
        try {
            await AsyncStorage.setItem('@MySuperStore:cart', JSON.stringify(cart),function(done){
             getCartContent(callback);
           });
         } catch (error) {
           // Error saving data
         }
      }
    })
 }
 exports.updateQty=updateQty;
 
 /*
 * Gets the content of the Cart
 * @param callback
 */
 async function getCartContent(callback) {
   try {
     const value = await AsyncStorage.getItem('@MySuperStore:cart');
     if (value !== null){
       // We have data!!
 
 
       callback(JSON.parse(value),false);
     }else{
       callback([],false);
     }
   } catch (error) {
     // Error retrieving data
     callback(error,true);
   }
 }
 exports.getCartContent=getCartContent;
 
 /*
 * Delete cart
 * @param callback
 * @param saveInStoreBeforeDelete - should we store the data before clearing the cart ( after succesfull purchase )
 */
 async function cleanCart(callback,saveInStoreBeforeDelete=false){
    getCartContent(async function(data,error){
      if(error==false){
        var cart=[];
        try {
            await AsyncStorage.setItem('@MySuperStore:cart', JSON.stringify(cart),function(done){
            
               getCartContent(callback);
             
           });
         } catch (error) {
           // Error saving data
         }
      }
    })
 }
 exports.cleanCart=cleanCart;
 