import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import {
  CardItem,
  Right,
  Left,
  Body,
  Button,
  Thumbnail,
  ListItem,
  List,
  Root,
  Icon,
} from 'native-base';
import {LogoChat, AlertsOn, AlertsOff} from '../com/svg-files';
import {styles} from './styles/chat_main.styles';
import {connect} from 'react-redux';
import {selectUserToken} from '../../redux/user/user.selectors';
import {jsonBeautify} from 'beautify-json';

let lodings = false;
let paging = false;
let _defz = require('../com/def');
var Footers = require('../com/footer').default;
let timer;
class chat_main extends Component {
  constructor() {
    super();
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);

    this.state = {
      chatdata: null,
      alert: 0,
    };
  }
  forceUpdateHandler() {
    this.forceUpdate();
  }

  test2(_id) {
    this.props.navigation.navigate('UserMain');
  }

  componentWillMount() {
    this.get_chat();
    timer = setInterval(() => {
      this.get_chat();
    }, 15000);
  }
  componentWillUnmount() {
    clearInterval(timer);
  }
  nav(x) {
    clearInterval(timer);
    const {navigate} = this.props.navigation;
    if (x.receiver.type == 'super_admin') {
      navigate('ChatOne', {id: x.id, type: 'admin'});
    } else {
      navigate('ChatOne', {
        id: x.receiver.id,
        type: 'vendor_chat',
        name: x.receiver.name,
      });
    }
  }
  renderItems() {
    const {navigate} = this.props.navigation;
    if (this.state.chatdata) {
      let items = [];
      this.state.chatdata.map((dataItem, idx) => {
        items.push(
          <ListItem noBorder avatar style={styles.cartItem} key={idx}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.chatAvatar}
              onPress={() => this.nav(dataItem)}>
              <Left style={{}}>
                {dataItem.new_message ? (
                  <Icon
                    name="circle"
                    type="FontAwesome"
                    style={styles.avatarBadge}
                  />
                ) : (
                  <Icon
                    name="circle"
                    type="FontAwesome"
                    style={styles.avatarBadge2}
                  />
                )}
                {dataItem.receiver.type == 'super_admin' ? (
                  <Thumbnail
                    style={{
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: 'black',
                      marginTop: -15
                    }}
                    source={require('../../asset/img/playstore-icon.png')}
                  />
                ) : (
                  <Thumbnail
                    style={{backgroundColor: 'white',    marginTop: -15}}
                    source={{
                      uri:
                        'http://bedmal-core.aralstudio.top' +
                        dataItem.receiver.image_gallery[0],
                    }}
                  />
                )}
              </Left>
            </TouchableOpacity>
            <Body>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.chatInfo}
                onPress={() => this.nav(dataItem)}>
                <Text style={styles.cardTitle}>{dataItem.receiver.name}</Text>
                <Text style={styles.lastMassage}>{dataItem.last_message.message}</Text>
              </TouchableOpacity>
            </Body>
            <Right>
              <Text style={styles.dateTime}>
                {dataItem.created_at
                  .slice(0, 11)
                  .split('-')
                  .reverse()
                  .join('/')}
              </Text>
            </Right>
          </ListItem>,
        );
      });

      return items;
    }
  }

  async get_chat() {
    const {navigate} = this.props.navigation;
    try {
      await _defz
        .get_via_token('user/chats?limit=15&offset=0', 'GET', this.props.token)
        .then(response => {
          // console.log(jsonBeautify(response));
          if (response.status === 200) {
            this.setState({chatdata: response.chats, alert: response.alerts});
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

  async toggleAlert() {
    const {navigate} = this.props.navigation;
    try {
      await _defz
        .get_via_token('user/chats/alerts', 'GET', this.props.token)
        .then(response => {
          console.log(jsonBeautify(response));
          if (response.status === 200) {
            this.get_chat();
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
        <View style={styles.container}>
          <Button
            transparent
            style={styles.headerBackButto}
            onPress={() => this.props.navigation.goBack()}>
            <Icon
              name="closecircleo"
              type="AntDesign"
              style={styles.alertIcon}
            />
          </Button>
          <View style={styles.header}>
            <Button
              style={styles.b1}
              vertical
              transparent
              onPress={() => this.toggleAlert()}>
              {this.state.alert === 1 ? (
                <>
                  <AlertsOn
                    width={_defz.width / 20}
                    height={_defz.height / 40}
                  />
                  <Text style={styles.alertButtonTextOn}>Alerts on</Text>
                </>
              ) : (
                <>
                  <AlertsOff
                    width={_defz.width / 20}
                    height={_defz.height / 40}
                  />
                  <Text style={styles.alertButtonTextOff}>Alerts off</Text>
                </>
              )}
            </Button>

            <Text style={styles.headerText}>messages</Text>
          </View>
          <View style={styles.heading}>
            <CardItem style={styles.card}>
              <Left style={styles.headingText}>
                <Text style={styles.text1}> App or borrow product issues?</Text>
              </Left>

              <Right style={styles.headingButton}>
                <Button
                  transparent
                  style={styles.headerBtn}
                  onPress={() =>
                    navigate('ChatOne', {id: '0', type: 'admin'})
                  }>
                  <View style={styles.logoContainer}>
                    <LogoChat width={_defz.width / 7} height={30} />
                  </View>
                </Button>
              </Right>
            </CardItem>
          </View>

          <ScrollView style={{marginTop: 5,width: _defz.width,}}>
            <View style={{height: _defz.height / 80}} />
            {this.renderItems()}

            {paging === true ? (
              <ActivityIndicator
                size="large"
                color="red"
                style={{alignSelf: 'center'}}
              />
            ) : null}
            {lodings === true && paging === false ? (
              <ActivityIndicator size="large" color="grey" />
            ) : null}
            <View style={{marginTop: 120}} />
          </ScrollView>

        </View>
      </Root>
    );
  }
}

const mapStateToProps = state => ({
  token: selectUserToken(state),
});

export default connect(mapStateToProps)(chat_main);
