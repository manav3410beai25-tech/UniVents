import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input, Select } from '../../../components/ui/Input.jsx';
import { Button } from '../../../components/ui/Button.jsx';

export function EventFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories = [],
  dateFilter,
  setDateFilter,
  priceFilter,
  setPriceFilter,
  availabilityFilter,
  setAvailabilityFilter,
  sortBy,
  setSortBy,
  onClear,
}) {
  const hasActiveFilters =
    Boolean(search) ||
    Boolean(category) ||
    dateFilter !== 'all' ||
    priceFilter !== 'all' ||
    availabilityFilter !== 'all';

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Search bar row */}
        <div className="flex items-center gap-3">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by title, description, venue, or tags..."
              style={{ paddingLeft: '40px' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="upcoming">Upcoming Soonest</option>
              <option value="newest">Recently Added</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="capacity">Capacity (High-Low)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills / Dropdowns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Category Filter */}
          <div>
            <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Category
            </label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug || c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Schedule
            </label>
            <select
              className="form-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Any Date</option>
              <option value="upcoming">All Upcoming</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="past">Past / Completed</option>
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Ticket Price
            </label>
            <select
              className="form-select"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">Free & Paid</option>
              <option value="free">Free Only ($0)</option>
              <option value="paid">Paid Admission</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Availability
            </label>
            <select
              className="form-select"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Seats Available</option>
              <option value="full">Full Events</option>
            </select>
          </div>
        </div>

        {/* Clear Filters bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
            <span className="text-xs text-secondary">
              Active filters applied
            </span>
            <button
              onClick={onClear}
              className="btn btn-ghost btn-sm text-xs font-medium"
              style={{ color: 'var(--primary)', height: '28px', padding: '0 8px' }}
            >
              <X size={14} />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
