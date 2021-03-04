export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  audioFile: string;
}

export interface UploadTrackRequest {
  name: string;
  artist: string;
  album: string;
  audioFile: File;
}
