import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Switch,
  UIManager,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BubbleList from "./src/components/BubbleList";
import MessagesList from "./src/components/MessagesList";

export interface Data {
  name: string;
  id: string;
  image: string;
}

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [type, setType] = useState<"initial" | "messages">("initial");
  const enabled = type === "initial";

  const _onChange = useCallback(() => {
    setType(type === "initial" ? "messages" : "initial");
  }, [type]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30}
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <SafeAreaView flex={1}>
          <StatusBar
            style={Platform.OS === "android" ? "dark" : "auto"}
            backgroundColor="#fff"
            translucent={false}
          />
          <View style={styles.container}>
            {type === "initial" && <BubbleList />}
            {type === "messages" && <MessagesList />}
            <View style={styles.switcher}>
              <Switch value={enabled} onValueChange={_onChange} />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  switcher: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0, 0, 0, .1)",
    shadowColor: "#222",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
  },
});
