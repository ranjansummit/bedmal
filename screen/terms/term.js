import React, {Component} from 'react';
import {Text, View, ScrollView, Alert} from 'react-native';
import {Root} from 'native-base';
import {Button, Icon} from 'native-base';

import {styles} from './styles/term.styles';

import {selectUserToken} from '../../redux/user/user.selectors';
import {connect} from 'react-redux';

var Footer = require('../com/footer').default;
var Header = require('../com/header').default;
let _defz = require('../com/def');
const {jsonBeautify} = require('beautify-json');

class Term extends Component {
  constructor() {
    super();
    this.state = {
      terms: null,
    };
  }
  async getTerm(id) {
    try {
      await _defz
        .get_via_token('user/account/terms/info/' + id, 'GET', this.props.token)
        .then(response => {
          // console.log(jsonBeautify(response));
          if (response.status === 200) {
            this.setState({terms: response.term});
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
    this.getTerm(this.props.route.params.termId);
  }
  render() {
    return (
      <Root>
        <View style={styles.header}>
          <Button
            transparent
            style={styles.headerButton}
            onPress={() => this.props.navigation.goBack()}>
            <Icon
              name="closecircleo"
              type="AntDesign"
              style={styles.headerCloseIcon}
            />
          </Button>
        </View>
        <View style={styles.content}>
          <View style={styles.heading}>
            <Header
              navigation={this.props.navigation}
              route={
                this.state.terms ? (
                  <Text> {this.state.terms.title} </Text>
                ) : null
              }
            />
          </View>
          <View style={{backgroundColor: '#FAFAFA', height: 10}} />
          <ScrollView style={styles.scrollView}>
            {this.state.terms ? (
              <Text style={styles.termsText}>{this.state.terms.content}</Text>
            ) : null}
            <View style={{marginTop: 400}} />
          </ScrollView>
        </View>
      </Root>
    );
  }
}
const mapStateToProps = state => ({
  token: selectUserToken(state),
});
export default connect(mapStateToProps)(Term);
