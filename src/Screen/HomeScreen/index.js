/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Button} from 'react-native-paper';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {createStaticNavigation, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Item = ({title, item, onPress, backgroundColor, textColor, action}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, {backgroundColor}]}>
      <Text style={[styles.title, {color: textColor}]}>Edit</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={action} style={[styles.item, {backgroundColor}]}>
      <Text style={[styles.title, {color: textColor}]}>Hapus</Text>
    </TouchableOpacity>
  </View>
);

const HomeScreen = () => {
  const [listData, setListData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const count = useRef(null);
  const navigation = useNavigation();

  const [jumlahData, setJumlahData] = useState();
  //   const navigation = useNavigation();
  useEffect(() => {
    if (count.current == null) {
      fetchData();
    }
    return () => {
      count.current = 1;
    };
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
            });
          }

          console.log(list);
          setListData(list);
          setJumlahData(res.data.length);
        }
      })
      .catch(error => console.error(error));
  };

  const hapusData = id => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };
    fetch(
      'https://pinlocation.aldiandev.com/api/location/' + id,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        let res = JSON.parse(result);
        if (res.status) {
          alert('Data Berhasil Dihapus');
          fetchData();
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text style={styles.title}>MARK LOCATION</Text>

          <FlatList
            data={listData}
            renderItem={({item}) => (
              <>
                <View style={styles.item}>
                  <Text style={styles.name_location}>{item.name_location}</Text>
                  <Text style={styles.address}>{item.address}</Text>
                  <View style={styles.action}>
                    <TouchableOpacity
                      style={[styles.item]}
                      onPress={() => {
                        navigation.navigate('EntryMapScreen', {
                          itemId: item.id,
                        });
                      }}>
                      <Text style={[styles.button]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.item]}
                      onPress={() => {
                        hapusData(item.id);
                      }}>
                      <Text style={[styles.button]}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
            keyExtractor={item => item.id}
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
  },
  button: {
    fontSize: 20,
  },
  name_location: {
    fontSize: 25,
  },
  action: {
    flexDirection: 'row',
  },
  address: {
    fontSize: 15,
  },
});

export default HomeScreen;
