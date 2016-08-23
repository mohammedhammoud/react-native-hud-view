const Ionicons = require('react-native-vector-icons/Ionicons');
const Entypo = require('react-native-vector-icons/Entypo');
const EvilIcons = require('react-native-vector-icons/EvilIcons');
const FontAwesome = require('react-native-vector-icons/FontAwesome');
const MaterialIcons = require('react-native-vector-icons/MaterialIcons');
const Octicons = require('react-native-vector-icons/Octicons');
const Zocial = require('react-native-vector-icons/Zocial');
const Foundation = require('react-native-vector-icons/Foundation');

import React from 'react';

import {
  View,
  Animated,
  Easing,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {flex: 1, justifyContent: "center", alignItems: "center", position:"absolute", top: 0, bottom: 0, left: 0, right: 0},
  hudContainer: {justifyContent:"center", alignItems: "center", width:80, height:80, borderRadius: 5}
})

class HudView extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       fadeDuration: this._getFadeDuration(),
       isVisible: false,
       isRotating: false,
       icon: null,
       fadeAnim: new Animated.Value(0),
       rotationAnim: new Animated.Value(0),
     };
   }

   _hexToRgb(hex){
       hex = hex.replace('#','');
       r = parseInt(hex.substring(0,2), 16);
       g = parseInt(hex.substring(2,4), 16);
       b = parseInt(hex.substring(4,6), 16);
       return [r, g, b].join();
   }

   _fadeIn() {
     this.setState({isVisible: true})
     Animated.timing(
       this.state.fadeAnim,
       {toValue: 1, duration: this.state.fadeDuration}
     ).start();
   }

   _fadeOut() {
     Animated.timing(
       this.state.fadeAnim,
       {toValue: 0, duration: this.state.fadeDuration}
     ).start(() => {
       this.setState({isVisible: false})
     });
   }

   _initializeRotationAnimation(isRotating) {
     this.state.rotationAnim.setValue(0)
     if (!isRotating && !this.state.isVisible) return;

     Animated.timing(this.state.rotationAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.linear,
        }).start(() => {
          this._initializeRotationAnimation()
        });
   }

   _getHudBackgroundColor() {
     return this.props.hudBackgroundColor || "#000000";
   }

   _getFadeDuration() {
     return this.props.fadeDuration != null && this.props.fadeDuration >= 0 ? this.props.hudOpacity : 700;
   }

   _getHudOpacity() {
     return this.props.hudOpacity != null && this.props.hudOpacity >= 0 ? this.props.hudOpacity : 0.8;
   }

   _getIconSize() {
     return this.props.iconSize || 42;
   }

   _getIconColor() {
     return this.props.iconColor || "#FFFFFF";
   }

   _getHudRgbaColor() {
     const opacity = this._getHudOpacity();
     const color = this._getHudBackgroundColor();
     const rgbColor = this._hexToRgb(color);
     return `rgba(${rgbColor},${opacity})`
   }

   _getSetName() {
     return this.props.setName ? this.props.setName.toLowerCase() : 'fontawesome';
   }

  _getIconComponent(setName) {
    switch (setName) {
      case 'foundation':
        return Foundation
      case 'zocial':
        return Zocial
      case 'octicons':
        return Octicons
      case 'materialicons':
        return MaterialIcons
      case 'ionicons':
        return Ionicons
      case 'evilicons':
        return EvilIcons
      case 'entypo':
        return Entypo
      default:
        return FontAwesome
    }
  }

   _getInterpolatedRotateAnimation() {
     return this.state.rotationAnim.interpolate({
           inputRange: [0, 1],
         outputRange: ['0deg', '360deg']
       });
   }

   _getHudContainerStyles() {
     return [styles.hudContainer, {opacity: this.state.fadeAnim}, {backgroundColor: this._getHudRgbaColor()}]
   }

  _getContainerStyles() {
    return [this.props.style, {flex: 1}];
  }

  _getIconWrapperStyles() {
    var styles = this.state.isRotating ? {transform: [{rotate: this._getInterpolatedRotateAnimation()}]} : {};
    return styles;
  }

  _renderIcon() {
    return (<Animated.View style={this._getIconWrapperStyles()}>
      {this.state.icon}
    </Animated.View>)
  }

  _renderDefaultSpinnerComponent() {
    return <FontAwesome name="circle-o-notch" size={this._getIconSize()} color={this._getIconColor()}/>
  }

  _renderDefaultSuccessComponent() {
    return <FontAwesome name="check" size={this._getIconSize()} color={this._getIconColor()}/>
  }

  _renderDefaultErrorComponent() {
    return <FontAwesome name="exclamation-triangle" size={this._getIconSize()} color={this._getIconColor()}/>
  }

  _showHud(icon, rotate, hideOnCompletion) {
    this.setState({isVisible: false, icon: icon, isRotating: rotate})
    this._initializeRotationAnimation(rotate);
    this._fadeIn();

    return new Promise((resolve, reject) => {
      if (hideOnCompletion) {
        setTimeout(() => {
          this.hide();
          setTimeout(() => {
            resolve();
        }, this.state.fadeDuration)
      }, this.state.fadeDuration)
      }
    });
  }

  _renderHud() {
    if (!this.state.isVisible) return;

    return <View style={styles.mainContainer}>
     <Animated.View style={this._getHudContainerStyles()}>
        {this._renderIcon()}
     </Animated.View>
    </View>
  }

  hide() {
    this._fadeOut();
  }

  showSpinner() {
    const icon = this.props.spinnerComponent || this._renderDefaultSpinnerComponent();
    return this._showHud(icon, true);
  }

  showSuccess() {
    const icon = this.props.successComponent || this._renderDefaultSuccessComponent();
    return this._showHud(icon, false, true);
  }

  showError() {
    const icon = this.props.errorComponent || this._renderDefaultErrorComponent();
    return this._showHud(icon, false, true);
  }

  showCustomIcon(setName, iconName, rotate, hideOnCompletion) {
    const _component = this._getIconComponent(setName);
    const icon = <_component name={iconName} size={this._getIconSize()} color={this._getIconColor()}/>
    return this._showHud(icon, rotate, hideOnCompletion);
  }

  showCustomComponent(component, rotate, hideOnCompletion) {
    return this._showHud(component, rotate, hideOnCompletion);
  }

  render() {
    return (<View {...this.props} style={this._getContainerStyles()}>
      {this.props.children}
      {this._renderHud()}
    </View>)
  }
}

HudView.propTypes = {
  fadeDuration: React.PropTypes.number,
  hudBackgroundColor: React.PropTypes.string,
  hudOpacity: React.PropTypes.number,
  iconSize: React.PropTypes.number,
  iconColor: React.PropTypes.string,
  successComponent: React.PropTypes.object,
  errorComponent: React.PropTypes.object,
  spinnerComponent: React.PropTypes.object,
}

module.exports = HudView;
