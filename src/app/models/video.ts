export interface Video {
  ID: string;
  Title: string;
  Description: string;
  Author: string;
  Duration: number;
  PublishDate: string;
  Formats: Format[];
  Thumbnails: {
    URL: string;
    Width: number;
    Height: number;
  }[];
  DashManifestURL: string;
  HLSManifestURL: string;

}

export interface Format {
  itag: number;
  url: string;
  mimeType: string;
  quality: string;
  signatureCipher: string;
  bitrate: number;
  fps: number;
  width: number;
  height: number;
  lastModified: string;
  contentLength: string;
  qualityLabel: string;
  projectionType: string;
  averageBitrate: number;
  audioQuality: string;
  approxDurationMs: string;
  autioSampleRate: string;
  audioChannels: number;
  initRange: {
    start: string;
    end: string;
  }
  indexRange: {
    start: string;
    end: string;
  }
}
