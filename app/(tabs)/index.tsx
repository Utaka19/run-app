import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Run = {
  id: string;
  distance: string;
  date: string;
};

export default function Index() {
  const [distance, setDistance] = useState("");
  const [runs, setRuns] = useState<Run[]>([]);
  const isFirstLoad = useRef(true);

  const addRun = () => {
    if (!distance) return;
    if (isNaN(Number(distance))) return;

    const newRun: Run = {
      id: Date.now().toString(),
      distance,
      date: new Date().toLocaleDateString(),
    };

    setRuns([newRun, ...runs]);
    setDistance("");
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    console.log("保存:", runs);

    const saveRuns = async () => {
      try {
        await AsyncStorage.setItem("runs", JSON.stringify(runs));
      } catch (e) {
        console.log(e);
      }
    };

    saveRuns();
  }, [runs]);

  useEffect(() => {
    const loadRuns = async () => {
      try {
        const data = await AsyncStorage.getItem("runs");
        console.log("読み込み:", data);
        if (data !== null) {
          setRuns(JSON.parse(data));
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadRuns();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏃‍♂️ Run Log</Text>

      <TextInput
        style={styles.input}
        placeholder="距離 (km)"
        value={distance}
        onChangeText={setDistance}
        keyboardType="numeric"
      />

      <Button title="保存" onPress={addRun} />

      {runs.length === 0 && <Text>まだ記録がありません</Text>}

      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={{ color: "white" }}>{item.date}</Text>
            <Text style={{ color: "white" }}>
              {Number(item.distance).toFixed(1)} km
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "white",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    color: "white",
    borderColor: "gray",
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "gray",
  },
});
