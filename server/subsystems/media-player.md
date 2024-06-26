# Media Player Subsystem

#### Support: `Linux`

This subsystem enables the client to control the media being played/paused in the server. The client will also recieve events about any media player events (like media paused/played, title/artist changed and more).

This module is automatically initialized by the server, when the server recieves the `init` call from the client. It sends [`mp:init`](#mp-init), after completing media player initialization.

## Default Schemas

##### `Metadata` Schema

This schema holds the metadata for the player.

**TODO:** Might need to change metadata data structure from `Metadata` struct to a hash-map/dictionary due to the fact that there is so many standards.

```c
struct Metadata {
    // Unique id of a media track.
	char[]  trackid;
    // Length of the media (in microseconds, us).
    int64_t length;
    // Title of the media being run (song/video name).
	char[] title;
    // List of artists for the media.
	char[][] artist;
    // Album of the media (useful if it's a song).
    char[]   album;
    // List of artists in the album.
	char[][] albumArtist;
    // URL of the media (if exists).
	char[]   url;
    // URL of the album art (the cover image of a song), as a URL.
	char[]   artUrl;
};
```

##### `PlayerIndex` Schema

```c
struct PlayerIndex {
	int playerIndex;
};
```

## Signals

### `mp:init` (formerly `mp:rsetup_metadata`)

**TODO: Change `rsetup_metadata` to `init`.**

This will be recieved when the media player subsystem is initialized.

#### Schema

**INCLUDES**: [`Metadata`](#metadata-schema).

```c
struct Status {
    char[] status;
    int index;
    char[] name;
    struct Metadata metadata;
};

struct SetupStatus {
    struct Status[] statuses;
}
```

Following this, there will be platform-specific signals which would need to be implemented.

The following platforms are currently supported:

1. [Linux](#linux-specific-signals)

## Linux-specific Signals

### `mp:linux:cr` (Player Created)

This describes the created player, anpd also sends back a list of created players.

#### Schema


##### `PlayerData` Schema

**INCLUDES:** [`Metadata`](#metadata-schema)

```c
struct PlayerData {
    char[] playerName;
    char[] playbackStatus;
    Metadata parsedMetadata;
};
```

```c
struct PlayerCreated {
    char[][] updatedPlayerNames;
    PlayerData newPlayer;
};
```


### `mp:linux:psu` (Playback Status Update)

This will be recieved when the playback status of a player is changed, usually between `Play`, `Paused` and `Stopped` states.

#### Schema

```c
struct PlaybackStatusUpdated {
    // Player index
    int index;
    // Player name
    char[] name;
    // Status of the media player.
    char[] status;
};
```

### `mp:linux:mu` (Metadata Update)

This will be recieved when metadata of the player is changed, which usually happens when the audio is changing or being changed.

#### Schema

**INCLUDES**: [`Metadata`](#metadata-schema)

```c
struct MetadataUpdated {
    // Player index
    int index;
    // Player name
    char[] name;
    // New metadata of the media player
    struct Metadata metadata;
};
```

### `mp:linux:seeked` (Player Seeked)

This will be recieved when the player when the seek-bar of the player is moved in the player. The updated seek value will be relayed to the client.

#### Schema

```c
struct PlayerSeeked {
    char[] name;
    int index;
    // seeked time is measured in microseconds (μs)
    int64_t seekedInUs;
};
```

## Methods

Methods are the actions one can run on a media player object. Actions of a media player typically include playing and pausing a media, seeking forward or backward, set a position in the media, if exists, going previous/next et cetera.

## Linux-specific Methods

### Common Arguments

### `mp:list` (Media Player List)

This is to list running/available media players running in the server device. This doesn't have any other arguments.

### Schema

Argument for this is nil, so the value can be omitted, or MessagePack `nil` or `null` can be passed as the argument.

### `mp:iplay` (Player Play, Index Type)

This method can play a player identified by the integer index.

Args: [`PlayerIndex`](#playerindex-schema)

### `mp:ipause` (Player Pause, Index Type)

This method can play a player identified by the integer index.

Args: [`PlayerIndex`](#playerindex-schema)

### `mp:iplaypause` (Player Play/Pause, Index Type)

This method can flip the player playback state, for the player identified by the integer index.

Args: [`PlayerIndex`](#playerindex-schema)

### `mp:ifwd` (Player Forward, Index Type)

This method can click "forward" on the player, to switch to the next media for the player.

Args: [`PlayerIndex`](#playerindex-schema)

### `mp:iprv` (Player Previous, Index Type)

This method can click "previous" on the player, to switch to the previous media for the player.

Args: [`PlayerIndex`](#playerindex-schema)
