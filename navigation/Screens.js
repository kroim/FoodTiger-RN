import React from "react";
import { Easing, Animated,SafeAreaView,View,Text,Dimensions } from "react-native";
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";
import { Language } from '../constants'

import { Block,Button} from "galio-framework";
import { useSharedState } from './../store/store';

// screens
import Home from "../screens/Home";
import Orders from "../screens/Orders";
import OrderDetails from '../screens/OrderDetails'
import Notifications from "../screens/Notifications";
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import Login from '../screens/Login';
import AuthLoadingScreen from './../screens/AuthLoadingScreen';
import SelectAddress from '../screens/SelectAddress';
import AddAddress from '../screens/AddAddress';
import Payment from '../screens/Payment';
import Register from "../screens/Register";
import Elements from "../screens/Elements";
import Articles from "../screens/Articles";
import Items from '../screens/Items';
import Item from "../screens/Item";
import Cart from "../screens/Cart";
import { AsyncStorage } from 'react-native';
import AppEventEmitter from '../functions/emitter';
// drawer
const { width, height } = Dimensions.get("screen");
import Menu from "./Menu";
import DrawerItem from "../components/DrawerItem";

// header for screens
import Header from "../components/Header";

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = "Search";

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});

//Create the home stack - same for all
const HomeStack = createStackNavigator(
    {
     
      Home: {screen: Home,},
      Items: {screen: Items},
      Item: {screen: Item},
      Cart: {screen: Cart},
     
      SelectAddress: {screen: SelectAddress,
        navigationOptions: ({ navigation }) => ({
          header: (
            <Header back title={Language.orderOptions}  navigation={navigation} />
          )
        })},
      AddAddress:{screen: AddAddress.AddAddress,
        navigationOptions: ({ navigation }) => ({
          header: (
            <Header transparent back title={Language.addAddress}  navigation={navigation} />
          ),
          headerTransparent: true,
        })},
        CompleteAddress:{screen: AddAddress.CompleteAddress,
          navigationOptions: ({ navigation }) => ({
            header: (
              <Header back title={Language.addAddress}  navigation={navigation} />
            ),
          })},
        Payment:{screen: Payment,
            navigationOptions: ({ navigation }) => ({
              header: (
                <Header back title={Language.checkout}  navigation={navigation} />
              ),
            })},
    },

    
    {
      cardStyle: { backgroundColor: "#F8F9FE" },
      transitionConfig
    }
  );

//When not logged in
  //Create the auth flow
  const authStack = createStackNavigator(
    {
      Login: {
        screen: Login,
        navigationOptions: ({ navigation }) => ({
          header: (
            <Header transparent white title={Language.login} iconColor={'#FFF'} navigation={navigation} />
          ),
          headerTransparent: true,
        })
      },
      Register: {
        screen: Register,
        navigationOptions: ({ navigation }) => ({
          header: (
            <Header back transparent white title={Language.register} iconColor={'#FFF'} navigation={navigation} />
          ),
          headerTransparent: true,
        })
      },
    },
    {
      cardStyle: { backgroundColor: "#F8F9FE" },
      transitionConfig,
      headerTintColor: 'blue',
    }
  )

//When logged in
  //Create address, profile, orders
  const ElementsStack = createStackNavigator({
    Elements: {
      screen: Elements,
      navigationOptions: ({ navigation }) => ({
        header: <Header title="Elements" navigation={navigation} />
      })
    }
  },{
    cardStyle: {
      backgroundColor: "#F8F9FE"
    },
    transitionConfig
  });
  
  const ArticlesStack = createStackNavigator({
    Articles: {
      screen: Articles,
      navigationOptions: ({ navigation }) => ({
        header: <Header title="Articles" navigation={navigation} />
      })
    }
  },{
    cardStyle: {
      backgroundColor: "#F8F9FE"
    },
    transitionConfig
  });


    const NotificationsStack = createStackNavigator({
      Notifications: {
        screen: Notifications,
        navigationOptions: ({ navigation }) => ({
          header: <Header title={Language.notifications} navigation={navigation} />
        })
      },
    },{
      cardStyle: {
        backgroundColor: "#F8F9FE"
      },
      transitionConfig
    });


  const OrdersStack = createStackNavigator({
    Orders: {
      screen: Orders,
      navigationOptions: ({ navigation }) => ({
        header: <Header title={Language.myOrders} navigation={navigation} />
      })
    },
    OrderDetails: {
      screen: OrderDetails,
      navigationOptions: ({ navigation }) => ({
        header: <Header back title={Language.orderDetails} navigation={navigation} />
      })
    }
  },{
    cardStyle: {
      backgroundColor: "#F8F9FE"
    },
    transitionConfig
  });
  
  
  
  const ProfileStack = createStackNavigator(
    {
      Profile: {
        screen: Profile,
        navigationOptions: ({ navigation }) => ({
          header: (
            <Header transparent white title={Language.profile} iconColor={'#FFF'} navigation={navigation} />
          ),
          headerTransparent: true
        })
      }
    },
    {
      cardStyle: { backgroundColor: "#FFFFFF" },
      transitionConfig
    }
  );


//Create the two main drawers
const AuthenticatedAppStack = createDrawerNavigator(
    {
      
      Home: {
        screen: HomeStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({focused}) => (
            <DrawerItem focused={focused} screen="Home" title={Language.home} />
          )
        })
      },
  
      Orders: {
        screen: OrdersStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({focused}) => (
            <DrawerItem focused={focused} screen="Orders" title={Language.myOrders} />
          )
        })
      },

      Notifications: {
        screen:NotificationsStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({focused}) => (
            <DrawerItem focused={focused} screen="Notifications" title={Language.notifications} />
          )
        })
      },
  
     /* Addresses: {
        screen: ArticlesStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({focused}) => (
            <DrawerItem focused={focused} screen="Addresses" title={Language.addresses} />
          )
        })
      },*/
  
      ProfileStack:{
        screen:ProfileStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({focused}) => (
            <DrawerItem focused={focused} screen="Profile" title={Language.profile} />
          )
        })
      },
  
     /* Articles: {
        screen: ArticlesStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({focused}) => (
            <DrawerItem focused={focused} screen="Articles" title="Articles" />
          )
        })
      },
      Elements: {
        screen: ElementsStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({focused}) => (
            <DrawerItem focused={focused} screen="Elements" title="Elements" />
          )
        })
      }*/
    },
    Menu
  );


  const PublicAppStack = createDrawerNavigator(
    {
      
      Home: {
        screen: HomeStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({focused}) => (
            <DrawerItem focused={focused} screen="Home" title={Language.home} />
          )
        })
      },
      Login:{screen: authStack, navigationOptions: navOpt => ({
        drawerLabel: ({focused}) => (
          <DrawerItem focused={focused} screen="Login" title={Language.login} />
        )
      })},
      /*Articles: {
        screen: ArticlesStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({focused}) => (
            <DrawerItem focused={focused} screen="Articles" title="Articles" />
          )
        })
      },
      Elements: {
        screen: ElementsStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({focused}) => (
            <DrawerItem focused={focused} screen="Elements" title="Elements" />
          )
        })
      },*/
    },
    Menu
  );

//Create the main swith nav
const AuthSwitch = createSwitchNavigator(
    {
      AuthLoadingScreen:{screen:AuthLoadingScreen},
      SignedIn: {screen: AuthenticatedAppStack},
      SignedOut: {screen: PublicAppStack}
    }
  )


const AppContainer = createAppContainer(AuthSwitch);
export default AppContainer;
