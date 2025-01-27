/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Button, Checkbox} from 'react-native-paper';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const EntryMapScreen = route => {
  const [nameLocation, onChangeName] = React.useState('');
  const [address, onChangeAddress] = React.useState('');
  const [latitude, setLatitude] = React.useState();
  const [longitude, setLongitude] = React.useState();

  const [checked, setChecked] = React.useState(false);

  const [idData, setIdData] = React.useState('');
  const count = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (count.current == null) {
      getData();
    }
    return () => {
      count.current = 1;
    };
  }, []);

  const getData = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      'http://pinlocation.aldiandev.com/api/location/' +
        route.route.params.itemId,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        let res = JSON.parse(result);
        onChangeName(res.data.name_location);
        onChangeAddress(res.data.address);
        setLatitude(res.data.latitude);
        setLongitude(res.data.longitude);
        setIdData(res.data.id);
      })
      .catch(error => console.error(error));
  };

  const updateData = () => {
    const requestOptions = {
      method: 'PUT',
      redirect: 'follow',
    };
    fetch(
      'http://pinlocation.aldiandev.com/api/location/' +
        idData +
        '?name_location=' +
        nameLocation +
        '&address=' +
        address +
        '&latitude=' +
        latitude +
        '&longitude=' +
        longitude,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        let res = JSON.parse(result);
        if (res.status) {
          Alert.alert('Data Berhasil Diupadate');
        }
        console.log(res);
      })
      .catch(error => console.error(error));
  };

  return (
    <View>
      <Text></Text>
      <Text>Nama Lokasi</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={nameLocation}
        placeholder="Input Nama Lokasi"
      />
      <Text>Alamat</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeAddress}
        value={address}
        placeholder="Input Alamat"
      />
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked(!checked);
        }}
      />

      <TouchableOpacity
        onPress={() => {
          updateData();
        }}>
        <Button>Ubah Data</Button>
      </TouchableOpacity>
    </View>
  );
};

export default EntryMapScreen;

const styles = StyleSheet.create({});
