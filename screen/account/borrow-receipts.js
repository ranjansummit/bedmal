import React, {Component} from 'react';
import {Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {CardItem, Right, Left, Icon, Button} from 'native-base';
import {styles} from './styles/borrow-receipts.styles';

import {selectUserToken} from '../../redux/user/user.selectors';
import {connect} from 'react-redux';
import {jsonBeautify} from 'beautify-json';
import Loader from '../com/loader';
import Headers from '../com/header';
import Footers from '../com/footer';

import {ArrowBack, Massage} from './../com/svg-files';
let _defz = require('../com/def');
class BorrowReceipts extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      borrowReceipts: null,
    };
  }

  async getBorrowReceipts() {
    try {
      this.setState({isLoading: true});
      await _defz
        .get_via_token(
          'user/account/borrow-receipts?offset=0&limit=100',
          'GET',
          this.props.token,
        )
        .then(response => {
          this.setState({isLoading: false});
          console.log(jsonBeautify(response));
          if (response.status === 200) {
           this.setState({
              borrowReceipts: response.borrow_receipts,
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
    this.getBorrowReceipts();
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
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
            <View transparent style={styles.headerContainer}>
            <Button
          transparent
          style={styles.arrowBack}
          onPress={() => this.props.navigation.goBack()}>
          <ArrowBack />
        </Button>

        <Text style={styles.headerText}>Borrow receipts</Text>

            </View>


            <ScrollView style={styles.content}>
              <View style={styles.content}>
                {this.state.borrowReceipts
                  ? this.state.borrowReceipts.map((item, idx) => {
                      return (
                        <TouchableOpacity
                          key={idx}
                          onPress={() =>
                            this.props.navigation.navigate('BorrowReceipt', {
                              id: item.id,
                            })
                          }
                          style={styles.card}>
                          <Left>
                            {/* <Text style={styles.cardTitle}>ApplePay</Text> */}
                            <Text style={styles.cardTitle}>
                              {item.vendor_info.name}
                            </Text>
                            <Text style={styles.cardFooter}>
                              Date: {item.created_at.slice(0, 10)}
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
                    })
                  : null}
              </View>
              <View style={{marginTop: 150}} />
            </ScrollView>
          </View>
        )}

      </View>
    );
  }
}
const mapStateToProps = state => ({
  token: selectUserToken(state),
});
export default connect(mapStateToProps)(BorrowReceipts);
