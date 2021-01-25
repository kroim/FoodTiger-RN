import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  Linking
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import config from '../config';
import { Button, Icon, Input } from "../components";
import { Images, argonTheme, Language } from "../constants";
import { AsyncStorage } from 'react-native';
import AppEventEmitter from '../functions/emitter';
import { TouchableOpacity } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("screen");
import API from "./../services/api"
import User from './../services/user';
import Toast, {DURATION} from 'react-native-easy-toast'


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        email:"",
        password:"",
        
    };
    this.getTheToken = this.getTheToken.bind(this);
  }

  
   /**
   * Get the tocken and set it to Async storage
   */
   getTheToken = async () =>{
     var _this=this;
     //console.log(this.state.email+" --  "+this.state.password)
     API.loginUser(this.state.email,this.state.password,(responseJson)=>{
      console.log(JSON.stringify(responseJson));
       if(responseJson.status){
         //User ok
         User.setLoggedInUser(responseJson,()=>{
          _this.refs.toastok.show(Language.userIsNowLoggedIn, 2000, () => {
            _this.props.navigation.navigate('SignedIn');
          });
          
         })
       }else{
         //Not ok
         _this.refs.toasterror.show(responseJson.errMsg, 2000, () => {});
       }
       
       
     });
  }
 
  render() {
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              
              <Block flex>
                <Block flex={0.17} middle style={{marginTop:20}}>
                  <Image source={Images.food_tiger_logo} style={{width: (487/2),height: (144/2)}}/>
                  <Text muted></Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                       value ={this.state.email}
                        borderless
                        onChangeText={text => this.setState({
                          email:text
                        })}
                        placeholder={"Email"}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    
                   
                    <Block width={width * 0.8}>
                      <Input
                       value ={this.state.password}
                        password
                        borderles
                        placeholder={"Password"}
                        onChangeText={text => this.setState({
                          password:text
                        })}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                      
                    </Block>








                    <Block row space="evenly" style={{marginVertical:10}} >
                      <Block>
                          <TouchableOpacity onPress={()=>  Linking.openURL(config.domain.replace("/api",'')+"/password/reset").catch(err => console.error("Couldn't load page", err)) } >
                            <Text  size={14} color={argonTheme.COLORS.PRIMARY}>
                            {Language.forgotPassword}
                            </Text>
                          </TouchableOpacity>
                        </Block>
                      <Block>
                        <TouchableOpacity  onPress={()=> this.props.navigation.navigate('Register')} >
                          <Text  size={14} color={argonTheme.COLORS.PRIMARY}>
                            {Language.register}
                          </Text>
                        </TouchableOpacity>
                      </Block>
                      
                    </Block>

                    
                    
                    <Block middle>
                      <Button color="primary" style={styles.createButton} onPress={()=> this.getTheToken()}>
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        {Language.login}
                        </Text>
                      </Button>
                    </Block>
                    
                  </KeyboardAvoidingView>
                </Block>
              </Block>
                        
              
            
            </Block>
          </Block>
        </ImageBackground>
        <Toast ref="toastok" style={{backgroundColor:argonTheme.COLORS.SUCCESS}}/>
        <Toast ref="toasterror" style={{backgroundColor:argonTheme.COLORS.ERROR}}/>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  }
});

export default Login;
