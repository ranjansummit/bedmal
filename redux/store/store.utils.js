/* eslint-disable prettier/prettier */
import { jsonBeautify } from 'beautify-json';
const bagItemFinder = (bag, itemToFind) => {
  try {
    let returnBody = {
      exist: false,
      bagIndex: null,
      proIndex: null,
    };
    bag.forEach((item, index) => {
      if (item.vendorID === itemToFind.vendorID) {
        if (item.buyType === itemToFind.buyType && item.buyType === 'Pick Up') {
          item.products.forEach((pro, proIndex) => {
            if (pro.orderType === itemToFind.products[0].orderType) {
              if (pro.packing === itemToFind.products[0].packing) {
                if (pro.selectedOption.label === itemToFind.products[0].selectedOption.label) {
                  returnBody.exist = true;
                  returnBody.bagIndex = index;
                  returnBody.proIndex = proIndex;
                } else {
                  returnBody.exist = false;
                  returnBody.bagIndex = index;
                  returnBody.proIndex = proIndex;
                }
              } else {
                returnBody.exist = false;
                returnBody.bagIndex = index;
                returnBody.proIndex = proIndex;
              }
            } else {
              returnBody.exist = false;
              returnBody.bagIndex = index;
              returnBody.proIndex = proIndex;
            }
          });
        }
        if (item.buyType === itemToFind.buyType && item.buyType === 'delivery') {
          if (item.addressID === itemToFind.addressID) {
            item.products.forEach((pro, proIndex) => {
              if (pro.orderType === itemToFind.products[0].orderType) {
                if (pro.packing === itemToFind.products[0].packing) {
                  if (
                    pro.selectedOption.label ===
                    itemToFind.products[0].selectedOption.label
                  ) {
                    returnBody.exist = true;
                    returnBody.bagIndex = index;
                    returnBody.proIndex = proIndex;
                  } else {
                    returnBody.exist = false;
                    returnBody.bagIndex = index;
                    returnBody.proIndex = proIndex;
                  }
                } else {
                  returnBody.exist = false;
                  returnBody.bagIndex = index;
                  returnBody.proIndex = proIndex;
                }
              } else {
                returnBody.exist = false;
                returnBody.bagIndex = index;
                returnBody.proIndex = proIndex;
              }
            });
          }
        }
      }
    });
    return returnBody;
  } catch (error) {
    alert(error);
  }
};

export const addItemToBag = (state, itemToAdd) => {
  try {
    let newBag = [];
    if (state.bag.length) {
      newBag = [...state.bag];
      const existingItem = bagItemFinder(newBag, itemToAdd);
      console.log(existingItem);
      if (existingItem.exist && existingItem.bagIndex !== null && existingItem.proIndex !== null) {
        newBag[existingItem.bagIndex].products[existingItem.proIndex].quantity += parseFloat(itemToAdd.products[0].quantity);
      } else if (!existingItem.exist && existingItem.bagIndex !== null) {
        newBag[existingItem.bagIndex].products.push(itemToAdd.products[0]);
      } else if (!existingItem.exist && existingItem.bagIndex !== null && existingItem.proIndex !== null) {
        newBag[existingItem.bagIndex].products[existingItem.proIndex].push(itemToAdd.products[0]);
      } else {
        newBag.push(itemToAdd);
      }
      return newBag;
    } else {
      newBag = [...state.bag];
      newBag.push(itemToAdd);
      return newBag;
    }
  } catch (error) {
    alert(error);
  }

};

export const quantityUp = (state, indexes) => {
  try {
    let newBag = [...state.bag];

    newBag[indexes.bagIndex].products[indexes.productIndex].quantity += parseFloat(1);
    return newBag;
  } catch (error) {
    alert(error)
  }

};

export const quantityDown = (state, indexes) => {
  try {
    let newBag = [...state.bag];

    if (newBag[indexes.bagIndex].products[indexes.productIndex].quantity === 1) {
      newBag[indexes.bagIndex].products.splice(indexes.productIndex, 1);
      if (newBag[indexes.bagIndex].products.length === 0) {
        newBag.splice(indexes.bagIndex, 1);
      }
    } else {
      newBag[indexes.bagIndex].products[indexes.productIndex].quantity -= parseFloat(1);
    }

    return newBag;
  } catch (error) {
    alert(error)
  }

};

export const deleteBag = (state, index) => {
  try {
    let newBag = [...state.bag];
    newBag.splice(index, 1);
    return newBag;
  } catch (error) {
    alert(error);
  }

};