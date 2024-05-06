import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    flex: 1,
  },
});

export type IconProps = { color?: unknown; name: string; size?: number };

export type HudOptions = {
  backgroundColor?: string;
  borderRadius?: number;
  fadeDuration?: number;
  height?: number;
  rotate?: boolean;
  rotateDuration?: number;
  width?: number;
};

type HudContextProps<P extends IconProps> = {
  hide: () => void;
  show: (iconProps: P, options?: HudOptions) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HudContext = React.createContext<HudContextProps<any>>({
  hide: () => undefined,
  show: () => undefined,
});

export const useHudContext = <P extends IconProps>() => {
  const context = useContext<HudContextProps<P>>(HudContext);
  return context;
};

export type HudProviderProps<P extends IconProps> = React.PropsWithChildren & {
  IconComponent: React.ComponentType<P>;
  containerStyles?: ViewStyle;
  useNativeDriver?: boolean;
} & ViewProps &
  HudOptions;

export const HudProvider = <P extends IconProps>({
  IconComponent,
  backgroundColor = 'rgba(0,0,0,0.8)',
  borderRadius = 5,
  children,
  containerStyles,
  fadeDuration = 700,
  height = 80,
  rotate = false,
  rotateDuration = 800,
  style,
  useNativeDriver = true,
  width = 80,
  ...viewProps
}: HudProviderProps<P>) => {
  const fadeAnimationRef = useRef(new Animated.Value(0));
  const rotationAnimationRef = useRef(new Animated.Value(0));
  const [iconProps, setIconProps] = useState<P>();

  const defaultOptions = useMemo<Required<HudOptions>>(
    () => ({
      backgroundColor,
      borderRadius,
      fadeDuration,
      height,
      rotate,
      rotateDuration,
      width,
    }),
    [
      fadeDuration,
      backgroundColor,
      borderRadius,
      height,
      width,
      rotate,
      rotateDuration,
    ]
  );

  const [options, setOptions] = useState<HudOptions>(defaultOptions);

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnimationRef.current, {
      duration: options.fadeDuration,
      toValue: 1,
      useNativeDriver,
    }).start();
  }, [options.fadeDuration, useNativeDriver]);

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnimationRef.current, {
      duration: options.fadeDuration,
      toValue: 0,
      useNativeDriver,
    }).start(({ finished }) => {
      if (finished) {
        rotationAnimationRef.current.stopAnimation();
        setIconProps(undefined);
      }
    });
  }, [options.fadeDuration, useNativeDriver]);

  const startRotating = useCallback(() => {
    rotationAnimationRef.current.setValue(0);

    Animated.loop(
      Animated.timing(rotationAnimationRef.current, {
        duration: options.rotateDuration,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver,
      })
    ).start();
  }, [options.rotateDuration, useNativeDriver]);

  const show = useCallback<HudContextProps<P>['show']>(
    (nextIconProps, incomingOptions) => {
      fadeIn();

      const filteredIncomingOptions = incomingOptions
        ? Object.fromEntries(
            Object.entries(incomingOptions).filter(
              ([, value]) => value !== undefined
            )
          )
        : undefined;

      const nextOptions = { ...defaultOptions, ...filteredIncomingOptions };
      setOptions(nextOptions);

      if (nextOptions.rotate) {
        startRotating();
      }

      setIconProps({
        color: 'white',
        size: Math.min(nextOptions.width, nextOptions.height) * 0.5,
        ...nextIconProps,
      });
    },
    [defaultOptions, fadeIn, startRotating]
  );

  const hide = useCallback(() => {
    fadeOut();
  }, [fadeOut]);

  const iconContainerStyles = useMemo(
    () => [
      styles.iconContainer,
      {
        backgroundColor: options.backgroundColor,
        borderRadius: options.borderRadius,
        height: options.height,
        opacity: fadeAnimationRef.current,
        width: options.width,
      },
      containerStyles,
    ],
    [
      containerStyles,
      options.backgroundColor,
      options.borderRadius,
      options.height,
      options.width,
    ]
  );

  const iconWrapperStyles = useMemo(
    () =>
      options?.rotate
        ? {
            transform: [
              {
                rotate: rotationAnimationRef.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }
        : {},
    [options?.rotate]
  );

  return (
    <HudContext.Provider value={{ hide, show }}>
      <View
        style={StyleSheet.flatten([styles.view, style])}
        testID="hud-view"
        {...viewProps}
      >
        {children}
        {iconProps ? (
          <View
            pointerEvents="none"
            style={styles.container}
            testID="hud-container"
          >
            <Animated.View
              style={iconContainerStyles}
              testID="hud-icon-container"
            >
              <Animated.View
                style={iconWrapperStyles}
                testID="hud-icon-wrapper"
              >
                <IconComponent {...iconProps} />
              </Animated.View>
            </Animated.View>
          </View>
        ) : null}
      </View>
    </HudContext.Provider>
  );
};
