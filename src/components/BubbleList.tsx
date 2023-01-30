import { faker } from "@faker-js/faker";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import React, { memo, useRef, useState } from "react";
import {
  useWindowDimensions,
  Animated,
  Platform,
  View,
  Image,
} from "react-native";
import CachedImage from "react-native-expo-cached-image";
import { Data } from "../../App";

const AnimatedImage = Animated.createAnimatedComponent(
  Platform.OS === "android" ? Image : CachedImage
);
const FadeInImage: React.FC<{ uri: string }> = ({ uri }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  return (
    <AnimatedImage
      fadeDuration={0}
      source={{ uri }}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 150,
        opacity,
        transform: [
          {
            scale: opacity,
          },
        ],
      }}
      onLoad={() => {
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
          mass: 0.7,
        }).start();
      }}
    />
  );
};

const ListItem: React.FC<{ size: number; item: Data; index: number }> = memo(
  ({ size, item, index }) => {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "rgba(0, 0, 0, .05)",
          marginTop: index % 2 === 0 ? size * 0.25 : size * -0.25,
          shadowColor: "#222",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
      >
        <FadeInImage key={item.id} uri={item.image} />
      </View>
    );
  }
);

const BubbleList: React.FC = () => {
  const [data] = useState<Data[]>(() =>
    new Array(500).fill(0).map(() => ({
      name: faker.name.fullName(),
      id: faker.datatype.uuid(),
      image: faker.image.image(128, 128, true),
    }))
  );

  const { width, height } = useWindowDimensions();
  const numColumns = 4;
  const size = width / numColumns;

  const _renderItem: ListRenderItem<Data> = ({ item, index }) => (
    <ListItem item={item} size={size} index={index} />
  );

  return (
    <FlashList
      data={data}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      estimatedItemSize={size}
      contentContainerStyle={{
        paddingVertical: size / 2,
      }}
      estimatedListSize={{ width, height: height - 30 }}
      renderItem={_renderItem}
    />
  );
};

export default BubbleList;
