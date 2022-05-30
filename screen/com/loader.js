import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {Button, Text, Icon, Left} from 'native-base';

let _defz = require('../com/def');
class Loader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.loader}>
        <View style={styles.loadingz}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    zIndex: 99999999999,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    opacity: 0.5,
    left: 0,
    backgroundColor: '#000000a3',
  },

  loadingz: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default Loader;
