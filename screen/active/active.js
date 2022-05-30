import React, {Component} from 'react';
import {Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Button, CardItem, Left, Right, Icon} from 'native-base';

import {styles} from './styles/active.styles';

import {EmptyGlass, Lid, LidCup, LidSleeveCup, Bag} from '../com/svg-files';

import {selectUserToken} from '../../redux/user/user.selectors';
import {connect} from 'react-redux';

import {jsonBeautify} from 'beautify-json';
import Loader from '../com/loader';

const _defz = require('../com/def');

class Active extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      activeTab: 'borrows',
      orders: null,
      borrows: null,
    };
  }
  async getActivesOrders() {
    try {
      this.setState({isLoading: true});
      await _defz
        .get_via_token(
          'user/active/orders?offset=0&limit=100',
          'GET',
          this.props.token,
        )
        .then((response) => {
          this.setState({isLoading: false});
          console.log(jsonBeautify(response));
          if (response.status === 200) {
            this.setState({
              orders: response.orders,
            });
          }
          if (response.status === 400) {
            Alert.alert('Error', response.errors[0].message, [{text: 'ok'}], {
              cancelable: true,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
  async getActiveBorrows() {
    try {
      this.setState({isLoading: true});
      await _defz
        .get_via_token(
          'user/active/borrow-receipts?offset=0&limit=100',
          'GET',
          this.props.token,
        )
        .then((response) => {
          this.setState({isLoading: false});
          console.log(jsonBeautify(response));
          if (response.status === 200) {
            this.setState({
              borrows: response.borrow_receipts,
            });
          }
          if (response.status === 400) {
            Alert.alert('Error', response.errors[0].message, [{text: 'ok'}], {
              cancelable: true,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
  componentDidMount() {
    this.getActivesOrders();
    this.getActiveBorrows();
  }

  timeDetector(date) {
    const date1 = new Date(date);
    const date2 = new Date();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            <Text style={styles.activeTitle}>Active</Text>
            <View style={styles.tab}>
              <Button
                onPress={() => this.setState({activeTab: 'borrows'})}
                transparent
                style={[
                  this.state.activeTab === 'borrows'
                    ? styles.activeTabButton
                    : null,
                  styles.tabButton,
                ]}>
                <Text
                  style={[
                    this.state.activeTab === 'borrows'
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                    styles.tabText,
                  ]}>
                  Borrows
                </Text>
              </Button>
              <Button
                onPress={() => this.setState({activeTab: 'orders'})}
                transparent
                style={[
                  this.state.activeTab === 'orders'
                    ? styles.activeTabButton
                    : null,
                  styles.tabButton,
                ]}>
                <Text
                  style={[
                    this.state.activeTab === 'orders'
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                    styles.tabText,
                  ]}>
                  Orders
                </Text>
              </Button>
            </View>
            {this.state.activeTab === 'borrows' ? (
              <ScrollView style={styles.scrollView}>
                <View>
                  {this.state.borrows && this.state.borrows.length ? (
                    this.state.borrows.map((item, idx) => {
                      if (item.lid && item.sleeve && item.cup) {
                        return (
                          <CardItem style={styles.card} key={idx}>
                            <Left style={styles.cardLeft}>
                              <LidSleeveCup
                                width={_defz.width / 4}
                                height={_defz.height / 9}
                              />
                              <View style={styles.cardLeftInfo}>
                                <Text style={styles.cardLeftText}>lid</Text>
                                <Text style={styles.cardLeftText}>sleeve</Text>
                                <Text style={styles.cardLeftText}>cup</Text>
                              </View>
                            </Left>
                            <Right style={styles.cardRight}>
                              <View style={styles.status}>
                                <View
                                  style={
                                    this.timeDetector(item.due) > 2
                                      ? styles.timeCircle
                                      : styles.timeCircleWarn
                                  }>
                                  <Text
                                    style={
                                      this.timeDetector(item.due) > 2
                                        ? styles.timeCircleText
                                        : styles.timeCircleWarnText
                                    }>
                                    {this.timeDetector(item.due)}
                                  </Text>
                                </View>
                                <Text style={styles.statusText}>
                                  days to return
                                </Text>
                              </View>
                            </Right>
                          </CardItem>
                        );
                      }
                      if (item.lid && item.cup && !item.sleeve) {
                        return (
                          <CardItem style={styles.card} key={idx}>
                            <Left style={styles.cardLeft}>
                              <LidCup
                                width={_defz.width / 4}
                                height={_defz.height / 9}
                              />
                              <View style={styles.cardLeftInfo}>
                                <Text style={styles.cardLeftText}>lid</Text>
                                <Text style={styles.cardLeftText}>cup</Text>
                              </View>
                            </Left>
                            <Right style={styles.cardRight}>
                              <View style={styles.status}>
                                <View
                                  style={
                                    this.timeDetector(item.due) > 2
                                      ? styles.timeCircle
                                      : styles.timeCircleWarn
                                  }>
                                  <Text
                                    style={
                                      this.timeDetector(item.due) > 2
                                        ? styles.timeCircleText
                                        : styles.timeCircleWarnText
                                    }>
                                    {this.timeDetector(item.due)}
                                  </Text>
                                </View>
                                <Text style={styles.statusText}>
                                  {this.timeDetector(item.due) > 2
                                    ? 'days to return'
                                    : 'due today'}
                                </Text>
                              </View>
                            </Right>
                          </CardItem>
                        );
                      }
                      if (!item.lid && !item.sleeve && item.cup) {
                        return (
                          <CardItem style={styles.card} key={idx}>
                            <Left style={styles.cardLeft}>
                              <EmptyGlass
                                width={_defz.width / 4}
                                height={_defz.height / 9}
                              />
                              <View style={styles.cardLeftInfo}>
                                <Text style={styles.cardLeftText}>cup</Text>
                              </View>
                            </Left>
                            <Right style={styles.cardRight}>
                              <View style={styles.status}>
                                <View
                                  style={
                                    this.timeDetector(item.due) > 2
                                      ? styles.timeCircle
                                      : styles.timeCircleWarn
                                  }>
                                  <Text
                                    style={
                                      this.timeDetector(item.due) > 2
                                        ? styles.timeCircleText
                                        : styles.timeCircleWarnText
                                    }>
                                    {this.timeDetector(item.due)}
                                  </Text>
                                </View>
                                <Text style={styles.statusText}>
                                  {this.timeDetector(item.due) > 2
                                    ? 'days to return'
                                    : 'due today'}
                                </Text>
                              </View>
                            </Right>
                          </CardItem>
                        );
                      }
                      if (!item.lid && !item.sleeve && !item.cup && item.bag) {
                        return (
                          <CardItem style={styles.card} key={idx}>
                            <Left style={styles.cardLeft}>
                              <Bag
                                width={_defz.width / 4}
                                height={_defz.height / 9}
                              />
                              <View style={styles.cardLeftInfo}>
                                <Text style={styles.cardLeftText}>bag</Text>
                              </View>
                            </Left>
                            <Right style={styles.cardRight}>
                              <View style={styles.status}>
                                <View
                                  style={
                                    this.timeDetector(item.due) > 2
                                      ? styles.timeCircle
                                      : styles.timeCircleWarn
                                  }>
                                  <Text
                                    style={
                                      this.timeDetector(item.due) > 2
                                        ? styles.timeCircleText
                                        : styles.timeCircleWarnText
                                    }>
                                    {this.timeDetector(item.due)}
                                  </Text>
                                </View>
                                <Text style={styles.statusText}>
                                  {this.timeDetector(item.due) > 2
                                    ? 'days to return'
                                    : 'due today'}
                                </Text>
                              </View>
                            </Right>
                          </CardItem>
                        );
                      }
                      if (item.lid && !item.sleeve && !item.cup && !!item.bag) {
                        return (
                          <CardItem style={styles.card} key={idx}>
                            <Left style={styles.cardLeft}>
                              <Lid
                                width={_defz.width / 4}
                                height={_defz.height / 9}
                              />
                              <View style={styles.cardLeftInfo}>
                                <Text style={styles.cardLeftText}>lid</Text>
                              </View>
                            </Left>
                            <Right style={styles.cardRight}>
                              <View style={styles.status}>
                                <View
                                  style={
                                    this.timeDetector(item.due) > 2
                                      ? styles.timeCircle
                                      : styles.timeCircleWarn
                                  }>
                                  <Text
                                    style={
                                      this.timeDetector(item.due) > 2
                                        ? styles.timeCircleText
                                        : styles.timeCircleWarnText
                                    }>
                                    {this.timeDetector(item.due)}
                                  </Text>
                                </View>
                                <Text style={styles.statusText}>
                                  {this.timeDetector(item.due) > 2
                                    ? 'days to return'
                                    : 'due today'}
                                </Text>
                              </View>
                            </Right>
                          </CardItem>
                        );
                      }
                    })
                  ) : (
                    <Text style={styles.noitem}>No Items</Text>
                  )}
                </View>
                <View style={{marginTop: 200}} />
              </ScrollView>
            ) : (
              <ScrollView style={styles.scrollView}>
                <View>
                  {this.state.orders && this.state.orders.length ? (
                    this.state.orders.map((item, idx) => {
                      if (
                        item.status === 'ready_to_pickup' ||
                        item.status === 'being_delivered'
                      ) {
                        return (
                          <TouchableOpacity
                            key={idx}
                            style={styles.card}
                            onPress={() =>
                              this.props.navigation.navigate('Order', {
                                id: item.id,
                              })
                            }>
                            <View style={styles.cardLeft}>
                              <Text style={styles.cardTitle}>
                                {item.vendor_info.name}
                              </Text>
                              <Text style={styles.cardTitle}>
                                {item.fulfillment ? 'Collection' : 'Delivery'}
                              </Text>
                              <Text style={styles.cardFooter}>
                                {item.ref_id}
                              </Text>
                              <Text style={styles.cardFooter}>
                                {item.created_at.slice(0, 10)}
                              </Text>
                              <Text style={styles.cardFooter}>
                                £{item.total_price}
                              </Text>
                            </View>
                            <View style={styles.cardRight}>
                              <View style={styles.status}>
                                <View style={styles.circleGreen} />
                                <Text style={styles.statusText}>
                                  pick-up now
                                </Text>
                              </View>
                              <Icon
                                type="AntDesign"
                                name="arrowright"
                                style={styles.icon}
                              />
                            </View>
                          </TouchableOpacity>
                        );
                      }
                      if (
                        item.status === 'picked_up' ||
                        item.status === 'delivered' ||
                        item.status === 'canceled' ||
                        item.status === 'rejected'
                      ) {
                        return (
                          <TouchableOpacity
                            style={styles.card}
                            key={idx}
                            onPress={() =>
                              this.props.navigation.navigate('Order', {
                                id: item.id,
                              })
                            }>
                            <View style={styles.cardLeft}>
                              <Text style={styles.cardTitle}>
                                {item.vendor_info.name}
                              </Text>
                              <Text style={styles.cardTitle}>
                                {item.fulfillment ? 'Collection' : 'Delivery'}
                              </Text>
                              <Text style={styles.cardFooter}>
                                {item.ref_id}
                              </Text>
                              <Text style={styles.cardFooter}>
                                {item.created_at.slice(0, 10)}
                              </Text>
                              <Text style={styles.cardFooter}>
                                £{item.total_price}
                              </Text>
                            </View>
                            <View style={styles.cardRight}>
                              <View style={styles.status}>
                                <View style={styles.circleBlack} />
                                <Text style={styles.statusText}>
                                  {item.status}
                                </Text>
                              </View>
                              <Icon
                                type="AntDesign"
                                name="arrowright"
                                style={styles.icon}
                              />
                            </View>
                          </TouchableOpacity>
                        );
                      }
                      if (
                        item.status === 'pending' ||
                        item.status === 'not_payed'
                      ) {
                        return (
                          <TouchableOpacity
                            style={styles.card}
                            key={idx}
                            onPress={() =>
                              this.props.navigation.navigate('Order', {
                                id: item.id,
                              })
                            }>
                            <View style={styles.cardLeft}>
                              <Text style={styles.cardTitle}>
                                {item.vendor_info.name}
                              </Text>
                              <Text style={styles.cardTitle}>
                                {item.fulfillment ? 'Collection' : 'Delivery'}
                              </Text>
                              <Text style={styles.cardFooter}>
                                {item.ref_id}
                              </Text>
                              <Text style={styles.cardFooter}>
                                {item.created_at.slice(0, 10)}
                              </Text>
                              <Text style={styles.cardFooter}>
                                £{item.total_price}
                              </Text>
                            </View>
                            <View style={styles.cardRight}>
                              <View style={styles.status}>
                                <View style={styles.circlePink} />
                                <Text style={styles.statusText}>
                                  {item.status}
                                </Text>
                              </View>
                              <Icon
                                type="AntDesign"
                                name="arrowright"
                                style={styles.icon}
                              />
                            </View>
                          </TouchableOpacity>
                        );
                      }
                      if (item.status === 'accepted') {
                        return (
                          <TouchableOpacity
                            style={styles.card}
                            key={idx}
                            onPress={() =>
                              this.props.navigation.navigate('Order', {
                                id: item.id,
                              })
                            }>
                            <View style={styles.cardLeft}>
                              <Text style={styles.cardTitle}>
                                {item.vendor_info.name}
                              </Text>
                              <Text style={styles.cardTitle}>
                                {item.fulfillment ? 'Collection' : 'Delivery'}
                              </Text>
                              <Text style={styles.cardFooter}>
                                {item.ref_id}
                              </Text>
                              <Text style={styles.cardFooter}>
                                {item.created_at.slice(0, 10)}
                              </Text>
                              <Text style={styles.cardFooter}>
                                £{item.total_price}
                              </Text>
                            </View>
                            <View style={styles.cardRight}>
                              <View style={styles.status}>
                                <View style={styles.circleYellow} />
                                <Text style={styles.statusText}>
                                  {item.status}
                                </Text>
                              </View>
                              <Icon
                                type="AntDesign"
                                name="arrowright"
                                style={styles.icon}
                              />
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    })
                  ) : (
                    <Text style={styles.noitem}>No Items</Text>
                  )}
                </View>
                <View style={{marginTop: 200}} />
              </ScrollView>
            )}
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  token: selectUserToken(state),
});
export default connect(mapStateToProps)(Active);
