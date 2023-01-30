import { ResizeMode, Video } from "expo-av";
import React, { memo, useLayoutEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import AnimatedImage from "./AnimatedImage";

import { Data } from "./MessagesList";

const MessageItem: React.FC<{ item: Data; index?: number }> = ({
  item,
  index,
}) => {
  const animated = useRef(new Animated.Value(0)).current;
  const { isAuthor } = item;
  const setKey = () => (Platform.OS === "android" ? {} : { key: item.id });

  useLayoutEffect(() => {
    animated.setValue(0);
    Animated.spring(animated, {
      toValue: 1,
      useNativeDriver: true,
      mass: 0.9,
    }).start();
  }, [item.id]);

  const animatedStyles = useMemo(
    () => ({
      opacity: animated,
      transform: [
        {
          translateY: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          }),
        },
        // {
        //   scale: animated.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: [0.85, 1],
        //   }),
        // },
      ],
    }),
    []
  );

  if (item.image?.length || item.video?.length) {
    return (
      <Animated.View style={animatedStyles}>
        <View style={styles.row(isAuthor)}>
          <View style={styles.avatarWrapper(isAuthor)}>
            <AnimatedImage uri={item.user.avatar} style={styles.avatar} />
          </View>
          <View>
            <View paddingHorizontal={10} paddingBottom={3}>
              <Text style={styles.name(isAuthor)}>{item.user.name}</Text>
            </View>
            {item.image?.length ? (
              <View style={styles.media}>
                <AnimatedImage
                  uri={item.image}
                  style={styles.media}
                  {...setKey()}
                />
              </View>
            ) : (
              <Video
                style={styles.media}
                source={{ uri: item.video as string }}
                useNativeControls
                isLooping
                volume={1.0}
                resizeMode={ResizeMode.COVER}
                positionMillis={1000}
              />
            )}
            <View paddingHorizontal={10} paddingTop={3}>
              <Text style={styles.date(isAuthor)}>{item.date}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animatedStyles}>
      <View style={styles.row(isAuthor)}>
        <View style={styles.avatarWrapper(isAuthor)}>
          <AnimatedImage uri={item.user.avatar} style={styles.avatar} />
        </View>
        <View maxWidth="80%">
          <View paddingHorizontal={10} paddingBottom={3}>
            <Text style={styles.name(isAuthor)}>{item.user.name}</Text>
          </View>
          <View style={styles.msgContainer(isAuthor)}>
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.date(isAuthor)}>{item.date}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default memo(MessageItem);

const styles = StyleSheet.create<any>({
  row: (isAuthor: boolean) => ({
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignSelf: isAuthor ? "flex-end" : "flex-start",
    flexDirection: isAuthor ? "row-reverse" : "row",
  }),
  text: {
    fontSize: 16,
    color: "#222",
  },
  avatarWrapper: (isAuthor: boolean) => ({
    top: 10,
    zIndex: 5,
    borderRadius: 38,
    shadowColor: "#222",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    ...(isAuthor
      ? {
          marginLeft: -15,
        }
      : { marginRight: -15 }),
  }),
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 38,
    backgroundColor: "#eee",
    borderWidth: 2,
    borderColor: "#fff",
  },
  date: (isAuthor: boolean) => ({
    fontSize: 12,
    textAlign: "right",
    color: "rgba(0, 0, 0, .4)",
    marginTop: 3,
    marginBottom: -5,
    fontStyle: "italic",
    marginRight: isAuthor ? 10 : -5,
  }),
  msgContainer: (isAuthor: boolean) => ({
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0, 0, 0, .1)",
    backgroundColor: isAuthor ? "#f5d86e" : "#eee",
  }),
  name: (isAuthor: boolean) => ({
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
    textAlign: isAuthor ? "right" : "left",
  }),
  media: {
    width: 250,
    height: 250,
    backgroundColor: "#eee",
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0, 0, 0, .1)",
  },
});
