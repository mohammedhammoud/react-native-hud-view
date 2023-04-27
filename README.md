# react-native-hud-view

`react-native-hud-view` is a lightweight, flexible, and customizable progress indicator library for React Native. The library provides an easy way to show a HUD (Heads-up Display) when you need to indicate progress or loading in your application.

`react-native-hud-view` is a standalone library and does not have any dependencies. However, you will need to provide your own icon component to use with the library. The icon component should accept the following props: `color`, `name`, and `size`.

We recommend using the `react-native-vector-icons` library with `react-native-hud-view`, as it is guaranteed to work with the library. To use a different icon library, simply provide the appropriate icon component to the `HudProvider` component.

<img src="https://github.com/mohammedhammoud/react-native-hud-view/blob/master/demo.gif" width="300px"/>

## Installation

- `yarn add react-native-hud-view` or `npm install react-native-hud-view`

## Usage

### Wrap your app with HudProvider

You can use the `HudProvider` component at the root of your application to provide the context for showing the HUD. This component should wrap your application's main component.

```tsx
import { HudProvider } from 'react-native-hud-view';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  return (
    <HudProvider IconComponent={FontAwesomeIcon}>
      <MainComponent />
    </HudProvider>
  );
};
```

### Show and hide the HUD

You can use the `useHudContext` hook to access the `show` and `hide` methods of the HUD context.

```tsx
import { useHudContext } from 'react-native-hud-view';

const MyComponent = () => {
  const { show, hide } = useHudContext();

  const handlePress = async () => {
    show({ name: 'rocket' });
    await performAsyncOperation();
    hide();
  };

  return <Button onPress={handlePress} title="Perform Async Operation" />;
};
```

### Options

The following options are available for configuring the HUD:

- `fadeDuration` (default: 700): The duration of the fade animation in milliseconds.
- `backgroundColor` (default: 'rgba(0,0,0,0.8)'): The background color of the HUD.
- `borderRadius` (default: 5): The border radius of the HUD.
- `height` (default: 80): The height of the HUD.
- `width` (default: 80): The width of the HUD.
- `rotate` (default: false): Whether or not to show a rotating animation on the HUD.
- `rotateDuration` (default: 800): The duration of the rotation animation in milliseconds.

`useNativeDriver` is set to `true` by default. If you wish to disable it, please set it to `false` on the `HudProvider`.

```tsx
<HudProvider IconComponent={Icon} useNativeDriver={false}>
  {children}
</HudProvider>
```

You can pass these options as a second argument to the `show` method of the HUD context. For example:

```tsx
show({ name: 'rocket' }, { rotate: true });
```

You can also use these options to the HudProvider if you want to configured them once, globally. _However, when using "show" the global options will be overwritten by the argument options._ For example if your `HudProvider` is configured like this:

```tsx
<HudProvider IconComponent={Icon} backgroundColor="blue">
  {children}
</HudProvider>
```

and you execute `show({ name: 'rocket' }, { backgroundColor: 'red' });` the HUD will have the background color red for this particular execution.

### Icons

You can use any icon library with `react-native-hud-view`. You just need to provide an `IconComponent` to the `HudProvider` component. The `IconComponent` should accept the following props:

- `color`: The color of the icon.
- `name`: The name of the icon.
- `size`: The size of the icon.

```tsx
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const App = ({ children }) => {
  return <HudProvider IconComponent={FontAwesomeIcon}>{children}</HudProvider>;
};
```

### Styling

You can style the HUD container by passing styles to the `containerStyles` prop of the `HudProvider` component.

```tsx
<HudProvider IconComponent={Icon} containerStyles={{ backgroundColor: 'blue' }}>
  {children}
</HudProvider>
```

You can also style the wrapper view that contains the HUD by passing styles to the `style` prop of the `HudProvider` component.

```tsx
<HudProvider IconComponent={Icon} style={{ backgroundColor: 'blue' }}>
  {children}
</HudProvider>
```

## License

`react-native-hud-view` is licensed under the MIT License. This means that anyone can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software as long as they include the original copyright and license notice in all copies or substantial portions of the software.

You are free to use `react-native-hud-view` in any commercial or non-commercial project without attribution, but it is always appreciated if you mention the author in your project's acknowledgments or credits.
