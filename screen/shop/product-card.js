import React from 'react';
import {Text, Image, StyleSheet} from 'react-native';
import {Button} from 'native-base';

import NoImage from '../../asset/img/no-img.jpg';

let _def = require('../com/def');

class ProductCard extends React.Component {
  render() {
    const {navigate} = this.props.navigation;
    return (
      <Button
        style={styles.card}
        transparent
        onPress={() =>
          navigate('Product', {
            itemId: this.props.id,
          })
        }>
        <Text style={styles.new}>{this.props.new ? 'New' : null}</Text>
        <Text style={styles.productTitle} numberOfLines={1} >{this.props.name}</Text>
        <Text style={styles.price}>£{this.props.price}</Text>

        <Image
          style={styles.productImg}
          source={{
            uri: this.props.img
              ? this.props.img
              : NoImage,
          }}
        />
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderColor: '#707070',
    borderWidth: 0.3,
    borderRadius: 10,
    height: 240,
    width: '48%',
    marginTop: 10,
    marginBottom: 10,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '1%',
    elevation: 6,
    backgroundColor: '#fff',
  },
  new: {
    color: '#F79F28',
    fontFamily: 'FuturaPT-Medium',
  },
  productTitle: {
    fontFamily: 'FuturaPT-Medium',
    fontSize: 20,
    width: '90%',
    textAlign: 'center',
  },
  productImg: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    height: 165,
  },
  price: {
    color: '#707070',
    fontFamily: 'FuturaPT-Medium',
    fontSize: 14,
  },
});

export default ProductCard;
