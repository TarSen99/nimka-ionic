## For build

Add configs from https://github.com/baumblatt/capacitor-firebase-auth

Check permissions for instagram
https://github.com/gregavola/cordova-plugin-instagram-stories

## For ios

Add Google service file

.plist
NSCameraUsageDescription
We need access to your camera to scan QR codes.

## Info.plist

add "instagram-stories" to URL TYPES => URL SCHEMAS

## Pods

```
pod 'Firebase/Core'
pod 'Firebase/Auth'
pod 'GoogleSignIn', '~> 5.0.2'
```

### Add pod dependencies

https://ionic.zendesk.com/hc/en-us/articles/360037704753-Capacitor-Plugin-Development-Adding-iOS-podfile-dependencies

### Firebase

Client ID

1033159312679-sblh08qlh22upq7pi7f23pfrjjqpjkjv.apps.googleusercontent.com
