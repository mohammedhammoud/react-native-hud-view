import { HudProvider, useHudContext } from './HudProvider';
import { TouchableOpacity, View } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';

import React from 'react';
import renderer from 'react-test-renderer';

const MockIcon = () => <></>;

const Content = () => {
  const { hide, show } = useHudContext();

  return (
    <View testID="content">
      <TouchableOpacity
        onPress={() => show({ name: 'test-icon' })}
        testID="show-hud-button"
      />
      <TouchableOpacity onPress={() => hide()} testID="hide-hud-button" />
    </View>
  );
};

describe('HudProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    const json = renderer
      .create(
        <HudProvider IconComponent={MockIcon}>
          <View testID="content" />
        </HudProvider>
      )
      .toJSON();
    expect(json).toMatchSnapshot();
  });

  it('renders correctly when toggling hud', () => {
    const { getByTestId, toJSON } = render(
      <HudProvider
        IconComponent={MockIcon}
        fadeDuration={1000}
        testID="hud-provider"
      >
        <Content />
      </HudProvider>
    );

    const showHudButton = getByTestId('show-hud-button');
    const hideHudButton = getByTestId('hide-hud-button');

    fireEvent.press(showHudButton);
    expect(toJSON()).toMatchSnapshot();

    fireEvent.press(hideHudButton);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render children', () => {
    const { getByTestId } = render(
      <HudProvider IconComponent={MockIcon}>
        <View testID="content" />
      </HudProvider>
    );
    expect(getByTestId('content')).toBeDefined();
  });

  it('should show and hide hud', () => {
    const { getByTestId } = render(
      <HudProvider
        IconComponent={MockIcon}
        fadeDuration={1000}
        testID="hud-provider"
      >
        <Content />
      </HudProvider>
    );

    const hudProvider = getByTestId('hud-provider');
    const showHudButton = getByTestId('show-hud-button');
    const hideHudButton = getByTestId('hide-hud-button');

    expect(hudProvider.children).toHaveLength(1);

    fireEvent.press(showHudButton);

    expect(hudProvider.children).toHaveLength(2);

    fireEvent.press(hideHudButton);

    jest.advanceTimersByTime(999);
    expect(hudProvider.children).toHaveLength(2);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(hudProvider.children).toHaveLength(1);
  });

  it('should render hud with custom properties', async () => {
    const IconComponent = jest.fn((props) => <View {...props} />);
    const { getByTestId } = render(
      <HudProvider
        IconComponent={IconComponent}
        backgroundColor="red"
        borderRadius={10}
        height={50}
        rotate={true}
        width={100}
      >
        <Content />
      </HudProvider>
    );

    const showButton = getByTestId('show-hud-button');

    fireEvent.press(showButton);

    expect(IconComponent).toHaveBeenCalledWith(
      {
        color: 'white',
        name: 'test-icon',
        size: 25,
      },
      {}
    );

    expect(getByTestId('hud-icon-container')).toHaveStyle({
      backgroundColor: 'red',
      borderRadius: 10,
      height: 50,
      width: 100,
    });

    expect(getByTestId('hud-icon-wrapper')).toHaveStyle({
      transform: [{ rotate: '0deg' }],
    });
  });
});
