import React, { useMemo } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";
import { Text, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const maxSwipeValue = 60;
const Swipable: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style = {},
}) => {
  const offsetX = useSharedValue(0);
  const isActivated = useSharedValue(false);

  const onSelect = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .failOffsetY([-5, 5])
        .activeOffsetX([-5, 5])
        .onUpdate((e) => {
          if (e.translationX < 0) {
            if (Math.abs(e.translationX) <= maxSwipeValue) {
              offsetX.value = e.translationX;
            } else {
              offsetX.value = withDecay({
                velocity: e.velocityX * 0.1,
                velocityFactor: 0.5,
              });
              if (!isActivated.value) {
                isActivated.value = true;
                runOnJS(onSelect)();
              }
            }
          }
        })
        .onEnd(() => {
          offsetX.value = withSpring(0, { mass: 0.5 });
          isActivated.value = false;
        }),
    []
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }],
      opacity: interpolate(offsetX.value, [-maxSwipeValue, 0], [0.75, 1]),
    };
  });

  const animatedIcon = useAnimatedStyle(() => {
    const interpolated = interpolate(
      offsetX.value,
      [-maxSwipeValue, 0],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale: interpolated }],
      opacity: interpolated,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle, style]}>
        {children}
        <Animated.View
          style={[
            animatedIcon,
            {
              position: "absolute",
              top: "50%",
              right: -25,
              marginTop: -5,
            },
          ]}
        >
          <MaterialCommunityIcons name="reply-circle" size={30} color="#444" />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Swipable;
