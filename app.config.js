export default {
  expo: {
    name: "nutri-now",
    slug: "nutri-now",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#ffffff"
      },
      package: "com.nutrinow.app",
      config: {
        googleMaps: {
          apiKey: "key"
        }
      }
    },
    extra: {
      eas: {
        projectId: "id"
      }
    }
  }
}; 