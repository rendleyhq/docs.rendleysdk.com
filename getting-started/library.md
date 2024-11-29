# Library

The library is where all the uploaded assets are being stored. Whenever uploading an image, or a video, you add it to the library and then reference it when creating a clip. Inside the library we also store the SRT files in case you upload any.

## MediaData

Each asset in the Library is being stored as a MediaData class, which stores metadata about the clip and provides multiple helper functions for adding custom data to it, for triggering the upload to storage and more.
