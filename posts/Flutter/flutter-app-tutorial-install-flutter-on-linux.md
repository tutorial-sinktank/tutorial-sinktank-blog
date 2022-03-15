---
category: /Flutter
slug: /posts/flutter/flutter-app-tutorial-install-flutter-on-linux
date: 2022-03-15
title: Flutter app Tutorial - Install Flutter on Linux
tags: flutter,app,tutorial,todo,toy,project,dart,install,sdk,linux,ubuntu
thumbnail: https://flutter-ko.dev/images/catalog-widget-placeholder.png
---

# 1. Install Snap

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install snapd
```

# 2. Install Flutter with Snap

```bash
sudo snap install flutter —classic
```

# 3. Run “flutter doctor”

```bash
flutter doctor
```

# 4. Set Environment Variable

```bash
export PATH=“$PATH:`flutter sdk-path`/flutter/bin”
```