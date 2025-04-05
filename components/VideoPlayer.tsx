"use client";

interface VideoPlayerProps {
  url: string;
}

const isYouTubeUrl = (url: string) => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const getYouTubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/i
  );
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
};

const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const isYouTube = isYouTubeUrl(url);
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(url) : null;

  return (
    <div className="relative aspect-video w-full">
      {isYouTube && embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          src={url}
          width="100%"
          height="100%"
          controls
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
