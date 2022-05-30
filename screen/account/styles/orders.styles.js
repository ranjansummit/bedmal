import {StyleSheet} from 'react-native';
let _defz = require('../../com/def');

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  headerXbutton: {
    alignSelf: 'flex-end',
  },
  headerXIcon: {
    alignSelf: 'center',
    color: 'silver',
    fontSize: 35,
    margin: 5,
  },
  content: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FAFAFA',
  },
  main: {
    // borderRadius: 40,
    backgroundColor: '#000',
  },
  card: {
    marginVertical: 10,
    minHeight: _defz.height / 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontFamily: 'FuturaPT-Book',
    fontSize: 18,
    color: '#707070',
  },
  cardFooter: {
    fontFamily: 'FuturaPT-Book',
    fontSize: 18,
    color: '#C3BCBC',
  },
  cardLeft: {
    flex: 2,
  },
  cardRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  status: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: _defz.width / 4,
  },
  circleBlack: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 500,
    marginBottom: _defz.height / 100,
    elevation: 4,
  },
  circleGreen: {
    width: 40,
    height: 40,
    backgroundColor: '#08D18C',
    borderRadius: 500,
    marginBottom: _defz.height / 100,
    elevation: 4,
  },
  circlePink: {
    width: 40,
    height: 40,
    backgroundColor: '#E03174',
    borderRadius: 500,
    marginBottom: _defz.height / 100,
    elevation: 4,
  },
  statusText: {
    fontFamily: 'FuturaPT-Book',
    fontSize: 20,
    color: '#707070',
  },
  heading: {
    backgroundColor: '#000',
    width: '100%',
  },
  scrollView: {
    height: '100%',
    backgroundColor: '#FAFAFA',
  }
});
