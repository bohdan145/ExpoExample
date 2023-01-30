import type {
  ActivityIndicatorProps,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from "react-native";

export type ImageZoomProps = {
  uri?: string;
  minScale?: number;
  maxScale?: number;
  minPanPointers?: number;
  maxPanPointers?: number;
  isPanEnabled?: boolean;
  isPinchEnabled?: boolean;
  onLoadEnd?: Function;
  onInteractionStart?: Function;
  onInteractionEnd?: Function;
  onPinchStart?: Function;
  onPinchEnd?: Function;
  onPanStart?: Function;
  onPanEnd?: Function;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  activityIndicatorProps?: ActivityIndicatorProps;
  renderLoader?: Function;
};
