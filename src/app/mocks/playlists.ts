import { Playlist } from "../models/playlist";
import { MockTrack } from "./tracks";

export class MockPlaylist {
  static mockPlaylist1: Playlist = {
    id: "testId1",
    name: "testName1",
    tracks: [MockTrack.mockTrack1.id]
  };

  static mockPlaylist2: Playlist = {
    id: "testId2",
    name: "testName2",
    tracks: [MockTrack.mockTrack1.id, MockTrack.mockTrack2.id]
  };

  static mockPlaylist3: Playlist = {
    id: "testId3",
    name: "testName3",
    tracks: MockTrack.mockTracks.map(t => t.id)
  };

  static mockPlaylists: Playlist[] = [MockPlaylist.mockPlaylist1, MockPlaylist.mockPlaylist2, MockPlaylist.mockPlaylist3];
}
