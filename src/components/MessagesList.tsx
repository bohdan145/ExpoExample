import { faker } from "@faker-js/faker";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import React, { useCallback, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

import MessagesFooter from "./MessagesFooter";
import MessageItem from "./MessageItem";
import Swipable from "./Swipable";

export interface Data {
  id: string;
  text: string;
  date: string;
  image?: string | null;
  video?: string | null;
  isAuthor: boolean;
  user: {
    name: string;
    avatar: string;
  };
}

const _renderItem: ListRenderItem<Data> = ({ item, index }) => (
  <View transform={[{ rotate: "180deg" }]}>
    <Swipable>
      <MessageItem item={item} index={index} />
    </Swipable>
  </View>
);

const _getItemType = (item: Data) => {
  if (item.image?.length) return "image";
  if (item.video?.length) return "video";
  return "text";
};

const _overrideItemLayout = (
  layout: {
    span?: number | undefined;
    size?: number | undefined;
  },
  item: Data
) => {
  if (item.image?.length || item.video?.length) {
    layout.size = 300;
  }
};

const _keyExtractor = (item: Data) => item.id;

const MessagesList = () => {
  const [data, setData] = useState<Data[]>(() =>
    new Array(300).fill(0).map((_, i) => ({
      id: faker.datatype.uuid(),
      text: faker.lorem.text(),
      date: new Date(faker.date.recent(10)).toLocaleTimeString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      image: (i + 1) % 5 === 0 ? faker.image.image(1024, 768, true) : null,
      isAuthor: i % 2 === 0,
      user: {
        name: faker.name.firstName(),
        avatar: faker.image.people(64, 64, true),
      },
    }))
  );
  const list = useRef<FlashList<any>>(null);

  const _handleSubmit = useCallback((msg = "", image: string | undefined) => {
    list.current?.scrollToOffset({ animated: false, offset: 0 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setData((prev) => [
      {
        id: faker.datatype.uuid(),
        text: msg,
        isAuthor: true,
        date: new Date().toLocaleTimeString("en-US", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        image,
        user: {
          name: faker.name.firstName(),
          avatar: faker.image.people(64, 64, true),
        },
      },
      ...prev,
    ]);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <FlashList
          ref={list}
          data={data}
          renderItem={_renderItem}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          keyExtractor={_keyExtractor}
          estimatedItemSize={100}
          contentContainerStyle={styles.innerList}
          getItemType={_getItemType}
          overrideItemLayout={_overrideItemLayout}
        />
      </View>
      <MessagesFooter onPress={_handleSubmit} />
    </>
  );
};

export default MessagesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    transform: [{ rotate: "180deg" }],
  },
  innerList: {
    paddingVertical: 10,
  },
});
