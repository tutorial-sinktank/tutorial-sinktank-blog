---
category: /Flutter
slug: /posts/flutter/how-to-implement-cloud-drive-backup-in-flutter
date: 2022-03-16
title: How to implement cloud drive backup in Flutter(android, ios)
tags: 
thumbnail: https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80
---

# Prerequisite

- Know basic dart grammar
- Know basic Flutter workflow
- Have a google developer account
- Have an Apple developer account
- Registered the app on your target platform

# Android : Set up on a Google Cloud Console

1. Go to Google Cloud Platform and select your project

[Google Cloud Platform](https://console.developers.google.com/)

1. On a search bar, type `google drive` and select below.

![스크린샷 2022-03-16 오후 5.39.00.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fcb8c6cf-c152-4680-b836-8e063ca84c0d/스크린샷_2022-03-16_오후_5.39.00.png)

1. Click Enable.

![스크린샷 2022-03-16 오후 5.40.18.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6e32ace3-4c76-4d14-b3fb-7171d8a409f8/스크린샷_2022-03-16_오후_5.40.18.png)

# IOS : Set up on an Apple App Store Connect

1. Go to Apple Developer and login

[Apple Developer](https://developer.apple.com/kr/)

1. On your account page, select `Certificates, IDs & Profiles` → `Identifiers`, make sure you have you app id.

   ![스크린샷 2022-03-16 오후 5.48.29.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0a4f73e3-14ef-49f9-b03b-19606276e840/스크린샷_2022-03-16_오후_5.48.29.png)


![스크린샷 2022-03-16 오후 5.49.25.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6c6d3209-e561-4453-8b4f-b19f19f7c70b/스크린샷_2022-03-16_오후_5.49.25.png)

1. On right side dropdown, select `iCloud Containers`

   ![스크린샷 2022-03-16 오후 5.50.01.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ad7586ee-ce70-4846-981e-63d2ffeb183c/스크린샷_2022-03-16_오후_5.50.01.png)

2. Click blue plus buttom to create iCloud Container identifier.

   ![스크린샷 2022-03-16 오후 5.50.26.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bcc34991-4114-4f91-b6fb-00302a232094/스크린샷_2022-03-16_오후_5.50.26.png)

3. Note that your iCloud Container identifier should have a form like below.

```bash
iCloud.com.example.yourappname
```

1. Save.
2. On right side dropdown, select `App IDs`
3. Select your target app id to edit.
4. On `Capabilities`, check iCloud and click Edit button

   ![스크린샷 2022-03-16 오후 5.57.40.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9398ab71-3e7a-44db-bdee-099e1d0c9f42/스크린샷_2022-03-16_오후_5.57.40.png)

5. Select your iCloud Container identifier
6. Save.

# Code Part

## Install packages

1. For google drive

    ```bash
    flutter pub add google_sign_in
    flutter pub add googleapis
    flutter pub add http
    ```

2. For iCloud

    ```bash
    flutter pub add icloud_storage
    ```

3. Common

    ```bash
    flutter pub add path_provider
    ```


## BaseCloud class

Define methods that should be implemented on both side.

```dart
// base-cloud-repository.dart
import 'package:flutter/foundation.dart';
import 'package:googleapis/drive/v3.dart';
import 'package:http/http.dart';

class BaseCloudRepository {
  Client? client;
  dynamic cloud;

  BaseCloudRepository();

  initGoogleDriveCloud(Client newClient) {
    client = newClient;
    cloud = DriveApi(client!);
  }

  clearData() {
    client = null;
    cloud = null;
  }

  isBackupExist({String? path}) {}

  upload(String jsonString, {String? path}) {}

  download({String? path}) {}
}
```

## Set Constants

```dart
// config.dart
final Map<String, dynamic> config = {
  'api': {
    ...
  },
  'auth': {
    ...
  },
  'cloud': {
    'common': {
      'DRIVE_BACKUP_DIR_PARENT': 'appDataFolder',
      'DRIVE_BACKUP_FILE_NAME': 'flutter_app_starter__backup',
      'DRIVE_BACKUP_FILE_EXT': 'json',
    },
    'apple': {'ICLOUD_CONTAINER_ID': 'iCloud.com.example.flutter_app_starter'},
    'google': {}
  },
  'payment': {
		...
  }
};
```

## Google Drive implementation

First read about the full code and I’ll explain method by method with inline comments.

```dart
// google-drive/google-auth.dart
import 'package:google_sign_in/google_sign_in.dart';
import 'package:googleapis/drive/v3.dart';

class GoogleAuth {
  final GoogleSignIn _googleSignIn = GoogleSignIn(scopes: [
    'https://www.googleapis.com/auth/drive.file',
    DriveApi.driveAppdataScope
  ]);

  logout() async {
    await _googleSignIn.signOut();
  }
}
```

```dart
// google-drive/repository.dart
import 'package:flutter/foundation.dart';
import 'package:http/http.dart';
import 'package:path_provider/path_provider.dart';
import 'package:googleapis/drive/v3.dart';
import 'package:collection/collection.dart';

import '../../../../config/config.dart';
import '../../../util/json-converter.dart';
import '../base-cloud-repository.dart';

class GoogleDriveRepository extends BaseCloudRepository {
  GoogleDriveRepository() : super();

  initGoogleDriveCloud(Client newClient) {
    client = newClient;
    cloud = DriveApi(client!);
    if (kDebugMode) {
      print('cloud : set');
    }
  }

  @override
  Future<File?> isBackupExist({String? path}) async {
    final driveFileList = await (cloud as DriveApi)
        .files
        .list(spaces: config['cloud']['common']['DRIVE_BACKUP_DIR_PARENT']);
    final isExist = driveFileList.files?.firstWhereOrNull((element) =>
        element.name == config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']);
    if (isExist == null) {
      return null;
    }
    return isExist;
  }

  @override
  upload(String jsonString, {String? path}) async {
    final filePath = path ?? (await getApplicationDocumentsDirectory()).path;
    final jsonFile = await JsonFile.stringToJsonFile(jsonString,
        dirPath: filePath,
        fileName: config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']);
    final fileToUpload = File();
    fileToUpload.name = config['cloud']['common']['DRIVE_BACKUP_FILE_NAME'];
    final existFile = await isBackupExist();
    try {
      if (existFile != null) {
        await (cloud as DriveApi).files.update(fileToUpload, existFile.id!,
            uploadMedia: Media(jsonFile.openRead(), jsonFile.lengthSync()));
      } else {
        fileToUpload.parents = [
          config['cloud']['common']['DRIVE_BACKUP_DIR_PARENT']
        ];
        await (cloud as DriveApi).files.create(fileToUpload,
            uploadMedia: Media(jsonFile.openRead(), jsonFile.lengthSync()));
      }
      if (kDebugMode) {
        print('cloud : uploaded');
      }
    } catch (err) {
      if (kDebugMode) {
        print(err);
        throw Exception('failed to upload to google drive');
      }
    }
  }

  @override
  Future<String?> download({String? path}) async {
    final existFile = await isBackupExist();
    if (existFile == null) {
      return null;
    }
    final Media driveFile = await cloud.files.get(existFile.id!,
        downloadOptions: DownloadOptions.fullMedia) as Media;
    final jsonFileString = await JsonFile.streamToJson(driveFile.stream,
        fileName: config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']);
    return jsonFileString;
  }
}
```

### 1) Google Sign In

```dart
final GoogleSignIn _googleSignIn = GoogleSignIn(scopes: [
    'https://www.googleapis.com/auth/drive.file',
    DriveApi.driveAppdataScope
  ]);
```

In order to use google drive service, you need for user to login with their google account. Make sure you use these scopes. The backup file of the app will be placed in App Data.

### 2) Google Drive : Create method for checking exist backup file

```dart
@override
  Future<File?> isBackupExist({String? path}) async {
// 1. list all files in given path(path when you used on upload)
    final driveFileList = await (cloud as DriveApi)
        .files
        .list(spaces: config['cloud']['common']['DRIVE_BACKUP_DIR_PARENT']);
// 2. check if backup file is exist
    final isExist = driveFileList.files?.firstWhereOrNull((element) =>
        element.name == config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']);
// 3. return file if exist, or return null
		if (isExist == null) {
      return null;
    }
    return isExist;
  }
```

### 3) Google Drive : Create method for upload

```dart
@override
  upload(String jsonString, {String? path}) async {
    final filePath = path ?? (await getApplicationDocumentsDirectory()).path;
// 1. make your json data to json file
    final jsonFile = await JsonFile.stringToJsonFile(jsonString,
        dirPath: filePath,
        fileName: config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']);
// 2. instanciate File(this is not from io, but from googleapis
    final fileToUpload = File();
// 3. set file name for file to upload
    fileToUpload.name = config['cloud']['common']['DRIVE_BACKUP_FILE_NAME'];
// 4. check if the backup file is already exist
    final existFile = await isBackupExist();
    try {
// 5. if exist, call update
      if (existFile != null) {
        await (cloud as DriveApi)
					.files.update(
						fileToUpload, 
						existFile.id!,
            uploadMedia: Media(
							jsonFile.openRead(), 
							jsonFile.lengthSync()
						)
					);
      } else {
// 6. if is not exist, set path for file and call create
        fileToUpload.parents = [
          config['cloud']['common']['DRIVE_BACKUP_DIR_PARENT']
        ];
        await (cloud as DriveApi)
					.files.create(
						fileToUpload,
            uploadMedia: Media(
							jsonFile.openRead(), 
							jsonFile.lengthSync()
						)
					);
      }
      if (kDebugMode) {
        print('cloud : uploaded');
      }
    } catch (err) {
// 7. catch any error while uploading process
      if (kDebugMode) {
        print(err);
        throw Exception('failed to upload to google drive');
      }
    }
  }
```

### 4) Google Drive : Create method for download

```dart
@override
  Future<String?> download({String? path}) async {
// 1. check backup before download
    final existFile = await isBackupExist();
    if (existFile == null) {
      return null;
    }
// 2. get drive file
    final Media driveFile = await cloud.files.get(
				existFile.id!,
        downloadOptions: DownloadOptions.fullMedia
		) as Media;
// 3. read stream from Google Drive to json string
// In there, I used JsonFile(I didn't mentioned in there)
// You can use any json package you want to use
    final jsonFileString = await JsonFile.streamToJson(
				driveFile.stream,
        fileName: config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']
		);
    return jsonFileString;
  }
```

## Apple ICloud implementation

Also, read about the full code and I’ll explain method by method with inline comments.

```dart
// apple-icloud/repository.dart
import 'dart:async';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';
import 'package:icloud_storage/icloud_storage.dart';

import '../../../../config/config.dart';
import '../../../util/json-converter.dart';
import '../base-cloud-repository.dart';

class AppleICloudRepository extends BaseCloudRepository {
  ICloudStorage? _icloud;

  AppleICloudRepository() : super();

  _precheck() async {
    _icloud ??= await ICloudStorage.getInstance(
        config['cloud']['common']['ICLOUD_CONTAINER_ID']);
  }

  @override
  upload(String jsonString, {String? path}) async {
    await _precheck();
    StreamSubscription<double>? _subscription;
    Future<dynamic>? _subscriptionFuture;
    bool _isDone = false;
    final dirPath = path ?? (await getApplicationDocumentsDirectory()).path;
    final jsonFile = await JsonFile.stringToJsonFile(jsonString,
        dirPath: dirPath,
        fileName: config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']);
    await _icloud!.startUpload(
        filePath: jsonFile.path,
        destinationFileName:
            '${config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']}.json',
        onProgress: (stream) {
          _subscription = stream.listen((progress) {
            if (kDebugMode) {
              print('upload progress : $progress');
            }
          }, onDone: () {
            if (kDebugMode) {
              _isDone = true;
              print('upload done!');
            }
          }, onError: (err) {
            if (kDebugMode) {
              print('upload error : $err');
            }
          }, cancelOnError: true);
          _subscriptionFuture = _subscription!.asFuture();
        });
    Future.delayed(const Duration(seconds: 7), () {
      if (!_isDone) {
        _subscription?.cancel();
      }
    });
    await Future.wait([_subscriptionFuture!]);
    if (kDebugMode) {
      print('ios cloud : upload start');
    }
    return dirPath;
  }

  @override
  Future<String?> download({String? path}) async {
    await _precheck();
    StreamSubscription<double>? _subscription;
    Future<dynamic>? _subscriptionFuture;
    bool _isDone = false;
    final filePath = (await getApplicationDocumentsDirectory()).path;
    try {
      await _icloud!.startDownload(
          fileName:
              '${config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']}.json',
          destinationFilePath: JsonFile.getFullPath(
              filePath, config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']),
          onProgress: (stream) {
            _subscription = stream.listen((progress) {
              if (kDebugMode) {
                print('download progress : $progress');
              }
            }, onDone: () {
              if (kDebugMode) {
                _isDone = true;
                print('download done!');
              }
            }, onError: (err) {
              if (kDebugMode) {
                print('download error : $err');
              }
            }, cancelOnError: true);
            _subscriptionFuture = _subscription!.asFuture();
          });
      Future.delayed(const Duration(seconds: 7), () async {
        if (!_isDone) {
          _isDone = true;
          _subscription?.cancel();
        }
      });
      await Future.wait([_subscriptionFuture!]);
      final jsonString = await JsonFile.readFileAsJson(
          dirPath: path ?? filePath,
          fileName: config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']);
      if (kDebugMode) {
        print('ios cloud : downloaded from icloud dir');
      }
      return jsonString;
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
      return null;
    }
  }
}
```

### 1) Apple iCloud : Create check method for iCloud instance

```dart
_precheck() async {
    _icloud ??= await ICloudStorage.getInstance(
        config['cloud']['common']['ICLOUD_CONTAINER_ID']);
  }
```

Make sure you have iCloud instance before accessing it.

### 2) Apple iCloud : Create method for upload

```dart
@override
  upload(String jsonString, {String? path}) async {
// 1. check you have instance
    await _precheck();
// 2. create StreamSubscription to handle file stream from iCloud
    StreamSubscription<double>? _subscription;
// 3. for checking is subscription end
    Future<dynamic>? _subscriptionFuture;
    bool _isDone = false;
    final dirPath = path ?? (await getApplicationDocumentsDirectory()).path;
    final jsonFile = await JsonFile.stringToJsonFile(jsonString,
        dirPath: dirPath,
        fileName: config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']);
    await _icloud!.startUpload(
        filePath: jsonFile.path,
        destinationFileName:
            '${config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']}.json',
        onProgress: (stream) {
// 4. set _subscription
          _subscription = stream.listen((progress) {
            if (kDebugMode) {
              print('upload progress : $progress');
            }
// 5. success
          }, onDone: () {
            if (kDebugMode) {
              _isDone = true;
              print('upload done!');
            }
// 6. on error, cancel the stream
          }, onError: (err) {
            if (kDebugMode) {
              print('upload error : $err');
            }
          }, cancelOnError: true);
// 7. mark as stream started
          _subscriptionFuture = _subscription!.asFuture();
        });
// 8. check after 7 seconds, if stream is still not ended, just cancel
    Future.delayed(const Duration(seconds: 7), () {
      if (!_isDone) {
          // 9. this will end stream, so _subscriptionFuture also will be end
        _subscription?.cancel();
      }
    });
// 10. wait for _subscriptionFuture to end(success or error)
    await Future.wait([_subscriptionFuture!]);
    if (kDebugMode) {
      print('ios cloud : upload start');
    }
    return dirPath;
  }
```

### 3) Apple iCloud : Create method for download

```dart
@override
  Future<String?> download({String? path}) async {
// 1. check you have instance
    await _precheck();
// 2. create StreamSubscription to handle file stream from iCloud
    StreamSubscription<double>? _subscription;
// 3. for checking is subscription end before accessing a downloaded file
    Future<dynamic>? _subscriptionFuture;
    bool _isDone = false;
    final filePath = (await getApplicationDocumentsDirectory()).path;
    try {
      await _icloud!.startDownload(
          fileName:
              '${config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']}.json',
          destinationFilePath: JsonFile.getFullPath(
              filePath, config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']),
// 4. set _subscription
					onProgress: (stream) {
            _subscription = stream.listen((progress) {
              if (kDebugMode) {
                print('download progress : $progress');
              }
// 5. success
            }, onDone: () {
              if (kDebugMode) {
                _isDone = true;
                print('download done!');
              }
// 6. on error, cancel the stream
            }, onError: (err) {
              if (kDebugMode) {
                print('download error : $err');
              }
            }, cancelOnError: true);
// 7. mark as stream started
            _subscriptionFuture = _subscription!.asFuture();
          });
// 8. check after 7 seconds, if stream is still not ended, just cancel
      Future.delayed(const Duration(seconds: 7), () async {
        if (!_isDone) {
          _isDone = true;
          // 9. this will end stream, so _subscriptionFuture also will be end
          _subscription?.cancel();
        }
      });
      // 10. wait for _subscriptionFuture to end(success or error)
      await Future.wait([_subscriptionFuture!]);
// 11. read downloaded file content
// In there, I used JsonFile(I didn't mentioned in there)
// You can use any json package you want to use
      final jsonString = await JsonFile.readFileAsJson(
          dirPath: path ?? filePath,
          fileName: config['cloud']['common']['DRIVE_BACKUP_FILE_NAME']);
      if (kDebugMode) {
        print('ios cloud : downloaded from icloud dir');
      }
      return jsonString;
    } catch (e) {
// 12. catch any error occured on using iClould package
      if (kDebugMode) {
        print(e);
      }
      return null;
    }
  }
```

# Conclusion

That’s it! If you want to see the full source code, you can find them [here](https://github.com/swimmingkiim/flutter_app_starter/tree/main/lib/src/resource/cloud).