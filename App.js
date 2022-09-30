import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('coursedb.db');

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppingList (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppingList (product, amount) values (?, ?);', [product, amount]);
    }, null, updateList
    )
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql('delete from shoppingList where id = ?;', [id]);
      }, null, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppingList;', [], (_, { rows }) =>
        setShoppingList(rows._array)
      );
    });
  }

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.textInput}
        placeholder='Product'
        onChangeText={(product) => setProduct(product)}
        value={product}
      />

      <TextInput
        style={styles.textInput}
        placeholder='Amount'
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />

      <Button
        title='Save'
        onPress={saveItem}
      />

      <Text style={styles.text}>
        Shopping list
      </Text>

      <FlatList
        data={shoppingList}
        renderItem={({ item }) =>
          <View style={styles.listContainer}>
            <Text style={styles.listText}>{item.product}, {item.amount}</Text>
            <Text style={styles.listDelete} onPress={() => deleteItem(item.id)}> bought</Text>
          </View>
        }
        keyExtractor={item => item.id.toString()}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },

  textInput: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 5,
  },

  text: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 10
  },

  listText: {
    fontSize: 15
  },

  listDelete: {
    fontSize: 15,
    color: 'blue'
  },

  listContainer: {
    flexDirection: 'row',
    marginBottom: 5
  },

});
