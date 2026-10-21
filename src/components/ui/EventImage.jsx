import { EVENT_IMAGE_FALLBACK } from '../../data/eventBanners.js';
import { ImageWithFallback } from './ImageWithFallback.jsx';

export function EventImage({ event, ...props }) {
  return (
    <ImageWithFallback
      {...props}
      src={event?.bannerUrl}
      fallbackSrc={EVENT_IMAGE_FALLBACK}
      alt={props.alt || event?.title || 'Event image'}
    />
  );
}
