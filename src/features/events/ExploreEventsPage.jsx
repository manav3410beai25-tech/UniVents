import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useEvents } from '../../context/EventContext.jsx';
import { EventCard } from './components/EventCard.jsx';
import { EventFilters } from './components/EventFilters.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export function ExploreEventsPage() {
  const { events, categories, getEventCapacityStats } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  const [now] = useState(() => Date.now());

  // URL searchParams is the single source of truth for category
  const category = searchParams.get('category') || '';

  // Synchronize search input with URL search param
  const currentUrlQuery = searchParams.get('q') || '';
  const [search, setSearch] = useState(currentUrlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(currentUrlQuery);

  if (prevUrlQuery !== currentUrlQuery) {
    setPrevUrlQuery(currentUrlQuery);
    setSearch(currentUrlQuery);
  }

  const [dateFilter, setDateFilter] = useState('upcoming'); // default show upcoming
  const [priceFilter, setPriceFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('upcoming');

  // Resolve canonical category object across slugs, IDs, and display names
  const activeCategoryObj = useMemo(() => {
    if (!category) return null;
    const norm = category.trim().toLowerCase();
    return (
      categories.find(
        (c) =>
          (c.slug && c.slug.toLowerCase() === norm) ||
          c.id.toLowerCase() === norm ||
          c.name.toLowerCase() === norm
      ) || null
    );
  }, [category, categories]);

  // Update category and sync to URL
  const handleCategoryChange = (newCat) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newCat) {
          next.set('category', newCat);
        } else {
          next.delete('category');
        }
        return next;
      },
      { replace: true }
    );
  };

  // Update search query and sync to URL
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newSearch.trim()) {
          next.set('q', newSearch.trim());
        } else {
          next.delete('q');
        }
        return next;
      },
      { replace: true }
    );
  };

  // Clear all filters and remove query params from URL
  const handleClearFilters = () => {
    setSearch('');
    setDateFilter('all');
    setPriceFilter('all');
    setAvailabilityFilter('all');
    setSortBy('upcoming');
    setSearchParams({}, { replace: true });
  };

  // Published events only (spec rule: do not expose drafts, pending, or rejected)
  const publishedEvents = useMemo(() => {
    return events.filter((e) => e.status === 'published' || e.status === 'completed');
  }, [events]);

  // Filter & Search logic
  const filteredEvents = useMemo(() => {
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
          if (activeCategoryObj) {
            if (evt.categoryId !== activeCategoryObj.id) return false;
          } else {
            // Category was specified but matches no known category
            const norm = category.trim().toLowerCase();
            if (evt.categoryId.toLowerCase() !== norm) return false;
          }
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
    activeCategoryObj,
    dateFilter,
    priceFilter,
    availabilityFilter,
    sortBy,
    getEventCapacityStats,
    now,
  ]);

  return (
    <div className="container events-page">
      <div className="events-header">
        <h1>Explore Campus Events</h1>
        <p className="text-secondary text-sm">
          Browse upcoming lectures, hackathons, job fairs, workshops and club gatherings.
        </p>
      </div>

      <EventFilters
        search={search}
        setSearch={handleSearchChange}
        category={activeCategoryObj ? (activeCategoryObj.slug || activeCategoryObj.id) : category}
        setCategory={handleCategoryChange}
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
        <div className="events-results-grid">
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
