# react-native-hud-view
HudView is a React Native Component for showing HUDs. HudView is based on [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) but can also be used with custom components.

## Supports the following vector icons:
* Ionicons
* Entypo
* EvilIcons
* FontAwesome
* MaterialIcons
* Octicons
* Zocial
* Foundation


<img src="https://github.com/iktw/react-native-hud-view/blob/master/hudview.gif" width="300px"/>

### Props
| Name        | Type | Default |
| ------------- |-------------|-------------|
|fadeDuration | Number | 700 |
|hudBackgroundColor | String | #000000 |
| hudOpacity | Number | 0.8 |
| width | Number | 80 |
| height | Number | 80 |
| borderRadius | Number | 5 |
| iconSize     | Number | 42 |
| iconColor | Number | #FFFFFF |
| successComponent | React Native Component | *react-native-vector-icons* FontAwesome check icon |
| errorComponent | React Native Component | *react-native-vector-icons* FontAwesome exclamation-triangle icon |
| spinnerComponent | React Native Component | *react-native-vector-icons* FontAwesome circle-o-notch icon |

### Methods
| Methods        | Args         
| ------------- |-------------|
|showSpinner | None |
| showSuccess | None |
| showError     | None |
| showCustomIcon | setName, iconName, rotate, hideOnCompletion |
| showCustomComponent | component, rotate, hideOnCompletion |
| hide | None |

### Method Args
| Name        | Type | Default | Alternatives |
| ------------- |-------------|-------------|-------------|
|setName | String | fontawesome | ionicons, entypo, evilicons, fontawesome, materialicons, octicons, zocial, foundation |
| iconName | String | null | See font icon documentation |
| rotate     | Boolean | false | true/false |
| hideOnCompletion | Boolean | true | true/false |
| component | React Native Component | null | N/A |

### Example of usage

```
render() {
  return(<HudView ref="hudView">
  </HudView>)
}
```


#####Show Spinner HUD
```
this.refs.hudView.showSpinner()
```
#####Hide HUD
```
this.refs.hudView.hide()
```
#####Show Error HUD
```
this.refs.hudView.showError()
```
#####Show Custom Icon HUD
```
this.refs.hudView.showCustomIcon('ionicons', 'star')
```
#####Show Custom Icon HUD as Spinner
```
this.refs.hudView.showCustomIcon('ionicons', 'star', true, false)
```

#####Show custom component HUD
```
var customComponent = (<Text style={{color: "#ffffff"}}>Loading</Text>)
this.refs.hudView.showCustomComponent(customComponent)
```
#####Show custom component HUD as spinner
```
var customComponent = (<Text style={{color: "#ffffff"}}>Spinning</Text>)
this.refs.hudView.showCustomComponent(customComponent, true, false)
```
#####Do something on HUD completion
All methods returns a promise if hideOnCompletion is set to true.
```
hudView.showSuccess().then(() => {
  alert("Success view did complete.")
})
```
