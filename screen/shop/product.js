import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  ImageBackground,
  TextInput,
  Alert,
  Modal,
  Image,
  CheckBox
} from 'react-native';
import {
  BorrowCupSmall,
  BorrowCupLarge,
  SwitchOff,
  SwitchOn,
  EmptyGlass,
  Location,
  BuyButton,
  CheckButton,
  BuyButtonBlue,
} from '../com/svg-files';
import { Button, Icon } from 'native-base';
import { SliderBox } from 'react-native-image-slider-box';
import RadioForm from 'react-native-simple-radio-button';
import Loader from '../com/loader';
import { styles } from './styles/product.styles';
import { connect } from 'react-redux';
import { addToBag, clearBag } from '../../redux/store/store.actions';
import { selectUserToken } from '../../redux/user/user.selectors';
import { selectBagItems } from '../../redux/store/store.selectors';

import OptionsBG from '../../asset/img/productOptions.png';
import BorrowTrue from '../../asset/img/borrowTrue.png';
import AddedToBag from '../../asset/img/addedToBag.png';
import BedmalCheckBox from '../../components/checkbox/bedmal-checkbox';
import { TouchableOpacity } from 'react-native-gesture-handler';

let price;
let radio_props = [];

const { jsonBeautify } = require('beautify-json');
let _defz = require('../com/def');
class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      borrowCop: false,
      modalPickUp: false,
      modalVisible: false,
      modalQuantity: false,
      modalDelivery: false,
      packingOptions: false,
      modalNewAddress: false,
      addedToBagModalVisible: false,
      orderType: null,
      finallPrice: null,
      borrowPartnerCup: null,
      quantity: 1,
      vendorID: 0,
      selectedDeliveryAddres: 0,
      images: [],
      name: '',
      buyType: '',
      product: '',
      newAddress: '',
      fulfillment: '',
      selectedOption: '',
      serverDeliveryInfo: '',
      productOptionTitle: '',
      activePackingOption: '',
      newAddressPostalCode: '',
      tempQ: 1,
      optionItem: {
        index: null,
        selection: false
      }
    };
  }
  async getProduct(id) {
    try {
      this.setState({ isLoading: true });
      await _defz
        .get_via_token(
          `user/store-front/product/info/${id}`,
          'GET',
          this.props.token,
        )
        .then((response) => {
          console.log("product response =====>", response.product);
          // console.log(jsonBeautify(response));
          if (response.status === 400) {
            Alert.alert('Error', response.errors[0].message, [{ text: 'ok' }], {
              cancelable: true,
            });
            this.props.navigation.goBack();
            return false;
          }
          this.setState({
            product: response.product,
            productOptionTitle: response.product.options[0]?.title,
            finallPrice: response.product.price,
            fulfillment: response.fulfillment,
            borrowPartnerCup: response.vendor_info.borrow_partner_cup,
            vendorID: response.vendor_info.id,
            isLoading: false,
          });
          price = response.product.price;
          response.product.images.forEach((item) => {
            this.state.images.push(item);
          });
          if (!this.state.images) {
            this.state.images.push(
              require('../../asset/img/bedmal-place-holder.jpg'),
            );
          }
          if (Object.keys(response.fulfillment).length) {
            response.fulfillment.delivery.addresses.forEach((address) => {
              if (address.primary === 1) {
                this.setState({
                  selectedDeliveryAddres: address.id,
                });
                this.getDeliveryInfo(this.state.product.id, address.id);
              }
            });
          }
          return response;
        });
    } catch (error) {
      Alert.alert(
        'Error',
        'error in product data read.',
        [
          {
            text: 'OK',
            onPress: () => this.props.navigation.goBack(),
            style: 'OK',
          },
        ],
        {
          cancelable: false,
        },
      );
      console.log(error);
    }
  }
  async saveAdderss(address, postalCode) {
    let formData = new FormData();
    formData.append('address', address);
    formData.append('postal_code', postalCode);
    try {
      await _defz
        .send(
          'user/account/addresses/create',
          'POST',
          this.props.token,
          formData,
        )
        .then((response) => {
          // console.log(jsonBeautify(response));
          if (response.status === 400) {
            Alert.alert('Error', response.errors[0].message, [{ text: 'ok' }], {
              cancelable: true,
            });
            this.setState({
              modalVisible: true,
              modalPickUp: false,
              modalDelivery: false,
              modalNewAddress: true,
            });
          }
          if (response.status === 200) {
            this.getProduct(this.props.route.params.itemId);
            this.setState({
              modalVisible: true,
              modalPickUp: false,
              modalDelivery: false,
              modalNewAddress: false,
              newAddress: '',
              newAddressPostalCode: '',
            });
          }
        });
    } catch (error) {
      Alert.alert('Error', 'error in add address.', [{ text: 'ok' }], {
        cancelable: true,
      });
      console.log(error);
    }
  }
  async getDeliveryInfo(productID, addressID) {
    try {
      await _defz
        .send(
          `user/store-front/product/info/${productID}/delivery-info/${addressID}`,
          'GET',
          this.props.token,
        )
        .then((response) => {
          // console.log(jsonBeautify(response));
          if (response.status === 400) {
            Alert.alert('Error', response.errors[0].message, [{ text: 'ok' }], {
              cancelable: true,
            });
          }
          if (response.status === 200) {
            this.setState({
              serverDeliveryInfo: response.delivery,
              selectedDeliveryAddres: addressID,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
  async getprofile() {
    try {
      this.setState({ isLoading: true });
      await _defz
        .get_via_token('user/account/profile', 'GET', this.props.token)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.setState({ name: response.profile.personal_info.name });
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
  componentDidMount() {
    this.getProduct(this.props.route.params.itemId);
    this.getprofile();
  }
  renderFooter() {
    const { pickup, delivery } = this.state.fulfillment;
    return (
      <View style={styles.productBuyFooter}>
        <View style={styles.footerItem}>
          <TouchableOpacity onPress={() => this.setState({ modalQuantity: true })}>
            <Text style={styles.quantityText}>
              {this.state.quantity}
            </Text>
          </TouchableOpacity>
          {/* <TextInput
            keyboardType={'number-pad'}
            value={String(this.state.quantity)}
            style={styles.quantityText}
            disabled
            onChangeText={(quantity) => this.setState({ quantity: quantity })}
          /> */}
          <Text style={styles.footerItemText}>Quantity</Text>
        </View>
        <View style={styles.footerItem}>
          <Button
            transparent
            onPress={() =>
              pickup && delivery
                ? this.setState({ modalVisible: true })
                : Alert.alert('No fulfillment')
            }
            style={styles.footerItemLocation}>
            {this.state.buyType ? (
              <Text style={styles.footerItemText}>{this.state.buyType}</Text>
            ) : (
              <Location />
            )}
          </Button>
          <Text style={styles.footerItemText}>Fulfilment</Text>
        </View>
        <View style={styles.footerItem}>
          <Button
            transparent
            style={styles.footerItemBuy}
            onPress={() => {
              this.state.buyType ? this.handleAddToBag() : null;
            }}>
            {this.state.buyType ? <BuyButtonBlue /> : <BuyButton />}
          </Button>
          <Text style={styles.footerItemText}>Add to bag</Text>
        </View>
      </View>
    );
  }
  handleAddToBag() {
    if (this.props.bag.length >= 5) {
      Alert.alert('maximum bag');
    } else {
      let itemToAdd = {
        vendorID: this.state.vendorID,
        addressID: this.state.selectedDeliveryAddres,
        buyType: this.state.buyType,
        products: [
          {
            product: this.state.product,
            orderType: this.state.orderType,
            packing: this.state.activePackingOption,
            selectedOption: this.state.selectedOption,
            optionTitle: this.state.productOptionTitle,
            quantity: this.state.quantity,
            price: this.state.finallPrice,
          },
        ],
      };
      this.props.addToBag(itemToAdd);
      this.setState({ addedToBagModalVisible: true }, () => {
        setTimeout(() => {
          this.props.navigation.goBack();
        }, 1000);
      });
    }
  }
  renderPickUpModal() {
    const { pickup } = this.state.fulfillment;
    return (
      <View style={{ width: '100%' }}>
        <View style={styles.pickupHeading}>
          <Text style={styles.styles_names}>{pickup.vendor_name}</Text>
          <Text style={styles.styles_names2}>
            {pickup.vendor_address} {pickup.vendor_postal_code}
          </Text>
        </View>
        <View style={styles.pickupInfo}>
          <Text style={styles.pickupInfoTitle}>
            Est. {pickup.pickup_info.data.estimated_time}
          </Text>
          <View style={styles.workTimes}>
            <View style={styles.workTime}>
              <Text style={styles.workTimeText}>Monday</Text>
              <Text style={styles.workTimeText2}>
                {pickup.vendor_opening_hours.mon.join('-')}
              </Text>
            </View>
            <View style={styles.workTime}>
              <Text style={styles.workTimeText}>Tuesday</Text>
              <Text style={styles.workTimeText2}>
                {pickup.vendor_opening_hours.tue.join('-')}
              </Text>
            </View>
            <View style={styles.workTime}>
              <Text style={styles.workTimeText}>Wednesday</Text>
              <Text style={styles.workTimeText2}>
                {pickup.vendor_opening_hours.wed.join('-')}
              </Text>
            </View>
            <View style={styles.workTime}>
              <Text style={styles.workTimeText}>Thursday</Text>
              <Text style={styles.workTimeText2}>
                {pickup.vendor_opening_hours.thu.join('-')}
              </Text>
            </View>
            <View style={styles.workTime}>
              <Text style={styles.workTimeText}>Friday</Text>
              <Text style={styles.workTimeText2}>
                {pickup.vendor_opening_hours.fri.join('-')}
              </Text>
            </View>
            <View style={styles.workTime}>
              <Text style={styles.workTimeText}>Saturday</Text>
              <Text style={styles.workTimeText2}>
                {pickup.vendor_opening_hours.sat.join('-')}
              </Text>
            </View>
            <View style={styles.workTime}>
              <Text style={styles.workTimeText}>Sunday</Text>
              <Text style={styles.workTimeText2}>
                {pickup.vendor_opening_hours.sun.join('-')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pickupOptionsContainer}>
          <Text
            style={styles.optionLabel}>
            Available options
          </Text>
          <ImageBackground
            source={OptionsBG}
            resizeMode={'stretch'}
            style={styles.modalOptionBackground}>
            <View style={styles.pickupOptions}>
              {this.state.fulfillment.pickup.pickup_info
                .return_borrow_products === 1 ? (
                <View style={styles.pickupOption}>
                  <Icon
                    name="check"
                    type="AntDesign"
                    style={styles.checkButton}
                  />
                  <Text style={styles.optionText}>Return BorrowBags</Text>
                </View>
              ) : (
                <View style={styles.pickupOption}>
                  <Icon
                    name="close"
                    type="AntDesign"
                    style={styles.checkButton}
                  />
                  <Text style={styles.optionText}>Return BorrowBags</Text>
                </View>
              )}
              {this.state.fulfillment.pickup.pickup_info.pack_in_borrow_bags ===
                1 ? (
                <View style={styles.pickupOption2}>
                  <Icon
                    name="check"
                    type="AntDesign"
                    style={styles.checkButton}
                  />
                  <Text style={styles.optionText}>Packed in BorrowBags</Text>
                </View>
              ) : (
                <View style={styles.pickupOption2}>
                  <Icon
                    name="close"
                    type="AntDesign"
                    style={styles.checkButton}
                  />
                  <Text style={styles.optionText}>Packed in BorrowBags</Text>
                </View>
              )}
            </View>
          </ImageBackground>
        </View>

        <Button
          transparent
          onPress={() =>
            this.setState({
              buyType: 'Pick Up',
              modalVisible: false,
              modalPickUp: false,
              modalDelivery: false,
              modalNewAddress: false,
              packingOptions: true,
            })
          }
          style={styles.acceptModalButton}>
          <CheckButton />
        </Button>
      </View>
    );
  }
  renderDeliveryModal() {
    const { delivery } = this.state.fulfillment;
    return (
      <View style={styles.pickUpView}>
        <Text
          style={styles.pickUpTitle}>
          Pick a delivery address
        </Text>
        <View style={{ marginTop: 15, width: '100%' }}>
          {delivery ? (
            <ScrollView
              style={styles.scrollViewH}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {delivery.addresses.map((item, idx) => {
                return (
                  <Button
                    style={[
                      styles.addressCart2,
                      this.state.selectedDeliveryAddres === item.id
                        ? styles.activeAddress
                        : null,
                    ]}
                    key={idx}
                    transparent
                    onPress={() =>
                      this.getDeliveryInfo(this.state.product.id, item.id)
                    }>
                    <View style={styles.addressInfo}>
                      <Text
                        style={[
                          styles.addressCartText,
                          this.state.selectedDeliveryAddres === item.id
                            ? styles.activeAddressText
                            : null,
                        ]}>
                        {this.state.name}
                      </Text>

                      <Text
                        style={[
                          styles.addressCartText,
                          this.state.selectedDeliveryAddres === item.id
                            ? styles.activeAddressText
                            : null,
                        ]}>
                        {item.address}
                      </Text>
                      <Text
                        style={[
                          styles.addressCartText,
                          this.state.selectedDeliveryAddres === item.id
                            ? styles.activeAddressText
                            : null,
                        ]}>
                        {item.postal_code}
                      </Text>
                    </View>
                  </Button>
                );
              })}
            </ScrollView>
          ) : null}
          <Button
            transparent
            onPress={() =>
              this.setState({
                modalNewAddress: true,
                modalPickUp: false,
                modalDelivery: false,
              })
            }>
            <Text style={styles.modalNewAddresButton}>Enter a new address</Text>
          </Button>
          {this.state.serverDeliveryInfo ? (
            this.state.serverDeliveryInfo.type === 'nationwide_delivery' ? (
              <View style={styles.deliveryInfo}>
                <Text style={styles.serverDeliveryInfoTitle}>
                  {this.state.serverDeliveryInfo.title}
                </Text>
                <View style={styles.serverDeliveryInfoRow}>
                  <Text style={styles.serverDeliveryInfoRowTitle}>Est.</Text>
                  <Text style={styles.serverDeliveryInfoRowText}>
                    {
                      this.state.serverDeliveryInfo.data
                        .nationwide_delivery_time
                    }
                  </Text>
                </View>
                <View style={styles.serverDeliveryInfoRow}>
                  <Text style={styles.serverDeliveryInfoRowTitle}>Cost:</Text>
                  <Text style={styles.serverDeliveryInfoRowText}>
                    {'£' +
                      this.state.serverDeliveryInfo.data.nationwide_cost +
                      '- free for orders over £' +
                      this.state.serverDeliveryInfo.data.nationwide_free_over}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.deliveryInfo}>
                <Text style={styles.serverDeliveryInfoTitle}>
                  {this.state.serverDeliveryInfo.title}
                </Text>
                <View style={styles.serverDeliveryInfoRow}>
                  <Text style={styles.serverDeliveryInfoRowTitle}>Est.</Text>
                  <Text style={styles.serverDeliveryInfoRowText}>
                    {this.state.serverDeliveryInfo.data.local_delivery_time}
                  </Text>
                </View>
                <View style={styles.serverDeliveryInfoRow}>
                  <Text style={styles.serverDeliveryInfoRowTitle}>Cost:</Text>
                  <Text style={styles.serverDeliveryInfoRowText}>
                    {'£' +
                      this.state.serverDeliveryInfo.data.local_cost +
                      '- free for orders over £' +
                      this.state.serverDeliveryInfo.data.local_free_over}
                  </Text>
                </View>
              </View>
            )
          ) : null}
          <Text style={styles.deliveryOptionsTitle}>Available options</Text>
          <ImageBackground
            source={OptionsBG}
            resizeMode={'stretch'}
            style={styles.modalOptionBackground}>
            <View style={styles.pickupOptions}>
              <View style={[styles.pickupOption, { marginLeft: '10%' }]}>
                <Icon
                  name={
                    this.state.serverDeliveryInfo.return_borrow_products === 1
                      ? 'check'
                      : 'close'
                  }
                  type="AntDesign"
                  style={[styles.checkButton, styles.optionText]}
                />
                <Text style={styles.optionText}>
                  Return BorrowCups & BorrowBags
                </Text>
              </View>
              <View style={[styles.pickupOption2, { marginLeft: '10%' }]}>
                <Icon
                  name={
                    this.state.serverDeliveryInfo.pack_in_borrow_bags === 1
                      ? 'check'
                      : 'close'
                  }
                  type="AntDesign"
                  style={[styles.checkButton, styles.optionText]}
                />
                <Text style={styles.optionText}>Packed in BorrowBags</Text>
              </View>
            </View>
          </ImageBackground>
          <Button
            transparent
            onPress={() =>
              this.state.selectedDeliveryAddres
                ? this.setState({
                  buyType: 'delivery',
                  modalVisible: false,
                  modalPickUp: false,
                  modalDelivery: false,
                  modalNewAddress: false,
                  packingOptions: true,
                })
                : null
            }
            style={styles.acceptModalButtonDelivery}>
            <CheckButton />
          </Button>
        </View>
      </View>
    );
  }
  renderPackingOptions() {
    return (
      <View style={styles.packingOptionsContainer}>
        <Text style={styles.packingOptionsTitle}>Options</Text>
        <View style={styles.packingOptionsContent}>
          <Text style={styles.packingOptionsHead}>Choose your packaging *</Text>
          <View style={styles.packingOptions}>
            <Button
              transparent
              style={
                this.state.activePackingOption === 'Own cup'
                  ? styles.packingOptionActive
                  : styles.packingOption
              }
              onPress={() => this.setState({ activePackingOption: 'Own cup' })}>
              <Text
                style={
                  this.state.activePackingOption === 'Own cup'
                    ? styles.packingOptionTextActive
                    : styles.packingOptionText
                }>
                Own cup
              </Text>
              <Text
                style={
                  this.state.activePackingOption === 'Own cup'
                    ? styles.packingOptionGreenActive
                    : styles.packingOptionGreen
                }>
                Green
              </Text>
            </Button>
            <Button
              transparent
              style={
                this.state.activePackingOption === 'BorrowCup'
                  ? styles.packingOptionActive
                  : styles.packingOption
              }
              onPress={() => this.setState({ activePackingOption: 'BorrowCup' })}>
              <Text
                style={
                  this.state.activePackingOption === 'BorrowCup'
                    ? styles.packingOptionTextActive
                    : styles.packingOptionText
                }>
                BorrowCup
              </Text>
              <Text
                style={
                  this.state.activePackingOption === 'BorrowCup'
                    ? styles.packingOptionGreenActive
                    : styles.packingOptionGreen
                }>
                Green
              </Text>
            </Button>
            <Button
              transparent
              style={
                this.state.activePackingOption === 'Single-use'
                  ? styles.packingOptionActive
                  : styles.packingOption
              }
              onPress={() =>
                this.setState({ activePackingOption: 'Single-use' })
              }>
              <Text
                style={
                  this.state.activePackingOption === 'Single-use'
                    ? styles.packingOptionTextActive
                    : styles.packingOptionText
                }>
                Single-use
              </Text>
              <Text
                style={
                  this.state.activePackingOption === 'Single-use'
                    ? styles.packingOptionWasteActive
                    : styles.packingOptionWaste
                }>
                Waste
              </Text>
            </Button>
          </View>
          <Text style={styles.packingOptionsFooterText}>
            BorrowCups are free.
          </Text>
          <View style={styles.packingOptionsFooter}>
            <Text style={styles.packingOptionsFooterText}>
              Return to any participating store within 5 days.
            </Text>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('Terms')}>
              <Text style={styles.packingOptionsFooterLink}>Read Terms</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
  renderNewAddressModal() {
    return (
      <View style={styles.newAddressContainer}>
        <Text style={styles.newAddressTitle}>Enter address</Text>
        <TextInput
          style={styles.modalTextInput}
          onChangeText={(text) => this.setState({ newAddress: text })}
          value={this.state.newAddress}
          placeholder={'enter address'}
        />
        <TextInput
          style={styles.modalTextInput}
          onChangeText={(text) => this.setState({ newAddressPostalCode: text })}
          value={this.state.newAddressPostalCode}
          placeholder={'enter postal code'}
        />
        <Button
          transparent
          onPress={() =>
            this.saveAdderss(
              this.state.newAddress,
              this.state.newAddressPostalCode,
            )
          }>
          <Text style={styles.modalNewAddresButton}>Save address</Text>
        </Button>
      </View>
    );
  }
  render() {
    const { name, description, sections, options } = this.state.product;
    const { pickup } = this.state.fulfillment;
    return this.state.isLoading ? (
      <Loader />
    ) : (
      <View style={styles.productContainer}>
        <ScrollView>
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
            {this.state.images ? (
              <SliderBox
                images={[...this.state.images]}
                dotColor={'#fff'}
                resizeMethod={'resize'}
                resizeMode={'cover'}
                autoplay={true}
                circleLoop
                style={styles.sliderImages}
                imageLoadingColor="#2196F3"
              />
            ) : null}
          </View>
          <View style={styles.productInfo}>
            <View style={styles.infoRowOne}>
              <View>
                <Text style={styles.productTitle}>{name}</Text>
                <Text style={styles.productSubTitle}>{description}</Text>
              </View>
              <View>
                <Text style={styles.productPrice}>
                  £{this.state.finallPrice}
                </Text>
              </View>
            </View>
            {sections
              ? sections.map((item, idx) => (
                <View style={styles.rowInfo} key={idx}>
                  <Text style={styles.infoTitle}>{item.title}</Text>
                  <Text style={styles.infoSubTitle}>{item.description}</Text>
                </View>
              ))
              : null}
          </View>

          {this.state.borrowPartnerCup ? (
            <View>
              <Text style={styles.optionsTitle}>Options</Text>
              <View style={styles.options}>
                {this.state.borrowCop ? (
                  <ImageBackground
                    source={BorrowTrue}
                    resizeMode={'stretch'}
                    style={styles.optionBackgroundTrue}>
                    <View style={styles.BorrowTrueHeading}>
                      <Text style={styles.optionsTitleText}>
                        In a free BorrowCup?
                      </Text>
                      <Button
                        transparent
                        style={styles.borrowCopButtonTrue}
                        onPress={() =>
                          this.setState({
                            borrowCop: !this.state.borrowCop,
                          })
                        }>
                        {this.state.borrowCop ? <SwitchOn /> : <SwitchOff />}
                      </Button>
                    </View>
                    <View style={styles.BorrowTrueHeading}>
                      <Text style={styles.borrowSubtitle}>Pick a combo</Text>
                    </View>
                    <View style={styles.BorrowTrueContent}>
                      <Button
                        onPress={() =>
                          this.setState({ orderType: 'cup_sleeve_lid' })
                        }
                        transparent
                        style={[
                          styles.BorrowTrueSelectButtons,
                          this.state.orderType === 'cup_sleeve_lid'
                            ? styles.typeSelected
                            : null,
                        ]}>
                        <BorrowCupLarge />
                        <Text style={styles.BorrowTrueContentText}>
                          lid + sleeve + cup
                        </Text>
                      </Button>
                      <Button
                        onPress={() => this.setState({ orderType: 'cup_sleeve' })}
                        transparent
                        style={[
                          styles.BorrowTrueSelectButtons,
                          this.state.orderType === 'cup_sleeve'
                            ? styles.typeSelected
                            : null,
                        ]}>
                        <BorrowCupLarge />
                        <Text style={styles.BorrowTrueContentText}>
                          sleeve + cup
                        </Text>
                      </Button>
                      <Button
                        transparent
                        style={[
                          styles.BorrowTrueSelectButtons,
                          this.state.orderType === 'cup'
                            ? styles.typeSelected
                            : null,
                        ]}
                        onPress={() => this.setState({ orderType: 'cup' })}>
                        <EmptyGlass
                          width={_defz.width / 7}
                          height={_defz.height / 8}
                        />
                        <Text style={styles.BorrowTrueContentText}>
                          cup only
                        </Text>
                      </Button>
                    </View>
                    <View style={styles.optionsTip}>
                      <Text style={styles.optionsTipText1}>
                        5-days to return to any partner store
                      </Text>
                      <Text
                        style={styles.optionsTipText2}
                        onPress={() => this.props.navigation.navigate('Terms')}>
                        see terms
                      </Text>
                    </View>
                  </ImageBackground>
                ) : (
                  <ImageBackground
                    source={OptionsBG}
                    resizeMode={'stretch'}
                    style={styles.optionBackgroundFalse}>
                    <Text style={styles.optionsTitleText}>
                      In a free BorrowCup?
                    </Text>
                    <BorrowCupSmall />
                    <Button
                      transparent
                      style={styles.borrowCopButtonFalse}
                      onPress={() =>
                        this.setState({
                          borrowCop: !this.state.borrowCop,
                        })
                      }>
                      {this.state.borrowCop ? <SwitchOn /> : <SwitchOff />}
                    </Button>
                  </ImageBackground>
                )}
              </View>
            </View>
          ) : null}

          {/* render packing options */}
          {/* {this.state.packingOptions ? this.renderPackingOptions() : null} */}

          {/* render options */}
          {options
            ? options.map((item, idx) => {
              radio_props = [];
              return (
                <View key={idx}>
                  <Text style={styles.optionsTitle}>{item.title}</Text>
                  {item.values.map((item, i) => {
                    return (
                      <View style={styles.optionItem}>
                        <Text style={styles.optionItemLabel}>{item.name} {item.price}</Text>
                        <BedmalCheckBox
                          key={i}
                          size={24}
                          value={this.state.optionItem.index === i ? this.state.optionItem.selection : false}
                          onChange={(value) => {
                            if(value) {
                              this.setState({optionItem: {index: i, selection: value}});
                              this.setState({
                                finallPrice:
                                  parseFloat(price) + parseFloat(item.price),
                              });
                            } else {
                              this.setState({optionItem: {index: i, selection: value}});
                              this.setState({
                                finallPrice:
                                  this.state.finallPrice - parseFloat(item.price),
                              });
                            }
                          }}
                        />
                      </View>
                    )
                  })}
                  <View style={styles.optionSize}>
                    <View style={styles.radioButtons}>
                      {item.values.forEach((val) => {
                        radio_props.push({
                          label: val.name,
                          value: val.price,
                        });
                      })}
                    </View>
                  </View>
                </View>
              );
            })
            : null}

          <View style={{ marginTop: 120 }} />
        </ScrollView>
        {(!this.state.modalQuantity || !this.state.modalVisible) && this.renderFooter()}
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalQuantity}
            onRequestClose={() => {
              this.setState({ modalQuantity: false });
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Quantity</Text>
                <TextInput
                  autoFocus
                  keyboardAppearance
                  style={styles.modalInput}
                  keyboardType={'number-pad'}
                  value={this.state.tempQ ? String(this.state.tempQ) : ''}
                  onChangeText={(val) => this.setState({tempQ: Number(val)})}/>
                <Button
                  transparent
                  onPress={() =>
                    this.setState({
                      quantity: this.state.tempQ !== 0 ? this.state.tempQ : this.state.quantity,
                      modalQuantity: false
                    })
                  }
                  style={styles.acceptModalButton}>
                  <CheckButton />
                </Button>
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({ modalVisible: false });
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {this.state.modalPickUp || this.state.modalDelivery ? null : (
                  <Text style={styles.modalTitle}>Choose fulfilment</Text>
                )}
                <View style={styles.modalButtons}>
                  {pickup ? (
                    <Button
                      transparent
                      onPress={() =>
                        this.setState({
                          modalPickUp: true,
                          modalDelivery: false,
                          modalNewAddress: false,
                        })
                      }
                      style={[
                        styles.modalButton,
                        this.state.modalPickUp ? styles.activeButton : null,
                      ]}>
                      <Text
                        style={
                          this.state.modalPickUp
                            ? styles.activeText
                            : styles.modalButtonText
                        }>
                        Pick Up
                      </Text>
                    </Button>
                  ) : null}
                  <Button
                    transparent
                    onPress={() =>
                      this.setState({
                        modalDelivery: true,
                        modalPickUp: false,
                        modalNewAddress: false,
                      })
                    }
                    style={[
                      styles.modalButton,
                      this.state.modalDelivery ? styles.activeButton : null,
                    ]}>
                    <Text
                      style={
                        this.state.modalDelivery
                          ? styles.activeText
                          : styles.modalButtonText
                      }>
                      Delivery
                    </Text>
                  </Button>
                </View>
                {/* Render PickUp modal info */}
                {this.state.modalPickUp ? (
                  this.state.fulfillment ? (
                    <View style={{ width: '100%' }}>
                      {pickup ? this.renderPickUpModal() : null}
                    </View>
                  ) : null
                ) : null}
                {/* Render Delivery modal info */}
                {this.state.modalDelivery
                  ? this.state.fulfillment
                    ? this.renderDeliveryModal()
                    : null
                  : null}
                {this.state.modalNewAddress
                  ? this.renderNewAddressModal()
                  : null}
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.addedToBagModalVisible}
            onRequestClose={() => {
              this.setState({ addedToBagModalVisible: false });
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalViewBag}>
                <Image source={AddedToBag} />
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  token: selectUserToken(state),
  bag: selectBagItems(state),
});

const mapDispatchToProps = (dispatch) => ({
  addToBag: (item) => dispatch(addToBag(item)),
  clearBag: () => dispatch(clearBag()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
