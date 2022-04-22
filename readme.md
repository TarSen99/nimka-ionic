## For build

Add configs from https://github.com/baumblatt/capacitor-firebase-auth

Check permissions for instagram
https://github.com/gregavola/cordova-plugin-instagram-stories

##

Push notifications config
https://capacitorjs.com/docs/apis/push-notifications

## For ios

Add Google service file

.plist
NSCameraUsageDescription
We need access to your camera to scan QR codes.

Privacy - Photo Library Usage Description
We need access to photos to add images for product description

Privacy - Photo Library Additions Usage Description
We need access to camera to add images for product description

## Info.plist

add "instagram-stories" to URL TYPES => URL SCHEMAS

## Pods Full

```
platform :ios, '12.0'
use_frameworks!

# workaround to avoid Xcode caching of Pods that requires
# Product -> Clean Build Folder after new Cordova plugins installed
# Requires CocoaPods 1.6 or newer
install! 'cocoapods', :disable_input_output_paths => true

def capacitor_pods
  pod 'Capacitor', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorCordova', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorApp', :path => '../../node_modules/@capacitor/app'
  pod 'CapacitorCamera', :path => '../../node_modules/@capacitor/camera'
  pod 'CapacitorDevice', :path => '../../node_modules/@capacitor/device'
  pod 'CapacitorDialog', :path => '../../node_modules/@capacitor/dialog'
  pod 'CapacitorHaptics', :path => '../../node_modules/@capacitor/haptics'
  pod 'CapacitorKeyboard', :path => '../../node_modules/@capacitor/keyboard'
  pod 'CapacitorPushNotifications', :path => '../../node_modules/@capacitor/push-notifications'
  pod 'CapacitorSplashScreen', :path => '../../node_modules/@capacitor/splash-screen'
  pod 'CapacitorStatusBar', :path => '../../node_modules/@capacitor/status-bar'
  pod 'CapacitorStorage', :path => '../../node_modules/@capacitor/storage'
  pod 'CapacitorFirebaseAuth', :path => '../../node_modules/capacitor-firebase-auth'
  pod 'CordovaPlugins', :path => '../capacitor-cordova-ios-plugins'
  pod 'CordovaPluginsResources', :path => '../capacitor-cordova-ios-plugins'
end

# pod 'Firebase/Messaging', '~> 8.10.0'


target 'App' do
  capacitor_pods
  pod 'Firebase/Core'
  pod 'Firebase/Auth'
  pod 'GoogleSignIn', '~> 5.0.2'
  pod 'Firebase/Messaging', '~> 8.10.0'
  pod 'GoogleUtilities'

  # Add your Pods here
end


target 'ImageNotification' do
  pod 'Firebase/Messaging', '~> 8.10.0'
  pod 'GoogleUtilities'

end

```

## Add images to push on IOS

https://rnfirebase.io/messaging/ios-notification-images

### Add pod dependencies

https://ionic.zendesk.com/hc/en-us/articles/360037704753-Capacitor-Plugin-Development-Adding-iOS-podfile-dependencies

### Firebase

Client ID

1033159312679-sblh08qlh22upq7pi7f23pfrjjqpjkjv.apps.googleusercontent.com

````

## Ios NotificationService as swift

Change target to IOS latest versions
link:
https://rnfirebase.io/messaging/ios-notification-images

Code

```
import UserNotifications
import FirebaseMessaging

class NotificationService: UNNotificationServiceExtension {

    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        self.contentHandler = contentHandler
        bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)

            FirebaseMessaging.Messaging.serviceExtension().populateNotificationContent(self.bestAttemptContent!, withContentHandler: contentHandler)

        }
    override func serviceExtensionTimeWillExpire() {
        // Called just before the extension will be terminated by the system.
        // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
        if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }


}

```
````
