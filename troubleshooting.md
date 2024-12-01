# Troubleshooting

Check the list below for any potential issues you might have with the SDK. If you have a different issue, please open an issue on [GitHub](https://github.com/rendley-app/sdk/issues).

::: details You need to have a valid license to use this function
This means your license has expired and you have to get a new one in order to continue using the SDK. You can get one for free on [our website](https://app.rendley.com/).
:::

::: details Engine is already initialized. Use Engine.isInitialized() to check if the instance was already created
This happens when you try to initialize the Engine multiple times using `Engine.init()`.
:::

::: details The deserialized state doesn't load the videos/images/audios I have added
If you don't see uploaded assets, there is a good chance you haven't stored them. It is not enough to add the files to the library. Take a look at the [Storage](/getting-started/storage.md) section for more information.
:::
