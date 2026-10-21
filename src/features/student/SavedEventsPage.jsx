import { Bookmark } from 'lucide-react';
import { useEvents } from '../../context/EventContext.jsx';
import { EventCard } from '../events/components/EventCard.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export function SavedEventsPage() {
  const { events, savedEventIds } = useEvents();

  const savedEvents = events.filter((e) => savedEventIds.includes(e.id));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Saved Events</h1>
        <p className="text-secondary text-sm">
          Bookmark events you are interested in attending to quickly access them later.
        </p>
      </div>

      {savedEvents.length > 0 ? (
        <div className="saved-events-grid">
          {savedEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved events yet"
          description="Click the bookmark icon on any campus event card or details page to add it to your saved list."
          actionLabel="Explore Events"
          onAction={() => (window.location.href = `${import.meta.env.BASE_URL}events`)}
        />
      )}
    </div>
  );
}
