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

export interface YoutubeRequest {
  name: string;
  artist: string;
  album: string;
  youtubeLink: string;
}

export interface UploadRequest {
  youtubeRequest: YoutubeRequest;
  audioBytes: string;
}
