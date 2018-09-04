# Millicast Client SDK

The Millicast client SDK contains API for publishing or viewing a Millicast
stream.

## Constructor

```typescript
interface Config {
  logger: Console,
  viewerUrl: string,
  publisherUrl: string,
  turnApiUrl: string
}

function createMillicastClient(config: Config) : MillicastClient
```

Create a Millicast client from a config object. The config object is a
plain object with the required fields specified.

  - `logger` - Logger object with same interface as the Console object.
    For example it can simply be `console`.
  - `viewerUrl` - URL for Millicast viewer API.
  - `publisherUrl` - URL for Millicast publisher API.
  - `turnApiUrl` - URL for getting ICE servers from Xirsys.

## Millicast Client

```typescript
class MillicastClient {
  getIceServers() : Promise<Array<IceServer>>

  viewStream(millicastId: string, iceServers: Array<IceServer>)
    : Promise<ViewerResult>

  publishStream(millicastId: string, iceServers: Array<IceServer>,
    mediaStream: MediaStream) : Promise<PublishResult>
}

interface PublishResult {
  pc: RTCPeerConnection,
  ws: WebSocket
}

interface ViewerResult : PublishResult {
  mediaStream: MediaStream
}
```

### Get ICE Servers

Get a list of ICE servers from Xirsys API. The result can be used to pass to
the view or publish stream APIs so that the underlying RTCPeerConnection object
makes use of it.

### Publish Stream

Publish a given media stream using the given Millicast ID. When success, the
result is a plain object containing the underlying `RTCPeerConnection` and
`WebSocket` objects. The user should close the underlying connections if
they are no longer used, and monitor if they emit error events.

### View Stream

View a stream published by the given Millicast ID. Other than the same results
from publish stream, the user also gets a `MediaStream` object that can then be
rendered using a video element.
