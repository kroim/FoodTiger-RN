import {AsyncStorage} from "react-native";

async function getTheloggedInUser(callback) {
     try {
       var userJSON = await AsyncStorage.getItem('user',null);
       if (userJSON !== null) {
        callback(JSON.parse(userJSON));
       }else{
        callback(JSON.parse(null));
       }
     } catch (error) {
       // Error retrieving data
       callback(null);
     }

    }
exports.getTheloggedInUser=getTheloggedInUser;

async function setLoggedInUser(user,callback){
  console.log("passed token "+user.token);
  await AsyncStorage.setItem('token',user.token);
  user.userToken=user.token;
  await AsyncStorage.setItem('user',JSON.stringify(user));
  callback(true);
}
exports.setLoggedInUser=setLoggedInUser;

async function logout(callback){
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    callback(true);
  } catch (error) {
    // Error retrieving data
    callback(false);
  }
}
exports.logout=logout;
