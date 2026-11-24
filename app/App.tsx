import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { addPerson, deletePerson, getPeople, Person } from './src/HttpClient';

export default function App() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setPeople(await getPeople());
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!name || !surname || !age) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await addPerson({ name, surname, age: Number(age) });
      setName('');
      setSurname('');
      setAge('');
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePerson(id);
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>Name:</Text>
        <TextInput placeholder="Enter your name" style={styles.input} value={name} onChangeText={setName} />
      </View>
      <View style={styles.inputContainer}>
        <Text>Surname:</Text>
        <TextInput placeholder="Enter your surname" style={styles.input} value={surname} onChangeText={setSurname} />
      </View>
      <View style={styles.inputContainer}>
        <Text>Age:</Text>
        <TextInput placeholder="Enter your age" keyboardType="numeric" value={age} onChangeText={setAge} style={styles.input} />
      </View>
      <Button title="Submit" onPress={handleSubmit} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        style={styles.list}
        data={people}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No people yet</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.name} {item.surname} ({item.age})</Text>
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', paddingTop: 80 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, width: '60%', paddingHorizontal: 10, marginTop: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '80%' },
  error: { color: 'red', marginTop: 10 },
  list: { width: '80%', marginTop: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
});
