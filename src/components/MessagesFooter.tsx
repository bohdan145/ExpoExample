import React, { memo, useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const MessagesFooter: React.FC<{
  onPress: (msg?: string, imgUrl?: string) => void;
}> = ({ onPress = () => null }) => {
  const [msg, setMsg] = useState("");

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        selectionLimit: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        const [img] = result.assets;
        onPress("", img.uri);
      }
    } catch (error) {
      console.log("Image Picker message: ", error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={pickImage}
        style={{
          marginRight: 10,
          paddingBottom: 8,
        }}
      >
        <FontAwesome5 name="images" size={24} color="#888" />
      </TouchableOpacity>
      <View flex={1} marginRight={10}>
        <TextInput
          multiline
          defaultValue={msg}
          onChangeText={setMsg}
          placeholder="Send messsage..."
          style={styles.input}
        />
      </View>
      <TouchableOpacity
        disabled={!msg.length}
        style={{
          padding: 10,
          borderRadius: 70,
          backgroundColor: "#f5d86e",
          ...(msg.length && {
            shadowColor: "#f5d86e",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.7,
            shadowRadius: 7,
          }),
        }}
        onPress={() => {
          setMsg("");
          onPress(msg);
        }}
      >
        <FontAwesome name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default memo(MessagesFooter);

const styles = StyleSheet.create({
  wrapper: {
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0, 0, 0, .1)",
  },
  input: {
    width: "100%",
    backgroundColor: "#eee",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    fontSize: 16,
    lineHeight: 19,
  },
});
