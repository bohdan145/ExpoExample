import React, { useCallback, useRef } from "react";
import { Animated, ImageStyle } from "react-native";

const AnimatedImage: React.FC<{ uri: string; style: ImageStyle }> = ({
  uri = "",
  style = {},
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const _onLoad = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      useNativeDriver: true,
      duration: 300,
    }).start();
  }, []);

  return (
    <Animated.Image
      fadeDuration={0}
      source={{ uri, cache: "force-cache" }}
      style={[style, { opacity }]}
      onLoad={_onLoad}
    />
  );
};

export default AnimatedImage;
