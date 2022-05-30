import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import IconCheckFull from '../../asset/svg/ic-check-full.svg';
import IconCheckEmpty from '../../asset/svg/ic-check-empty.svg';

const BedmalCheckBox = ({onChange, size, value}) => {
  const [checked, setCheck] = useState(value);
  const toggle = useCallback((val) => {
    setCheck(val);
    onChange(val)
  },[value]);

  useEffect(() => {
    setCheck(value);
  }, [value])

  return(
    <TouchableOpacity style={{width: size, height: size}} onPress={() => toggle(!checked)}>
      {checked ? (
        <IconCheckFull width="100%" height="100%" />
      ) : (
        <IconCheckEmpty width="100%" height="100%" />
      )}
    </TouchableOpacity>
  )
}

export default BedmalCheckBox;