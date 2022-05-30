import {StyleSheet} from 'react-native';
let _defz = require('../../com/def');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FDFDFD',
    flex: 1,
  },
  touch_style_close: {
    backgroundColor: '#F0F0F0',
    marginLeft: _defz.width / 15,
    borderRadius: 10,
    width: _defz.width / 2.3,
    marginTop: 'auto',
  },
  touch_style_open: {
    backgroundColor: '#fff',
    marginLeft: _defz.width / 15,
    borderRadius: 10,
    width: _defz.width / 2.3,
    marginTop: 'auto',
  },
  text_borrow: {
    fontSize: 12,
    color: '#707070',
    marginLeft: '9%',
    fontFamily: 'FuturaPT-Book',
  },
  sliderImages: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxWidth: '100%',
    height: _defz.height / 6,
  },
  text_address: {
    marginLeft: '5%',
    marginTop: 2,
    fontSize: 10,
    fontFamily: 'FuturaPT-Medium',
  },
  text_title_shop: {
    marginLeft: 5,
    marginTop: 5,
    fontSize: 18,
    fontFamily: 'FuturaPT-Medium',
  },
  text_title_shop_number: {
    marginLeft: 5,
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'FuturaPT-Medium',
  },
  view_line: {
    width: '70%',
    alignSelf: 'center',
    height: 5,
    borderRadius: 15,
    marginVertical: 5,
    backgroundColor: 'black',
  },
  view_line_b: {
    width: '70%',
    alignSelf: 'center',
    height: 6,
    borderRadius: 50,
    marginTop: 5,
    backgroundColor: 'black',
    position: 'absolute',
    zIndex: 999,
  },

  scrollViewH2: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    zIndex: 10,
  },

  main: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FDFDFD',
  },
  search_input: {
    color: 'black',
    fontFamily: 'FuturaPT-BookObl',
    fontSize: 18,
    borderRadius: 40,
  },

  box_scroll: {
    width: '100%',
  },
  map: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  text_select: {
    alignSelf: 'center',
    fontFamily: 'FuturaPT-Demi',
    color: 'black',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  text_unselect: {
    alignSelf: 'center',
    fontFamily: 'FuturaPT-Demi',
    color: 'black',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  text_select22: {
    alignSelf: 'center',
    fontFamily: 'FuturaPTDemi',
    color: 'white',
    fontSize: 10.5,
    textTransform: 'capitalize',
  },
  text_unselect22: {
    alignSelf: 'center',
    fontFamily: 'FuturaPTDemi',
    color: '#07BD5E',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  unselect: {
    alignContent: 'center',
    alignSelf: 'center',
    width: '16%',
    minWidth: 70,
    elevation: 15,
    borderColor: 'black',
    marginLeft: '2%',
    justifyContent: 'center',
    backgroundColor: '#FDFDFD',
    textTransform: 'capitalize',
  },
  select: {
    alignContent: 'center',
    alignSelf: 'center',
    width: '16%',
    elevation: 15,
    borderColor: 'green',
    marginLeft: '2%',
    justifyContent: 'center',
    backgroundColor: '#07BD5E',
    textTransform: 'capitalize',
  },

  unselectb: {
    borderColor: 'black',
    marginLeft: 10,
    elevation: 7,
    height: 30,
    borderRadius: 20,
    bottom: 5,
    top: 3,
    backgroundColor: 'white',
    textTransform: 'capitalize',
    fontFamily: 'FuturaPT-Demi',
  },
  selectb: {
    borderColor: 'black',
    marginLeft: 10,
    elevation: 5,
    height: 32,
    borderRadius: 20,
    bottom: 5,
    top: 3,
    backgroundColor: '#3D80F2',
    textTransform: 'capitalize',
    fontFamily: 'FuturaPT-Demi',
  },

  unselectb_data: {
    color: 'gray',
    textTransform: 'capitalize',
    fontFamily: 'FuturaPT-Medium',
    fontSize: 14
  },
  unselect_heart_icon: {
    color: 'gray',
    textTransform: 'capitalize',
    fontFamily: 'FuturaPT-Medium',
    fontSize: 20
  },
  select_heart_icon: {
    color: 'white',
    textTransform: 'capitalize',
    fontFamily: 'FuturaPT-Medium',
    fontSize: 20
  },
  selectb_data: {
    color: 'white',
    textTransform: 'capitalize',
    fontFamily: 'FuturaPT-Medium',
    fontSize: 14
  },
  markerView: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  headerSearchTypes: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginTop: '1%',
    alignSelf: 'center',
  },
  heartIcon: {
    alignSelf: 'center',
    fontSize: 20,
    margin: 5,
    color: '#3D80F2',
  },
  header: {
    backgroundColor: '#FDFDFD',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 40,
    marginTop: 10,
    elevation: 8,
    height: 40,
  },
  storeList: {
    marginTop: 10,
    width: '100%', 
    alignSelf: 'center'
  }
});
