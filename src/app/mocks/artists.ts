import { MockAlbum } from "./albums";

export class MockArtist {
  static mockArtist1 = {
    name: "testArtist1",
    albums: [MockAlbum.mockAlbum1]
  };

  static mockArtist2 = {
    name: "testArtist2",
    albums: [MockAlbum.mockAlbum1, MockAlbum.mockAlbum2]
  };

  static mockArtist3 = {
    name: "testArtist3",
    albums: [MockAlbum.mockAlbum1, MockAlbum.mockAlbum2, MockAlbum.mockAlbum3]
  };

  static mockArtists = [MockArtist.mockArtist1, MockArtist.mockArtist2, MockArtist.mockArtist3];
}
