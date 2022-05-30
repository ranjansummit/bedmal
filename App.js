import React from 'react';

import {I18nManager, StatusBar} from 'react-native';

import {selectUserToken} from './redux/user/user.selectors';
import {selectBagItems} from './redux/store/store.selectors';
import {connect} from 'react-redux';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Signup from './screen/auth/signup';
import Profile from './screen/profile/Profile';
import UserMain from './screen/main/usermain';
import Login from './screen/auth/login';
import Forget from './screen/auth/forget';
import Home from './screen/main/home';
import Account from './screen/profile/account';
import ChatMain from './screen/chat/chat_main';
import ChatOne from './screen/chat/chat_one';
import Wallet from './screen/profile/wallet';
import StoreFront from './screen/shop/store-front';
import Product from './screen/shop/product';
import Terms from './screen/terms/terms';
import Term from './screen/terms/term';
import SearchProduct from './screen/shop/search-product';
import Bag from './screen/shop/bag';
import Verify from './screen/auth/verify';
import Password from './screen/auth/password';
import Transactions from './screen/account/transactions';
import Transaction from './screen/account/transaction';
import Orders from './screen/account/orders';
import Order from './screen/account/order';
import BorrowReceipts from './screen/account/borrow-receipts';
import BorrowReceipt from './screen/account/borrow-receipt';
import Active from './screen/active/active';
import OnDemand from './screen/on-demand/onDemand';
import OnDemandStage2 from './screen/on-demand/onDemand-stage2';
import OnDemandStage3 from './screen/on-demand/onDemand-stage3';
import Addresses from './screen/profile/addresses';

import {
  HomeActive,
  HomeInActive,
  MeActive,
  MeInActive,
  OnDemandActive,
  OnDemandInActive,
  FooterActive,
  FooterInActive,
  BagActive,
  BagInActive,
  Bag2,
} from './screen/com/svg-files';


const MeStack = createStackNavigator();
const MeStackScreen = () => (
  <MeStack.Navigator>
    <MeStack.Screen
      name="Account"
      component={Account}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="Profile"
      component={Profile}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="ChatMain"
      component={ChatMain}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="Wallet"
      component={Wallet}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="Terms"
      component={Terms}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="Term"
      component={Term}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="Transactions"
      component={Transactions}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="Transaction"
      component={Transaction}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="Orders"
      component={Orders}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="Order"
      component={Order}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="BorrowReceipts"
      component={BorrowReceipts}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="BorrowReceipt"
      component={BorrowReceipt}
      options={{headerShown: false}}
    />
    <MeStack.Screen
      name="Addresses"
      component={Addresses}
      options={{headerShown: false}}
    />
  </MeStack.Navigator>
);

const OnDemandStack = createStackNavigator();
const OnDemandStackScreen = () => (
  <OnDemandStack.Navigator>
    <OnDemandStack.Screen
      name="OnDemand"
      component={OnDemand}
      options={{headerShown: false}}
    />
    <OnDemandStack.Screen
      name="OnDemandStage2"
      component={OnDemandStage2}
      options={{headerShown: false}}
    />
    <OnDemandStack.Screen
      name="OnDemandStage3"
      component={OnDemandStage3}
      options={{headerShown: false}}
    />
  </OnDemandStack.Navigator>
);

const ActiveStack = createStackNavigator();
const ActiveStackScreen = () => (
  <ActiveStack.Navigator>
    <ActiveStack.Screen
      name="Active"
      component={Active}
      options={{headerShown: false}}
    />
    <ActiveStack.Screen
      name="Order"
      component={Order}
      options={{headerShown: false}}
    />
  </ActiveStack.Navigator>
);

const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={Home}
      options={{headerShown: false}}
    />
  </HomeStack.Navigator>
);

const Stack = createStackNavigator();

class App extends React.Component {
  constructor(props) {
    super();
  }

  async componentDidMount() {
    I18nManager.allowRTL(false);
  }
  renderBottomTab = () => {
    const Tab = createBottomTabNavigator();
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: {
            height: 70,
            paddingTop: 5,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => {
              return focused ? <HomeActive /> : <HomeInActive />;
            },
          }}
        />
        <Tab.Screen
          name="Account"
          component={MeStackScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => {
              return focused ? <MeActive /> : <MeInActive />;
            },
          }}
        />
        <Tab.Screen
          name="OnDemand"
          component={OnDemandStackScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => {
              return focused ? <OnDemandActive /> : <OnDemandInActive />;
            },
          }}
        />
        <Tab.Screen
          name="Active"
          component={ActiveStackScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => {
              return focused ? <FooterActive /> : <FooterInActive />;
            },
          }}
        />
        <Tab.Screen
          name="Bag"
          component={Bag}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => {
              return focused ? (
                <BagActive />
              ) : this.props.bag.length > 0 ? (
                <Bag2 />
              ) : (
                <BagInActive />
              );
            },
          }}
        />
      </Tab.Navigator>
    );
  };
  render() {
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="dark-content" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={this.props.token ? 'Home' : 'UserMain'}>
            <Stack.Screen
              name="Dashboard"
              component={this.renderBottomTab}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="UserMain"
              component={UserMain}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Forget"
              component={Forget}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChatMain"
              component={ChatMain}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChatOne"
              component={ChatOne}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Wallet"
              component={Wallet}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="StoreFront"
              component={StoreFront}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Product"
              component={Product}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Terms"
              component={Terms}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Term"
              component={Term}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SearchProduct"
              component={SearchProduct}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Verify"
              component={Verify}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Password"
              component={Password}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Transactions"
              component={Transactions}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Transaction"
              component={Transaction}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Orders"
              component={Orders}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OnDemandStage2"
              component={OnDemandStage2}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OnDemandStage3"
              component={OnDemandStage3}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Addresses"
              component={Addresses}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  token: selectUserToken(state),
  bag: selectBagItems(state),
});

export default connect(mapStateToProps)(App);
