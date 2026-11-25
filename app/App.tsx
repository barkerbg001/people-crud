import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { addPerson, deletePerson, getPeople, Person } from './src/HttpClient';

const messageOf = (e: unknown) =>
  e instanceof Error ? e.message : 'Something went wrong';

const initialsOf = (name: string, surname: string) =>
  `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

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
    } catch (e) {
      setError(messageOf(e));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedSurname = surname.trim();
    const parsedAge = Number(age);

    if (!trimmedName || !trimmedSurname || !age) {
      setError('Fill in name, surname, and age.');
      return;
    }
    if (!Number.isInteger(parsedAge) || parsedAge < 0 || parsedAge > 130) {
      setError('Enter an age from 0 to 130.');
      return;
    }

    setError('');
    try {
      await addPerson({ name: trimmedName, surname: trimmedSurname, age: parsedAge });
      setName('');
      setSurname('');
      setAge('');
      await load();
    } catch (e) {
      setError(messageOf(e));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePerson(id);
      await load();
    } catch (e) {
      setError(messageOf(e));
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.column}>
        <Text style={styles.eyebrow}>Directory</Text>
        <Text style={styles.title}>People</Text>
        <Text style={styles.subtitle}>Add someone, then remove them when you are done.</Text>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Ada"
              placeholderTextColor="#a8a29e"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Surname</Text>
            <TextInput
              style={styles.input}
              placeholder="Lovelace"
              placeholderTextColor="#a8a29e"
              value={surname}
              onChangeText={setSurname}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="36"
              placeholderTextColor="#a8a29e"
              keyboardType="number-pad"
              inputMode="numeric"
              value={age}
              onChangeText={(value) => setAge(value.replace(/[^\d]/g, ''))}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            style={({ pressed }) => [styles.submit, pressed && styles.submitPressed]}
            onPress={handleSubmit}
            accessibilityRole="button"
          >
            <Text style={styles.submitText}>Add person</Text>
          </Pressable>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.section}>Everyone</Text>
          <Text style={styles.count}>
            {people.length === 1 ? '1 person' : `${people.length} people`}
          </Text>
        </View>

        {people.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No one here yet</Text>
            <Text style={styles.emptyBody}>People you add will show up in this list.</Text>
          </View>
        ) : (
          <View style={styles.people}>
            {people.map((item) => (
              <View key={item.id} style={styles.person}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initialsOf(item.name, item.surname)}</Text>
                </View>
                <View style={styles.personBody}>
                  <Text style={styles.personName}>
                    {item.name} {item.surname}
                  </Text>
                  <Text style={styles.personMeta}>Age {item.age}</Text>
                </View>
                <Pressable
                  onPress={() => handleDelete(item.id)}
                  style={({ pressed }) => [styles.remove, pressed && styles.removePressed]}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.name} ${item.surname}`}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f4f1',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  column: {
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  eyebrow: {
    color: '#0f766e',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 4,
    color: '#1c1917',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    color: '#78716c',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    padding: 16,
    gap: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    color: '#44403c',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#d6d3d1',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1c1917',
    backgroundColor: '#fafaf9',
  },
  error: {
    color: '#b91c1c',
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  submit: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#0f766e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitPressed: {
    backgroundColor: '#115e59',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  listHeader: {
    marginTop: 24,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  section: {
    color: '#1c1917',
    fontSize: 18,
    fontWeight: '700',
  },
  count: {
    color: '#78716c',
    fontSize: 13,
  },
  people: {
    gap: 8,
  },
  empty: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderStyle: 'dashed',
    backgroundColor: '#fff',
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#1c1917',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyBody: {
    marginTop: 4,
    color: '#78716c',
    fontSize: 14,
    textAlign: 'center',
  },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#0f766e',
    fontSize: 14,
    fontWeight: '700',
  },
  personBody: {
    flex: 1,
  },
  personName: {
    color: '#1c1917',
    fontSize: 16,
    fontWeight: '600',
  },
  personMeta: {
    marginTop: 2,
    color: '#78716c',
    fontSize: 13,
  },
  remove: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removePressed: {
    backgroundColor: '#fef2f2',
  },
  removeText: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '600',
  },
});
