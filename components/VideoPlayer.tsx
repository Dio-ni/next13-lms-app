"use client";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer = ({ url }: VideoPlayerProps) => (
  <div className="relative aspect-video">
    <video
      src={url}
      width="100%"
      height="100%"
      controls
      className="w-full h-full object-cover"
    />
  </div>
);

export default VideoPlayer;
