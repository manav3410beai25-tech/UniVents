import { ImageWithFallback } from './ImageWithFallback.jsx';
import { DEFAULT_AVATAR_PATH, resolveAvatarUrl } from '../../data/avatars.js';

export function AvatarImage({ src, ...props }) {
  const resolved = resolveAvatarUrl(src);
  return <ImageWithFallback {...props} src={resolved} fallbackSrc={DEFAULT_AVATAR_PATH} />;
}
