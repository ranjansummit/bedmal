import React, { Component } from 'react';
import { View, Alert, TextInput, Keyboard, ScrollView } from 'react-native';
import {
  CardItem,
  Right,
  Left,
  Body,
  Button,
  Text,
  Root,
  Icon,
} from 'native-base';
import { styles } from './styles/profile.styles';

import { selectUserToken } from '../../redux/user/user.selectors';
import { connect } from 'react-redux';

let name = '',
  pass = '',
  mobile = '',
  email = '';
let _defz = require('../com/def');
var Footers = require('../com/footer').default;
var Headers = require('../com/header').default;
import Loader from '../com/loader';
class Profile extends Component {
  constructor() {
    super();
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);

    this.state = {
      profile: null,
      editname: false,
      editemail: false,
      editmobile: false,
      editpass: false,
      name: '',
      email: '',
      pass: '',
      mobile: '',
      isLoading: false,
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
  }

  update = async x => {
    this.setState({ isLoading: true });
    Keyboard.dismiss();
    let formData = new FormData();
    if (x === 'name') {
      formData.append('name', name);
    }
    if (x === 'mobile') {
      formData.append('mobile', mobile);
    }
    if (x === 'email') {
      formData.append('email', email);
    }
    if (x === 'pass') {
      formData.append('password', pass);
    }

    await _defz
      .send('user/account/profile/edit', 'POST', this.props.token, formData)
      .then(response => {
        console.log(response);
        if (response.status == 200) {
          this.getprofile();
          this.setState({ editemail: false });
          this.setState({ editmobile: false });
          this.setState({ editname: false });
          this.setState({ editpass: false });
          Alert.alert('Done', 'User Info Updated!', [{ text: 'ok' }], {
            cancelable: true,
          });
        }
        if (response.status == 400) {
          Alert.alert('Error', response.errors[0].message, [{ text: 'ok' }], {
            cancelable: true,
          });
        }
        this.setState({ isLoading: false });
      });
  };
  async getprofile() {
    try {
      this.setState({ isLoading: true });
      await _defz
        .get_via_token('user/account/profile', 'GET', this.props.token)
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            this.setState({ profile: response.profile.personal_info });
            this.setState({ name: response.profile.personal_info.name });
            this.setState({ pass: response.profile.personal_info });
            if (response.profile.personal_info.mobile == '') {
              this.setState({ mobile: 'Mobile number not entered' });
            } else {
              this.setState({ mobile: response.profile.personal_info.mobile });
              mobile = response.profile.personal_info.mobile;
            }

            this.setState({ email: response.profile.personal_info.email });
            name = response.profile.personal_info.name;

            email = response.profile.personal_info.email;
            this.forceUpdate();
          }
          if (response.status === 400) {
            Alert.alert('Error', response.errors[0].message, [{ text: 'ok' }], {
              cancelable: true,
            });
          }
          this.setState({ isLoading: false });
        });
    } catch (error) {
      this.setState({ isLoading: false });
      console.log(error);
    }
  }

  render() {
    return (
      <Root>
        {!this.state.isLoading ? (
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Button
                transparent
                style={styles.headerXbutton}
                onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name="closecircleo"
                  type="AntDesign"
                  style={styles.headerXicon}
                />
              </Button>
              <View style={styles.container}>
                <Headers navigation={this.props.navigation} route={'Profile'} />

                <CardItem style={styles.card}>
                  {!this.state.editname ? (
                    <Left style={styles.cardLeft}>
                      <Text style={styles.title}>Name</Text>
                      {this.state.profile ? (
                        <Text style={styles.text1}>
                          {this.state.profile.name}
                        </Text>
                      ) : null}
                    </Left>
                  ) : (
                    <Left style={styles.cardLeft}>
                      <Text style={styles.text1}>Name</Text>
                      <TextInput
                        autoFocus={this.state.editname ? true : false}
                        placeholder={this.state.name}
                        placeholderTextColor="black"
                        onChangeText={text => {
                          name = text;
                        }}
                        maxLength={50}
                        style={styles.textInput}
                      />
                    </Left>
                  )}
                  <Right style={{ flex: 1 }}>
                    {!this.state.editname ? (
                      <Button
                        rounded
                        light
                        style={styles.b1}
                        onPress={() => this.setState({ editname: true })}>
                        <Text style={styles.editButton}> Edit </Text>
                      </Button>
                    ) : (
                      <Button
                        rounded
                        light
                        style={styles.b2}
                        onPress={() => this.update('name')}>
                        <Text style={styles.editButton}>Save</Text>
                      </Button>
                    )}
                  </Right>
                </CardItem>

                <CardItem style={styles.card}>
                  {!this.state.editemail ? (
                    <Left style={styles.cardLeft}>
                      <Text style={styles.title}>Email Address</Text>
                      {this.state.profile ? (
                        <Text style={styles.text1}>
                          {this.state.profile.email}
                        </Text>
                      ) : null}
                    </Left>
                  ) : (
                    <Left style={styles.cardLeft}>
                      <Text numberOfLines={1} style={styles.text1}>
                        Email Address
                      </Text>
                      <TextInput
                        placeholder={this.state.email}
                        autoFocus={this.state.editemail ? true : false}
                        placeholderTextColor="black"
                        onChangeText={text => {
                          email = text;
                        }}
                        maxLength={50}
                        style={styles.textInput}
                      />
                    </Left>
                  )}

                  <Right style={{}}>
                    {!this.state.editemail ? (
                      <Button
                        rounded
                        light
                        style={styles.b1}
                        onPress={() => this.setState({ editemail: true })}>
                        <Text style={styles.editButton}> Edit </Text>
                      </Button>
                    ) : (
                      <Button
                        rounded
                        light
                        style={styles.b2}
                        onPress={() => this.update('email')}>
                        <Text style={styles.editButton}>Save</Text>
                      </Button>
                    )}
                  </Right>
                </CardItem>

                <CardItem style={styles.card}>
                  {!this.state.editmobile ? (
                    <Left style={styles.cardLeft}>
                      <Text style={styles.title}>Mobile Number</Text>
                      {this.state.profile ? (
                        <Text style={styles.text1}>{this.state.mobile}</Text>
                      ) : null}
                    </Left>
                  ) : (
                    <Left style={styles.cardLeft}>
                      <Text style={styles.text1}>Mobile Number</Text>
                      <TextInput
                        placeholder={this.state.mobile}
                        autoFocus={this.state.editmobile ? true : false}
                        placeholderTextColor="black"
                        onChangeText={text => {
                          mobile = text;
                        }}
                        maxLength={50}
                        style={styles.textInput}
                      />
                    </Left>
                  )}

                  <Right style={{ flex: 1 }}>
                    {!this.state.editmobile ? (
                      <Button
                        rounded
                        light
                        style={styles.b1}
                        onPress={() => this.setState({ editmobile: true })}>
                        <Text style={styles.editButton}> Edit </Text>
                      </Button>
                    ) : (
                      <Button
                        rounded
                        light
                        style={styles.b2}
                        onPress={() => this.update('mobile')}>
                        <Text style={styles.editButton}>Save</Text>
                      </Button>
                    )}
                  </Right>
                </CardItem>

                <CardItem style={styles.card}>
                  {!this.state.editpass ? (
                    <Left style={styles.cardLeftLarge}>
                      <Text style={styles.title}>Password</Text>
                      {this.state.profile ? (
                        <Text style={styles.text1}>**********</Text>
                      ) : null}
                    </Left>
                  ) : (
                    <Left style={styles.cardLeftLarge}>
                      <Text style={styles.text1}>Password</Text>
                      <TextInput
                        placeholder="******"
                        placeholderTextColor="black"
                        autoFocus={this.state.editpass ? true : false}
                        onChangeText={text => {
                          pass = text;
                        }}
                        maxLength={50}
                        style={styles.textInput}
                      />
                    </Left>
                  )}
                  <Body />
                  <Right>
                    {!this.state.editpass ? (
                      <Button
                        rounded
                        light
                        style={styles.b1}
                        onPress={() => this.setState({ editpass: true })}>
                        <Text style={styles.editButton}> Edit </Text>
                      </Button>
                    ) : (
                      <Button
                        rounded
                        light
                        style={styles.b2}
                        onPress={() => this.update('pass')}>
                        <Text style={styles.editButton}> Save </Text>
                      </Button>
                    )}
                  </Right>
                </CardItem>
                <View style={{marginTop: 100,}} />
              </View> 
            </View>
          </ScrollView>
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
export default connect(mapStateToProps)(Profile);
