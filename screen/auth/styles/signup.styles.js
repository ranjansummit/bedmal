import {StyleSheet} from 'react-native';
let _defz = require('../../com/def');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: _defz.main_color,
  },
  b2: {
    alignSelf: 'center',
    marginTop: 15,
    height: 50,
    backgroundColor: 'white',
    width: '90%',
    justifyContent: 'center',
  },
  textb2: {
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
    color: 'black',
  },
  textsub: {
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: 22,
    color: 'gray',
    fontFamily: 'FuturaPT-Medium'
  },
  textsignup: {
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: 13,
    color: 'black',
    bottom: 20,
  },
  textb3: {
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: 18,
    color: 'black',
    textTransform: 'capitalize',
    fontFamily: 'FuturaPT-Medium',
  },
  textfooter: {
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: 15,
    color: 'gray',
    width: '90%',
    marginTop: '2%',
    textAlign: 'center',
    fontFamily: 'FuturaPT-Book',
  },
  b1: {
    alignSelf: 'center',
    marginTop: _defz.height / 15,
    height: 50,
    bottom: '4%',
    color: '#3D80F2',
    backgroundColor: '#3D80F2',
    width: '90%',
    justifyContent: 'center',
  },
  textb1: {
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: 18,
    color: 'white',
    textTransform: 'capitalize',
    fontFamily: 'FuturaPT-Medium',
  },
  text1: {
    color: 'black',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: '3%',
  },

  textInput: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 25,
    height: 41,
    elevation: 3,
    backgroundColor: 'white',
    color: 'black',
    borderWidth: 1,
    borderColor: '#C3BCBC',
    textAlign: 'left',
    marginTop: '5%',
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: 'FuturaPT-Book',
  },
  logoImage: {
    alignSelf: 'center',
    height: '10%',
    width: '50%',
    marginTop: '10%',
  },
  splitter: {
    flexDirection: 'row',
    marginTop: 30,
  },
  textInput3: {
    width: '75%',
    alignSelf: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    height: 41,
    elevation: 3,
    backgroundColor: 'white',
    color: 'black',
    borderColor: '#C3BCBC',
    textAlign: 'left',
    marginTop: '5%',
    marginLeft: 1,
    fontSize: 16,
    borderWidth: 1,
    borderLeftWidth: 0,
    fontFamily: 'FuturaPT-Book',
  },
  textInput2: {
    width: '14%',
    alignSelf: 'center',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    height: 41,
    elevation: 3,
    backgroundColor: 'white',
    color: 'black',
    borderColor: '#C3BCBC',
    textAlign: 'left',
    marginTop: '5%',
    paddingLeft: 16,
    fontSize: 16,
    marginLeft: '5%',
    fontFamily: 'FuturaPT-Book',
    borderWidth: 1,
    borderRightWidth: 0
  },
  splitterText: {
    margin: 10,
    color: 'gray',
  },
  splitterLine: {
    alignSelf: 'center',
    width: '45%',
    height: 1,
    backgroundColor: 'silver',
  },
});