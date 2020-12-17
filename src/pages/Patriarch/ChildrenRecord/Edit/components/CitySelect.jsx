// 城市三级联动选择
import { Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { getCommonRegion } from '@/services/common';

const { Option } = Select;

const CitySelect = ({ value = {}, onChange }) => {
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [areaList, setAreaList] = useState([]);

  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [place, setPlace] = useState('');

  const queryCommonRegion = async (type, code) => {
    const res = await getCommonRegion({ parentCode: code });
    switch (type) {
      case 2:
        setCityList(res);
        break;
      case 3:
        setAreaList(res);
        break;
      default:
        setProvinceList(res);
    }
  };

  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({ province, city, area, place, ...value, ...changedValue });
    }
  };

  const onProvinceChange = (code, noClear) => {
    if (noClear) {
      triggerChange({ province: code });
    } else {
      triggerChange({ province: code, city: '', area: '' });
    }
    queryCommonRegion(2, code);
  };
  const onCityChange = (code, noClear) => {
    triggerChange({ city: code });
    if (noClear) {
      triggerChange({ city: code });
    } else {
      triggerChange({ city: code, area: '' });
    }
    queryCommonRegion(3, code);
  };
  const onAreaChange = (code) => {
    triggerChange({ area: code });
  };
  const onPlaceChange = (e) => {
    triggerChange({ place: e.target.value });
  };

  useEffect(() => {
    queryCommonRegion();
  }, []);

  // 修改的时候赋值
  useEffect(() => {
    if (value.province) {
      onProvinceChange(value.province, true);
    }
    if (value.city) {
      onCityChange(value.city, true);
    }
  }, [value.province, value.city]);

  return (
    <div style={{ display: 'flex' }}>
      <Select
        value={value.province || province}
        onChange={(id) => onProvinceChange(id, false)}
        className="select"
        placeholder="请选择省"
      >
        {provinceList.map((item) => (
          <Option key={item.code} value={item.code}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Select
        value={value.city || city}
        onChange={(id) => onCityChange(id, false)}
        className="select"
        placeholder="请选择市"
      >
        {cityList.map((item) => (
          <Option key={item.code} value={item.code}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Select
        value={value.area || area}
        onChange={onAreaChange}
        className="select"
        placeholder="请选择区"
      >
        {areaList.map((item) => (
          <Option key={item.code} value={item.code}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Input
        value={value.place}
        onChange={onPlaceChange}
        placeholder="请输入详细地址"
      />
    </div>
  );
};

export default CitySelect;
