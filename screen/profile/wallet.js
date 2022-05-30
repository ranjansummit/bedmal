import React, {Component} from 'react';
import {View, Alert, ScrollView, TextInput} from 'react-native';
import {Button, Text, Root, Icon} from 'native-base';
import {styles} from './styles/wallet.styles';
let _defz = require('../com/def');
import Footers from '../com/footer';
import Headers from '../com/header';
import Loader from '../com/loader';
import {jsonBeautify} from 'beautify-json';

import {selectUserToken} from '../../redux/user/user.selectors';
import {connect} from 'react-redux';

class wallet extends Component {
  constructor() {
    super();

    this.state = {
      addresses: '',
      isLoading: false,
      itemToEditID: 0,
      primaryAddress: 0,
      itemToEditAddress: '',
      itemToEditPostalCode: '',
      itemToEditPrimary: 0,
    };
  }

  async getAddresses() {
    try {
      this.setState({isLoading: true});
      await _defz
        .get_via_token('user/account/wallet/cards', 'GET', this.props.token)
        .then(response => {
          console.log(jsonBeautify(response));
          if (response.status === 400) {
            Alert.alert('Error', response.errors[0].message, [{text: 'ok'}], {
              cancelable: true,
            });
          }
          if (response.status === 200) {
            this.setState({
              isLoading: false,
              addresses: response.card,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  async saveAddress(address, postalCode, primary, addressID) {
    try {
      this.setState({isLoading: true});
      let formData = new FormData();
      formData.append('address', address);
      formData.append('postal_code', postalCode);
      formData.append('primary', primary);

      await _defz
        .send(
          `user/account/addresses/edit/${addressID}`,
          'POST',
          this.props.token,
          formData,
        )
        .then(response => {
          this.setState({isLoading: false});
          console.log(jsonBeautify(response));
          if (response.status === 400) {
            Alert.alert('Error', response.errors[0].message, [{text: 'ok'}], {
              cancelable: true,
            });
          }
          if (response.status === 200) {
            this.setState({addresses: [], itemToEditID: 0});
            this.getAddresses();
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getAddresses();
  }

  render() {
    return (
      <Root>
        {!this.state.isLoading ? (
          <>
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
                <Headers navigation={this.props.navigation} route={'wallet'} />
                <ScrollView
                  contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollView}>
                  {this.state.addresses
                    ? this.state.addresses.map((item, idx) => {
                        return (
                          <View
                            key={idx}
                            style={
                              this.state.itemToEditID === item.id
                                ? styles.activeCard
                                : styles.addressCard
                            }>
                            {this.state.itemToEditID === item.id ? (
                              <>
                                <Button
                                  style={styles.closeEditButton}
                                  transparent
                                  onPress={() =>
                                    this.setState({itemToEditID: 0})
                                  }>
                                  <Icon
                                    name="closecircleo"
                                    type="AntDesign"
                                    style={styles.closeEditButtonIcon}
                                  />
                                </Button>
                                <TextInput
                                  value={this.state.itemToEditAddress}
                                  placeholder={'Your Address'}
                                  onChangeText={text =>
                                    this.setState({itemToEditAddress: text})
                                  }
                                  style={styles.textInput}
                                />
                                <TextInput
                                  placeholder={'Postal Code'}
                                  value={this.state.itemToEditPostalCode}
                                  onChangeText={text =>
                                    this.setState({itemToEditPostalCode: text})
                                  }
                                  style={styles.textInput}
                                />
                              </>
                            ) : (
                              <>
                                <Text style={styles.addresText}>
                                  {item.address}
                                </Text>
                                <Text>{item.postal_code}</Text>
                              </>
                            )}
                            <View style={styles.addressCardFooter}>
                              <Button
                                iconRight
                                transparent
                                onPress={() =>
                                  this.state.itemToEditID === item.id
                                    ? this.setState({
                                        primaryAddress: item.id,
                                        itemToEditPrimary: item.id,
                                      })
                                    : null
                                }
                                style={
                                  item.primary === 1 ||
                                  this.state.itemToEditPrimary === item.id
                                    ? styles.activePrimaryButton
                                    : styles.addressCardFooterButton
                                }>
                                <View style={{position: 'relative'}}>
                                  {item.primary === 1 ? (
                                    <Text
                                      style={
                                        item.primary === 1 ||
                                        this.state.itemToEditPrimary === item.id
                                          ? styles.primaryText
                                          : styles.addressCardFooterText
                                      }>
                                      Primary
                                    </Text>
                                  ) : (
                                    <View
                                      style={
                                        ([
                                          item.primary === 1 ||
                                          this.state.itemToEditPrimary ===
                                            item.id
                                            ? styles.primaryText
                                            : styles.addressCardFooterText,
                                        ],
                                        {
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        })
                                      }>
                                      <Text style={{color: 'gray'}}>
                                        Primary
                                      </Text>
                                      <Icon
                                        name="circle"
                                        type="FontAwesome"
                                        style={styles.footerButtonXIcon}
                                      />
                                    </View>
                                  )}
                                </View>
                              </Button>
                              {this.state.itemToEditID === item.id ? (
                                <Button
                                  transparent
                                  onPress={() => {
                                    this.saveAddress(
                                      this.state.itemToEditAddress,
                                      this.state.itemToEditPostalCode,
                                      this.state.itemToEditPrimary === item.id
                                        ? 1
                                        : 0,
                                      this.state.itemToEditID,
                                    );
                                  }}
                                  style={
                                    this.state.itemToEditID === item.id
                                      ? styles.activeEditButton
                                      : styles.addressCardFooterButton
                                  }>
                                  <Text
                                    style={
                                      this.state.itemToEditID === item.id
                                        ? styles.activeEditText
                                        : styles.addressCardFooterText
                                    }>
                                    Save
                                  </Text>
                                </Button>
                              ) : (
                                <Button
                                  transparent
                                  onPress={() =>
                                    this.state.itemToEditID
                                      ? null
                                      : this.setState({
                                          itemToEditID: item.id,
                                          primaryAddress: 0,
                                          itemToEditAddress: item.address,
                                          itemToEditPostalCode:
                                            item.postal_code,
                                        })
                                  }
                                  style={
                                    this.state.itemToEditID === item.id
                                      ? styles.activeEditButton
                                      : styles.addressCardFooterButtonEdit
                                  }>
                                  <Text
                                    style={
                                      this.state.itemToEditID === item.id
                                        ? styles.activeEditText
                                        : styles.addressCardFooterTextEdit
                                    }>
                                    Edit
                                  </Text>
                                </Button>
                              )}
                            </View>
                          </View>
                        );
                      })
                    : null}
                  <View style={{marginTop: 100}} />
                </ScrollView>
              </View>
            </View>
          </>
        ) : (
          <Loader />
        )}

      </Root>
    );
  }
}
const mapStateToProps = state => ({
  token: selectUserToken(state),
});
export default connect(mapStateToProps)(wallet);
