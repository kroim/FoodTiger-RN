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
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import Login from '../screens/Login';
import AuthLoadingScreen from './../screens/AuthLoadingScreen';
import SelectAddress from '../screens/SelectAddress';
import Register from "../screens/Register";
import Elements from "../screens/Elements";
import Articles from "../screens/Articles";
import Items from '../screens/Items';
import Item from "../screens/Item";
import Order from "../screens/Order";
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
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig,
    headerTintColor: 'blue',
  }
)

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

const ProfileLoginSwitch = createSwitchNavigator(
  {
    AuthLoadingScreen:{screen:AuthLoadingScreen},
    SignedIn: {screen: ProfileStack,},
    SignedOut: {screen: authStack}
  }
)

const AddressesLoginSwitch = createSwitchNavigator(
  {
    AuthLoadingScreen:{screen:AuthLoadingScreen},
    SignedIn: {screen: ArticlesStack},
    SignedOut: {screen: authStack}
  }
)


const HomeStack = createStackNavigator(
  {
   
    Home: {screen: Home,},
    Items: {screen: Items},
    Item: {screen: Item},
    Order: {screen: Order},
    SelectAddress:{
      screen:SelectAddress,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header back transparent white title={"Select address"} iconColor={'#FFF'} navigation={navigation} />
        ),
        headerTransparent: true
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: "#F8F9FE"
    },
    transitionConfig
  }
);


// divideru se baga ca si cum ar fi un ecrna dar nu-i nimic duh
const AppStack = createDrawerNavigator(
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
      screen: ArticlesStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({focused}) => (
          <DrawerItem focused={focused} screen="Orders" title={Language.myOrders} />
        )
      })
    },

    Addresses: {
      screen: AddressesLoginSwitch,
      navigationOptions: navOpt => ({
        drawerLabel: ({focused}) => (
          <DrawerItem focused={focused} screen="Addresses" title={Language.addresses} />
        )
      })
    },

    ProfileStack:{
      screen:ProfileLoginSwitch,
      navigationOptions: navOpt => ({
        drawerLabel: ({focused}) => (
          <DrawerItem focused={focused} screen="Profile" title={Language.profile} />
        )
      })
    },

    /*Login:{
      screen: LoginStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({focused}) => (
          <DrawerItem focused={focused} screen="Addresses" title={Language.login} />
        )
      })
    },*/

    Articles: {
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
    },
  },
  Menu
);

const AppContainer = createAppContainer(AppStack);
export default AppContainer;
