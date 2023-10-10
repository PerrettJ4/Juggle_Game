import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GameEngine } from "react-native-game-engine";
import Matter from 'matter-js';
import Foot from './components/Foot';
import Ball from './components/Ball';

export default function App() {
 
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Ball/>
      <Foot/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: 'grey'
  },
});
