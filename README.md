# Protoman

<img src="assets/icon.png" width="100" />

A [Postman](https://www.postman.com/) clone with [protobuf](https://developers.google.com/protocol-buffers) support.

## Specs

- [x] Parsing `.proto` files to collect metadata.
- [x] UI to view/edit protobuf messages.
- [x] Sending requests with protobuf messages.
- [x] Viewing response with protobuf messages.
- [x] Persisting view state
- [x] Collections
- [ ] Environments from [Postman](https://learning.postman.com/docs/postman/variables-and-environments/variables/)
- [ ] Response metadata - execution time, body size, ...
- [ ] Expose more request configurations
- [ ] Support `bytes` datatype - with something like base64 strings.

## Usage

The interface is pretty similar to Postman - enter your good old http request parameters, click send, view the results.

<img src="assets/req_resp.png">

The app needs your `.proto` files to populate all those protobuf-related views. Click on the button with 'P' next to your collection to register the file paths.

<img src="assets/protofile_manager.png">

That's it for the current version. Hope it makes your life a bit easier.

## Installation

### Mac

[Protoman-0.1.0.dmg](http://protoman.co/mac/Protoman-0.1.0.dmg)

### Windows

[Protoman Setup 0.1.0.exe](http://protoman.co/win/Protoman%20Setup%200.1.0.exe) - Unlike mac, I don't currently own a license to sign the app. So it might give you some security warnings!

### Linux

[Protoman-0.1.0.AppImage](http://protoman.co/linux/Protoman-0.1.0.AppImage)

> As a fallback, you can clone the repo and run `npm install && npm run build` to build, and `npm run start` to launch the app. Or, you can actually find configurations on [electron builder](https://www.electron.build/) to get the right distribution version yourself!
