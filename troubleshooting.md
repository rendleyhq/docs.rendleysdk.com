# Troubleshooting

Refer to the list below for potential issues you might encounter with the SDK. If you have a different issue, please open an issue on [GitHub](https://github.com/rendleyhq/rendley-sdk-issues/issues).

::: details You need to have a valid license to use this function
This message indicates that your license has expired, and you need to obtain a new one to continue using the SDK. You can get a new license for free on [our website](https://app.rendley.com/).
:::

::: details Engine is already initialized. Use Engine.isInitialized() to check if the instance was already created
This error occurs if you try to initialize the Engine multiple times with `Engine.init()` without first destroying the previous instance.
:::

::: details The deserialized state doesn't load the videos/images/audios I have added
If you do not see your uploaded assets, it is likely that you have not stored them properly. Simply adding the files to the library is not sufficient. Please refer to the [Storage](/getting-started/storage.md) section for more information.
:::
