import React, {Component} from 'react';
import {View, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {CardItem, Right, Left, Button, Text, Root, Icon} from 'native-base';
import {NewMassage, NoMassage} from '../com/svg-files';
import {styles} from './styles/account.styles';
import {connect} from 'react-redux';
import {selectUserToken} from '../../redux/user/user.selectors';

import {jsonBeautify} from 'beautify-json';

let _defz = require('../com/def');
var Footers = require('../com/footer').default;

class account extends Component {
  constructor() {
    super();
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);

    this.state = {
      profile: null,
      newMassage: false,
    };
  }
  forceUpdateHandler() {
    this.forceUpdate();
  }

  test2(_id) {
    this.props.navigation.navigate('UserMain');
  }

  componentWillMount() {
    this.getprofile();
    this.get_chat();
  }
  async getprofile() {
    const {navigate} = this.props.navigation;
    try {
      await _defz
        .get_via_token('user/account/profile', 'GET', this.props.token)
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            this.setState({profile: response.profile.personal_info});
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

  async get_chat() {
    try {
      await _defz
        .get_via_token('user/chats?limit=15&offset=0', 'GET', this.props.token)
        .then(response => {
          console.log(jsonBeautify(response));
          if (response.status === 200) {
            response.chats.forEach(item => {
              if (item.new_message) {
                this.setState({newMassage: true});
              }
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

  render() {
    const {navigate} = this.props.navigation;

    return (
      <Root>
        <View style={styles.header}>
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
          <View style={styles.container}>
            <Text style={styles.text1}>Account</Text>

            <View style={styles.headingRow}>
              <Button
                iconRight
                style={styles.b1}
                onPress={() => navigate('Orders')}>
                <Text style={styles.headingRowText}>orders</Text>
              </Button>
              <Button
                iconRight
                style={styles.b1}
                onPress={() => navigate('ChatMain')}>
                {this.state.newMassage ? <NewMassage /> : <NoMassage />}
                <Text style={styles.headingRowText}>Messages</Text>
              </Button>
            </View>
            <View style={styles.headingRow}>
              <Button
                iconRight
                style={styles.b1}
                onPress={() => navigate('Transactions')}>
                <Text style={styles.headingRowText}>Transaction</Text>
              </Button>
              <Button
                iconRight
                style={styles.b1}
                onPress={() => navigate('BorrowReceipts')}>
                <Text style={styles.headingRowText}>Borrow Receipts</Text>
              </Button>
            </View>

            <ScrollView style={{marginTop: 20,}}>
              <View>
                <TouchableOpacity onPress={() => navigate('Profile')}>
                  <CardItem style={styles.card}>
                    <Left>
                      <TouchableOpacity onPress={() => navigate('Profile')}>
                        <Text style={styles.text_card}>Profile</Text>
                      </TouchableOpacity>
                    </Left>

                    <Right>
                      <TouchableOpacity onPress={() => navigate('Profile')}>
                        <View style={{marginTop: 12,}} />
                        <Icon
                          type="AntDesign"
                          name="arrowright"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </Right>
                  </CardItem>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigate('Addresses')}>
                  <CardItem style={styles.card}>
                    <Left>
                      <TouchableOpacity onPress={() => navigate('Addresses')}>
                        <Text style={styles.text_card}>Address</Text>
                      </TouchableOpacity>
                    </Left>

                    <Right>
                      <TouchableOpacity onPress={() => navigate('Addresses')}>
                        <Icon
                          type="AntDesign"
                          name="arrowright"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </Right>
                  </CardItem>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigate('Wallet')}>
                  <CardItem style={styles.card}>
                    <Left>
                      <TouchableOpacity onPress={() => navigate('Wallet')}>
                        <Text style={styles.text_card}>Wallet</Text>
                      </TouchableOpacity>
                    </Left>

                    <Right>
                      <TouchableOpacity onPress={() => navigate('Wallet')}>
                        <Icon
                          type="AntDesign"
                          name="arrowright"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </Right>
                  </CardItem>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigate('Terms')}>
                  <CardItem style={styles.card}>
                    <Left>
                      <TouchableOpacity onPress={() => navigate('Terms')}>
                        <Text style={styles.text_card}>Terms</Text>
                      </TouchableOpacity>
                    </Left>

                    <Right>
                      <TouchableOpacity onPress={() => navigate('Terms')}>
                        <Icon
                          type="AntDesign"
                          name="arrowright"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </Right>
                  </CardItem>
                </TouchableOpacity>

                <TouchableOpacity >
                  <CardItem style={styles.card}>
                    <Left>
                      <TouchableOpacity>
                        <Text style={styles.text_card}>Notifications</Text>
                      </TouchableOpacity>
                    </Left>

                    <Right>
                      <TouchableOpacity>
                        <Icon
                          type="AntDesign"
                          name="arrowright"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </Right>
                  </CardItem>
                </TouchableOpacity>

                <TouchableOpacity>
                  <CardItem style={styles.card}>
                    <Left>
                      <TouchableOpacity>
                        <Text style={styles.text_card}>Location</Text>
                      </TouchableOpacity>
                    </Left>

                    <Right>
                      <TouchableOpacity>
                        <Icon
                          type="AntDesign"
                          name="arrowright"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </Right>
                  </CardItem>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: _defz.height/1.4}} />
            </ScrollView>
          </View>
        </View>

      </Root>
    );
  }
}

const mapDispatchToProps = state => ({
  token: selectUserToken(state),
});

export default connect(mapDispatchToProps)(account);
