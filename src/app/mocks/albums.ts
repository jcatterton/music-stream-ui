import { MockTrack } from "./tracks";

export class MockAlbum {
  static mockAlbum1 = {
    name: "testAlbum1",
    artist: "testArtist1",
    tracks: [MockTrack.mockTrack1]
  };

  static mockAlbum2 = {
    name: "testAlbum2",
    artist: "testArtist2",
    tracks: [MockTrack.mockTrack1, MockTrack.mockTrack2]
  };

  static mockAlbum3 = {
    name: "testAlbum3",
    artist: "testArtist3",
    tracks: MockTrack.mockTracks
  };

  static mockAlbums = [MockAlbum.mockAlbum1, MockAlbum.mockAlbum2, MockAlbum.mockAlbum3];
}
