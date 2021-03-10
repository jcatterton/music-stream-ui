import { Track } from "../models/track";

export class MockTrack {
  static mockTrack1: Track = {
    id: "testId",
    name: "testName1",
    artist: "testArtist1",
    album: "testAlbum1",
    audioFile: "testAudioId"
  };

  static mockTrack2: Track = {
    id: "testId",
    name: "testName2",
    artist: "testArtist2",
    album: "testAlbum2",
    audioFile: "testAudioId"
  };

  static mockTrack3: Track = {
    id: "testId",
    name: "testName3",
    artist: "testArtist3",
    album: "testAlbum3",
    audioFile: "testAudioId"
  };

  static mockTracks: Track[] = [MockTrack.mockTrack1, MockTrack.mockTrack2, MockTrack.mockTrack3];
}
