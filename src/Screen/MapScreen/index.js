/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {getDistance} from 'geolib';
import {createStaticNavigation, useNavigation} from '@react-navigation/native';
import {Modal, Portal, Text, PaperProvider} from 'react-native-paper';

export default function MapScreen({route}) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isChoosingSource, setIsChoosingSource] = useState(false);
  const [isChoosingDestination, setIsChoosingDestination] = useState(false);
  const mapRef = useRef(null);

  const [selectedId, setSelectedId] = useState();
  const [listData, setListData] = useState([]);
  const count = useRef(null);
  const navigation = useNavigation();

  const [visible, setVisible] = React.useState(false);

  const [nameLocation, onChangeName] = React.useState('');
  const [address, onChangeAddress] = React.useState('');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};
  //   const navigation = useNavigation();
  useEffect(() => {
    if (count.current == null) {
      fetchData();
    }
    return () => {
      count.current = 1;
    };
  }, []);

  const fetchData = async () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch('https://pinlocation.aldiandev.com/api/location', requestOptions)
      .then(response => response.text())
      .then(result => {
        let res = JSON.parse(result);

        if (res.status) {
          var list = [];
          for (let i = 0; i < res.data.length; i++) {
            list.push({
              id: res.data[i].id,
              name_location: res.data[i].name_location,
              address: res.data[i].address,
              location: res.data[i].location,
              latitude: res.data[i].latitude,
              longitude: res.data[i].longitude,
            });
          }
          setListData(list);
        }
      })
      .catch(error => console.error(error));
  };

  const defaultLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLoading(false);
      },
      error => {
        Alert.alert(
          'Error',
          `Failed to get your location: ${error.message}` +
            ' Make sure your location is enabled.',
        );
        setLocation(defaultLocation);
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            Alert.alert(
              'Permission Denied',
              'Location permission is required to show your current location on the map.',
            );
            setLocation(defaultLocation);
            setLoading(false);
          }
        } catch (err) {
          console.warn(err);
          setLocation(defaultLocation);
          setLoading(false);
        }
      } else {
        getCurrentLocation();
      }
    };

    requestLocationPermission();
  }, [route]);

  const handleMapPress = e => {
    const coordinate = e.nativeEvent.coordinate;
    console.log(e.nativeEvent);
    if (isChoosingSource) {
      setSource(coordinate);
      setIsChoosingSource(false);
      // console.log(coordinate);
    } else if (isChoosingDestination) {
      setDestination(coordinate);
      setIsChoosingDestination(false);
    }
  };

  const removeSource = () => {
    setSource(null);
  };

  const zoomToMarker = marker => {
    if (mapRef.current && marker) {
      mapRef.current.animateToRegion({
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const simpanData = () => {
    const requestOptions = {
      method: 'POST',
      redirect: 'follow',
    };

    if (!nameLocation) {
      alert('Mohon Masukkan Nama Lokasi');
      return;
    }

    if (!address) {
      alert('Mohon Masukkan Alamat');
      return;
    }

    if (nameLocation && address) {
      fetch(
        'http://pinlocation.aldiandev.com/api/location?name_location=' +
          nameLocation +
          '&address=' +
          address +
          '&latitude=' +
          source.latitude +
          '&longitude=' +
          source.longitude,
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          let res = JSON.parse(result);

          if (res.status) {
            setVisible(false);
            onChangeAddress('');
            onChangeName('');
            setSource(null);
            onRefresh();
          }
        })
        .catch(error => console.error(error));
    }
  };

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    fetchData();
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <MapView
              ref={mapRef}
              style={styles.map}
              showsUserLocation={true}
              region={location}
              onPress={handleMapPress}>
              {/* Render default markers */}
              {/* <Marker coordinate={location} /> */}
              {/* Render main markers */}
              {source && (
                <Marker
                  coordinate={source}
                  title={'Source'}
                  description={'Your source location'}
                  pinColor={'green'}
                  onPress={() => zoomToMarker(source)}
                />
              )}

              {listData.map(data => {
                return (
                  <Marker
                    coordinate={{
                      latitude: data.latitude,
                      longitude: data.longitude,
                    }}
                    title={data.name_location}
                  />
                );
              })}
            </MapView>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonGroup}>
                {source ? (
                  <Button title="Hapus Pilihan" onPress={removeSource} />
                ) : (
                  <Button
                    title={isChoosingSource ? 'Pilih Lokasi' : 'Tambah Mark'}
                    onPress={() => setIsChoosingSource(true)}
                  />
                )}
              </View>
              {source ? (
                <Button title="Add Location" onPress={showModal} />
              ) : (
                <View></View>
              )}
            </View>
          </>
        )}
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            value={nameLocation}
            placeholder="Input Nama Lokasi"
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangeAddress}
            value={address}
            placeholder="Input Alamat"
          />
          <View>
            <Text></Text>
          </View>
          <TouchableOpacity
            style={[styles.item]}
            onPress={() => {
              // hapusData(item.id);
              simpanData();
            }}>
            <View style={[styles.buttonSimpan]}>
              <Text style={[styles.title]}>Simpan</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',

    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonSimpan: {
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    backgroundColor: 'red',
  },
});
