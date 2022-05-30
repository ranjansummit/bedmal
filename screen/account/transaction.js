import React, {Component} from 'react';
import {Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {CardItem, Right, Left, Icon, Button} from 'native-base';
import {styles} from './styles/transaction.styles';

import {selectUserToken} from '../../redux/user/user.selectors';
import {connect} from 'react-redux';
import {jsonBeautify} from 'beautify-json';
import Loader from '../com/loader';
import Headers from '../com/header';

let _defz = require('../com/def');

class Transaction extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      transaction: null,
      vendors: null,
    };
  }

  async getTransactions(id) {
    try {
      this.setState({isLoading: true});
      await _defz
        .get_via_token(
          `user/account/transactions/info/${id}`,
          'GET',
          this.props.token,
        )
        .then(response => {
          this.setState({isLoading: false});
          console.log(jsonBeautify(response));
          if (response.status === 200) {
            this.setState({
              transaction: response.transaction,
              vendors: response.vendors,
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
    let id = this.props.route.params.id;
    this.getTransactions(id);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : this.state.transaction ? (
          <View style={styles.main}>
            <Button
              transparent
              style={styles.headerXbutton}
              onPress={() => this.props.navigation.goBack()}>
              <Icon
                name="closecircleo"
                type="AntDesign"
                style={styles.headerXIcon}
              />
            </Button>
            <Headers
              route={'Transaction'}
              navigation={this.props.navigation}
              message={'ChatMain'}
            />

            <View style={styles.content}>
              <View style={styles.info}>
                <View style={styles.infoLeft}>
                  <Text style={styles.infoText}>Date</Text>
                  <Text style={styles.infoText}>Ref</Text>
                  <Text style={styles.infoText}>Total</Text>
                </View>
                <View style={styles.infoRight}>
                  <Text style={styles.infoText}>
                    {this.state.transaction.created_at.slice(0, 10)}
                  </Text>
                  <Text style={styles.infoText}>
                    {this.state.transaction.ref_id}
                  </Text>
                  <Text style={styles.infoText}>
                    {this.state.transaction.total_price}
                  </Text>
                </View>
              </View>
              <ScrollView>
                <View style={{height:"100%"}}>
                  {this.state.vendors.map((item, idx) => {
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() =>
                          this.props.navigation.navigate('Order', {
                            id: this.state.transaction.order_id,
                          })
                        }
                        style={styles.card}>
                        <Left>
                          <Text style={styles.cardTitle}>{item.name}</Text>
                          <Text style={styles.cardTitle}>
                            £{item.total_price}
                          </Text>
                        </Left>

                        <Right>
                          <Icon
                            type="AntDesign"
                            name="arrowright"
                            style={styles.icon}
                          />
                        </Right>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={{marginTop: 100}} />
              </ScrollView>
            </View>
          </View>
        ) : null}


      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: selectUserToken(state),
});
export default connect(mapStateToProps)(Transaction);
