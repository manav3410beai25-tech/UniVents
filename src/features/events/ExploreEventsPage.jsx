import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Calendar, Frown } from 'lucide-react';
import { useEvents } from '../../context/EventContext.jsx';
import { EventCard } from './components/EventCard.jsx';
import { EventFilters } from './components/EventFilters.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export function ExploreEventsPage() {
  const { events, categories, getEventCapacityStats } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from URL if present
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [dateFilter, setDateFilter] = useState('upcoming'); // default show upcoming
  const [priceFilter, setPriceFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('upcoming');

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setDateFilter('all');
    setPriceFilter('all');
    setAvailabilityFilter('all');
    setSortBy('upcoming');
  };

  // Published events only (spec rule: do not expose drafts, pending, or rejected)
  const publishedEvents = useMemo(() => {
    return events.filter((e) => e.status === 'published' || e.status === 'completed');
  }, [events]);

  // Filter & Search logic
  const filteredEvents = useMemo(() => {
    const now = Date.now();

    return publishedEvents
      .filter((evt) => {
        // Text Search (title, description, venue, tags)
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = evt.title.toLowerCase().includes(q);
          const matchDesc = (evt.description || '').toLowerCase().includes(q);
          const matchVenue = (evt.venue || '').toLowerCase().includes(q);
          const matchTags = (evt.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchVenue && !matchTags) return false;
        }

        // Category Filter
        if (category) {
          const catObj = categories.find((c) => c.slug === category || c.id === category);
          if (catObj && evt.categoryId !== catObj.id) return false;
        }

        // Date Filter
        if (evt.startAt) {
          const startTime = new Date(evt.startAt).getTime();
          if (dateFilter === 'upcoming' && startTime < now) return false;
          if (dateFilter === 'past' && startTime >= now) return false;

          const oneWeek = 7 * 24 * 60 * 60 * 1000;
          if (dateFilter === 'this_week') {
            if (startTime < now || startTime > now + oneWeek) return false;
          }

          const oneMonth = 30 * 24 * 60 * 60 * 1000;
          if (dateFilter === 'this_month') {
            if (startTime < now || startTime > now + oneMonth) return false;
          }
        }

        // Price Filter
        if (priceFilter === 'free' && evt.fee > 0) return false;
        if (priceFilter === 'paid' && (!evt.fee || evt.fee === 0)) return false;

        // Availability Filter
        if (availabilityFilter !== 'all') {
          const { isFull } = getEventCapacityStats(evt);
          if (availabilityFilter === 'open' && isFull) return false;
          if (availabilityFilter === 'full' && !isFull) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'upcoming') {
          return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'capacity') {
          return (b.capacity || 0) - (a.capacity || 0);
        }
        return 0;
      });
  }, [
    publishedEvents,
    search,
    category,
    dateFilter,
    priceFilter,
    availabilityFilter,
    sortBy,
    categories,
    getEventCapacityStats,
  ]);

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore Campus Events</h1>
        <p className="text-secondary text-sm">
          Browse upcoming lectures, hackathons, job fairs, workshops and club gatherings.
        </p>
      </div>

      <EventFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories.filter((c) => c.isActive)}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClear={handleClearFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
        <span className="text-sm font-semibold text-secondary">
          Showing <strong>{filteredEvents.length}</strong> events
        </span>
      </div>

      {/* Results Grid or Empty State */}
      {filteredEvents.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No events match your criteria"
          description="Try broadening your search term or clearing one of the active filters to discover other campus happenings."
          actionLabel="Clear All Filters"
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
}
