import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Button, Header, Icon, Item, Input } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapboxGL, { MarkerView } from '@react-native-mapbox-gl/maps';
import { SearchBoxBlue, HomeInActive, BagInActive, Bag2 } from '../com/svg-files';
import { SliderBox } from 'react-native-image-slider-box';
import ProductCard from './product-card';
import { styles } from './styles/search-product';
import { Keyboard } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { selectUserToken } from '../../redux/user/user.selectors';
import { connect } from 'react-redux';
import { selectBagItems } from '../../redux/store/store.selectors';
import Geolocation from '@react-native-community/geolocation';
import Loader from '../com/loader';
const { jsonBeautify } = require('beautify-json');
let _defz = require('../com/def');
const marker_Local_Image = [
  require('../../asset/marker/1.png'),
  require('../../asset/marker/2.png'),
  require('../../asset/marker/3.png'),
  require('../../asset/marker/4.png'),
  require('../../asset/marker/5.png'),
  require('../../asset/marker/6.png'),
  require('../../asset/marker/7.png'),
  require('../../asset/marker/8.png'),
  require('../../asset/marker/9.png'),
  require('../../asset/marker/10.png'),
  require('../../asset/marker/11.png'),
  require('../../asset/marker/12.png'),
  require('../../asset/marker/13.png'),
  require('../../asset/marker/14.png'),
  require('../../asset/marker/15.png'),
  require('../../asset/marker/16.png'),
  require('../../asset/marker/17.png'),
  require('../../asset/marker/18.png'),
  require('../../asset/marker/19.png'),
  require('../../asset/marker/20.png'),
  require('../../asset/marker/21.png'),
  require('../../asset/marker/22.png'),
  require('../../asset/marker/23.png'),
  require('../../asset/marker/24.png'),
  require('../../asset/marker/25.png'),
  require('../../asset/marker/26.png'),
];
MapboxGL.setAccessToken(
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
);
MapboxGL.setTelemetryEnabled(false);

const Marker = ({ coordinate, id, color, label }) => {
  return coordinate[0] && coordinate[1] ? (
    <MarkerView coordinate={coordinate} id={id}>
      <View style={[styles.markerView, {}]} />
      <View>
        <Image
          resizeMode={'contain'}
          width={25}
          height={25}
          source={marker_Local_Image[id]}
        />
      </View>
    </MarkerView>
  ) : null;
};

class SearchProduct extends Component {
  constructor() {
    super();
    this._renderModeOptions = [
      {
        label: 'Normal',
        data: 'normal',
      },
      {
        label: 'Native',
        data: 'native',
      },
      {
        label: 'Hidden',
        data: 'hidden',
      },
    ];
    this.state = {
      searchText: '',
      searchProducts: null,
      searchType: 'current',
      show_full: false,
      mapRef: null,
      loading_like: false,
      loading: false,
      acctive_shop: '',
      serach_txt: '',
      selected_btn: '',
      show_box: false,
      departments: null,
      vendors: null,
      position: {
        latitude: 53.4808,
        longitude: 2.2426,
      },
      centerCoordinate: [53.4808, 2.2426],
      renderMode: this._renderModeOptions[0].data,
      followUserLocation: true,
      showsUserHeadingIndicator: false,
    };

    this.onRenderModeChange = this.onRenderModeChange.bind(this);
  }
  onRenderModeChange(index, renderMode) {
    this.setState({ renderMode });
  }
  async get_store(parm_data) {
    Keyboard.dismiss();
    this.setState({ loading: true });
    const { navigate } = this.props.navigation;
    try {
      let params = '';
      if (parm_data !== 'new') {
        params = parm_data;
      }
      await _defz
        .get_via_token('user/home' + params, 'GET', this.props.token)
        .then((response) => {
          console.log(response.departments);
          if (response.status === 200) {
            if (response.vendors) {
              this.setState({ vendors: response.vendors });
              this.shop_selecter(
                response.vendors[0].id,
                response.vendors[0].longitude,
                response.vendors[0].latitude,
              )
            }
          }
          this.setState({ loading: false });
        });
    } catch (error) {
      console.log(error);
    }
  }
  async searchProducts(searchText, id) {
    try {
      console.log(searchText);
      this.setState({loading: true});
      Keyboard.dismiss();
      await _defz
        .send(
          `user/store-front/search?search=${searchText}&${this.state.searchType === 'all' ? null : id
          }`,
          'GET',
          this.props.token,
        )
        .then((response) => {
          this.setState({loading: false});
          if (response.status === 200) {
            this.setState({ searchText: '' });
            this.setState({ searchProducts: response.products });
          }
          if (response.status === 400) {
            Alert.alert('Error', response.errors[0].message, [{ text: 'ok' }], {
              cancelable: true,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
  async like_dislike_vendor(vendor_id, index) {
    this.setState({ loading_like: true });
    try {
      await _defz
        .get_via_token(
          'user/like-dislike-vendor/' + vendor_id,
          'GET',
          this.props.token,
        )
        .then((response) => {
          if (response.status === 200) {
            this.state.vendors[index].liked = !this.state.vendors[index].liked;
          }

          this.setState({ loading_like: false });
        });
    } catch (error) {
      console.log(error);
    }
  }

  handleClickMarker(itemIndex) {
    this._scrollView.scrollTo({ x: itemIndex * 300 });
  }

  shop_selecter = async (x, lng, lat) => {
    if (this.state.acctive_shop == x) {
      this.setState({ acctive_shop: '' });
    } else {
      this.setState({ acctive_shop: x });
      this.camera_map.zoomTo(12);
      this.camera_map.flyTo([lng, lat], 1000);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if(this.state.searchType !== prevState.searchType) {
      this.get_store('?search=' + this.state.searchText);
    }
  }
  componentDidMount() {
    PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ],
      {
        title: 'Location',
        message: 'access location',
      },
    )
      .then((granted) => {
        console.log(granted);
        this.searchProducts(this.state.searchText, this.props.route.params.vendorID);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    let vendorID = this.props.route.params.vendorID;
    MapboxGL.setAccessToken(
      'pk.eyJ1IjoiYmFyYmFyeWFiIiwiYSI6ImNraTMyaWt3dTFta2oycnFxcDRrOW4xd2oifQ.190FCXQ4cF95_ZhzMisEyw',
    );
    const { navigate } = this.props.navigation;
    return this.state.show_full ? (
      <View style={styles.contentTransparent}>
        <View style={styles.transparentHeader}>
          <Button
            transparent
            style={styles.mapHeaderBackButton}
            onPress={() => this.props.navigation.goBack()}
          />
          <Header
            transparent
            androidStatusBarColor="black"
            style={styles.header}
            searchBar
            rounded>
            <Item style={{ borderRadius: 50, elevation: 6 }}>
              <Button
                transparent
                onPress={() =>
                  this.get_store('?search=' + this.state.searchText)
                }>
                <Icon name="ios-search" style={{ color: 'black' }} />
              </Button>

              <Input
                placeholder="Search"
                value={this.state.searchText}
                style={styles.search_input}
                // autoFocus
                onChangeText={(text) => this.setState({ searchText: text })}
                onEndEditing={() =>
                  this.searchProducts(this.state.searchText, vendorID)
                }
              />
            </Item>
          </Header>

          <View style={styles.searchTypeButtons}>
            <Button
              style={
                this.state.searchType === 'current'
                  ? styles.searchTypeButtonActive
                  : styles.searchTypeButton
              }
              transparent
              onPress={() =>
                this.setState({ searchType: 'current', show_full: false })
              }>
              <Text
                style={
                  this.state.searchType === 'current'
                    ? styles.searchTypeTextActive
                    : styles.searchTypeText
                }>
                Current
              </Text>
            </Button>
            <Button
              style={
                this.state.searchType === 'all'
                  ? styles.searchTypeButtonActive
                  : styles.searchTypeButton
              }
              transparent
              onPress={() =>
                this.setState({ searchType: 'all', show_full: true })
              }>
              <Text
                style={
                  this.state.searchType === 'all'
                    ? styles.searchTypeTextActive
                    : styles.searchTypeText
                }>
                All stores
              </Text>
            </Button>
          </View>
        </View>

        <MapboxGL.MapView
          styleURL={'mapbox://styles/mapbox/light-v10'}
          ref={(c) => (this._map = c)}
          zoomLevel={5}
          style={styles.map}>
          {this.state.vendors
            ? this.state.vendors.map((item, index) => {
              if (item.latitude !== NaN && item.longitude !== NaN) {
                let coordinate_item = [
                  parseFloat(item.longitude),
                  parseFloat(item.latitude),
                ];

                return (
                  <View>
                    <Button
                      onPress={() => {
                        this.shop_selecter(
                          item.id,
                          item.longitude,
                          item.latitude,
                        );
                        this.handleClickMarker(index);
                      }}>
                      <Marker
                        id={index}
                        key={index}
                        coordinate={coordinate_item}
                        label={index}
                        color={'red'}
                      />
                    </Button>
                  </View>
                );
              }
            })
            : null}
          <MapboxGL.Camera
            ref={(c) => (this.camera_map = c)}
            zoomLevel={5}
            animationMode={'flyTo'}
          />
        </MapboxGL.MapView>

        {this.state.vendors !== null ? (
          <View style={styles.types}>
            <ScrollView
              style={styles.scrollViewH2}
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={(view) => (this._scrollView = view)}>
              {this.state.vendors.map((item, index) => {
                let img_arr = [];
                item.image_gallery.forEach((item) => {
                  img_arr.push(item);
                });

                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    key={index}
                    onPress={() => {
                      this.state.acctive_shop !== item.id
                        ? this.shop_selecter(
                          item.id,
                          item.longitude,
                          item.latitude,
                        )
                        : this.setState({ acctive_shop: '' });
                    }}
                    style={[
                      this.state.acctive_shop !== item.id
                        ? styles.touch_style_close
                        : styles.touch_style_open,
                    ]}>
                    {this.state.acctive_shop == item.id ? (
                      <View style={styles.view_line_b} />
                    ) : null}
                    <SliderBox
                      images={img_arr}
                      sliderBoxHeight={_defz.height / 8}
                      parentWidth={_defz.width / 2.3}
                      dotColor={'#fff'}
                      autoplay={true}
                      circleLoop
                      style={styles.sliderImages}
                    />
                    <View style={{ flexDirection: 'row', marginTop: ' 2%' }}>
                      <Text style={styles.text_title_shop_number}>
                        {index + 1} |{' '}
                      </Text>
                      {this.state.acctive_shop == item.id ? (
                        <Text style={styles.text_title_shop}>{item.name}</Text>
                      ) : (
                        <Text numberOfLines={1} style={styles.text_title_shop}>
                          {item.name}
                        </Text>
                      )}
                    </View>
                    {this.state.acctive_shop == item.id ? (
                      <Text numberOfLines={1} style={styles.text_address}>
                        {item.address}
                      </Text>
                    ) : null}

                    {this.state.acctive_shop == item.id ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '80%',
                          alignSelf: 'center',
                          marginTop: 5,
                        }}>
                        <Text style={styles.text_borrow} numberOfLines={1}>
                          Collection
                        </Text>
                        {item.collections ? (
                          <Icon
                            name="check"
                            type="AntDesign"
                            style={{
                              color: 'black',
                              marginLeft: 'auto',
                              fontSize: 16,
                            }}
                          />
                        ) : (
                          <Icon
                            name="close"
                            type="AntDesign"
                            style={{
                              color: 'black',
                              marginLeft: 'auto',
                              fontSize: 16,
                            }}
                          />
                        )}
                      </View>
                    ) : null}
                    {this.state.acctive_shop == item.id ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '80%',
                          alignSelf: 'center',
                        }}>
                        <Text style={styles.text_borrow} numberOfLines={1}>
                          Delivery{' '}
                        </Text>
                        {item.fulfillments ? (
                          <Icon
                            name="check"
                            type="AntDesign"
                            style={{
                              color: 'black',
                              marginLeft: 'auto',
                              fontSize: 16,
                            }}
                          />
                        ) : (
                          <Icon
                            name="close"
                            type="AntDesign"
                            style={{
                              color: 'black',
                              marginLeft: 'auto',
                              fontSize: 16,
                            }}
                          />
                        )}
                      </View>
                    ) : null}

                    {this.state.acctive_shop == item.id ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '80%',
                          alignSelf: 'center',
                          marginTop: 5,
                        }}>
                        <Text style={styles.text_borrow} numberOfLines={1}>
                          BorrowCup
                        </Text>
                        {item.borrow_partner_cup == 1 ? (
                          <Icon
                            name="check"
                            type="AntDesign"
                            style={{
                              color: 'black',
                              marginLeft: 'auto',
                              fontSize: 16,
                            }}
                          />
                        ) : (
                          <Icon
                            name="close"
                            type="AntDesign"
                            style={{
                              color: 'black',
                              marginLeft: 'auto',
                              fontSize: 16,
                            }}
                          />
                        )}
                      </View>
                    ) : null}
                    {this.state.acctive_shop == item.id ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '80%',

                          alignSelf: 'center',
                        }}>
                        <Text style={styles.text_borrow} numberOfLines={1}>
                          BorrowBag
                        </Text>
                        {item.borrow_partner_bag == 1 ? (
                          <Icon
                            name="check"
                            type="AntDesign"
                            style={{
                              color: 'black',
                              marginLeft: 'auto',
                              fontSize: 16,
                            }}
                          />
                        ) : (
                          <Icon
                            name="close"
                            type="AntDesign"
                            style={{
                              color: 'black',
                              marginLeft: 'auto',
                              fontSize: 16,
                            }}
                          />
                        )}
                      </View>
                    ) : null}

                    {this.state.acctive_shop == item.id ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: '#F0F0F0',
                          elevation: 5,
                          width: '80%',
                          alignSelf: 'center',
                          borderRadius: 10,
                          marginVertical: 10,
                        }}>
                        {this.state.loading_like == false ? (
                          <Button
                            transparent
                            rounded
                            style={{ marginLeft: '5%' }}
                            onPress={() =>
                              this.like_dislike_vendor(item.id, index)
                            }>
                            {item.liked == true ? (
                              <Icon
                                name="heart"
                                type="AntDesign"
                                style={{ color: '#3D80F2' }}
                              />
                            ) : (
                              <Icon
                                name="hearto"
                                type="AntDesign"
                                style={{ color: 'gray' }}
                              />
                            )}
                          </Button>
                        ) : (
                          <ActivityIndicator
                            size="small"
                            style={{ marginLeft: '15%' }}
                            color="gray"
                          />
                        )}
                        <Button
                          rounded
                          style={{
                            marginTop: _defz.height / 70,
                            height: 26,
                            bottom: _defz.height / 300,
                            textTransform: 'capitalize',
                            marginRight: '4%',
                            marginLeft: 'auto',
                            backgroundColor: '#3D80F2',
                            width: 75,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => navigate('StoreFront', { id: item.id })}>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: 'white',
                              textTransform: 'capitalize',
                              fontFamily: 'FuturaPT-Book',
                              textAlign: 'center',
                            }}>
                            Shop
                          </Text>
                        </Button>
                      </View>
                    ) : null}
                    {this.state.acctive_shop !== item.id ? (
                      <View style={styles.view_line} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
              <View style={{ marginRight: 25 }} />
            </ScrollView>
          </View>
        ) : null}
        <View style={styles.footer}>
          <Button
            style={styles.homeButton}
            transparent
            onPress={() => this.props.navigation.navigate('Home')}>
            <HomeInActive />
          </Button>
          <View style={styles.searchBox}>
            <SearchBoxBlue />
          </View>
          {this.props.bag.length > 0 ? (
            <View style={styles.homeButtonWithBadge}>
              <View style={styles.badgeCircle} />
              <Button
                style={styles.homeButton}
                transparent
                onPress={() => this.props.navigation.navigate('Bag', { x: 1 })}>
                <Bag2 />
              </Button>
            </View>
          ) : (
            <Button
              style={styles.homeButton}
              transparent
              onPress={() => this.props.navigation.navigate('Bag', { x: 1 })}>
              <BagInActive />
            </Button>
          )}
        </View>
      </View>
    ) : (
      <View style={styles.container}>
        <View style={styles.content}>
          <Button
            transparent
            style={styles.headerBackButton}
            onPress={() => this.props.navigation.goBack()}
          />

          <Header
            transparent
            androidStatusBarColor="black"
            style={styles.header}
            searchBar
            rounded>
            <Item style={styles.search_box}>
              {!this.state.searchText ? (
                <Button
                  transparent
                  onPress={() =>
                    this.searchProducts(this.state.searchText, vendorID)
                  }>
                  <Icon name="ios-search" style={{ color: '#707070', marginBottom: 3 }} />
                </Button>
              ) : null}

              {this.state.searchText ? (
                <View style={{ flexDirection: 'row-reverse' }}>
                  <Button
                    transparent
                    onPress={() =>
                      this.searchProducts(this.state.searchText, vendorID)
                    }>
                    <Icon name="ios-search" style={{ color: '#707070', marginTop: 2 }} />
                  </Button>
                </View>
              ) : null}

              <Input
                placeholder="Search"
                value={this.state.searchText}
                style={styles.search_input}
                // autoFocus
                onChangeText={(text) => this.setState({ searchText: text })}
                onEndEditing={() =>
                  this.searchProducts(this.state.searchText, vendorID)
                }
              />
              {this.state.searchText ? (
                <View style={{ flexDirection: 'row-reverse' }}>
                  <Button
                    style={styles.cancelSearch}
                    transparent
                    onPress={() => this.setState({ searchText: '' })}>
                    <Icon name="close" style={{ color: '#707070' }} />
                  </Button>
                </View>
              ) : null}
            </Item>

            <Button />
          </Header>
          <View style={styles.searchTypeButtons}>
            <Button
              style={
                this.state.searchType === 'current'
                  ? styles.searchTypeButtonActive
                  : styles.searchTypeButton
              }
              transparent
              onPress={() =>
                this.setState({ searchType: 'current', show_full: false })
              }>
              <Text
                style={
                  this.state.searchType === 'current'
                    ? styles.searchTypeTextActive
                    : styles.searchTypeText
                }>
                Current
              </Text>
            </Button>
            <Button
              style={
                this.state.searchType === 'all'
                  ? styles.searchTypeButtonActive
                  : styles.searchTypeButton
              }
              transparent
              onPress={() =>
                this.setState({ searchType: 'all', show_full: true })
              }>
              <Text
                style={
                  this.state.searchType === 'all'
                    ? styles.searchTypeTextActive
                    : styles.searchTypeText
                }>
                All stores
              </Text>
            </Button>
          </View>
          {this.state.loading && 
            <Loader/>
          }
          <View style={styles.productCards}>
            <ScrollView style={styles.scrollViewV} scrollEnabled>
              {this.state.searchProducts ? (
                <View style={styles.products}>
                  {this.state.searchProducts.map((item, idx) =>
                    item ? (
                      <ProductCard
                        new={item.new}
                        name={item.name}
                        price={item.price}
                        img={item.images[0]}
                        id={item.id}
                        navigation={this.props.navigation}
                        key={idx}
                      />
                    ) : null,
                  )}
                </View>
              ) : null}
              <View style={{ marginBottom: 110 }} />
            </ScrollView>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            style={styles.homeButton}
            transparent
            onPress={() => this.props.navigation.navigate('Home')}>
            <HomeInActive />
          </Button>
          <View style={styles.searchBox}>
            <SearchBoxBlue />
          </View>
          {this.props.bag.length > 0 ? (
            <View style={styles.homeButtonWithBadge}>
              <View style={styles.badgeCircle} />
              <Button
                style={styles.homeButton}
                transparent
                onPress={() => this.props.navigation.navigate('Bag', { x: 1 })}>
                <Bag2 />
              </Button>
            </View>
          ) : (
            <Button
              style={styles.homeButton}
              transparent
              onPress={() => this.props.navigation.navigate('Bag', { x: 1 })}>
              <BagInActive />
            </Button>
          )}
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  token: selectUserToken(state),
  bag: selectBagItems(state),
});
export default connect(mapStateToProps)(SearchProduct);
