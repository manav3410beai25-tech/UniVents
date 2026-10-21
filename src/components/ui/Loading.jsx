import { Sparkles } from 'lucide-react';
import { Button } from './Button.jsx';

export function ButtonSpinner() {
  return <span className="button-spinner" aria-hidden="true" />;
}

export function AppLoadingScreen({ error, onRetry }) {
  return (
    <main className="app-loading" role="status" aria-live="polite" aria-busy={!error}>
      <div className="app-loading-brand">
        <span className="app-loading-mark"><Sparkles size={24} /></span>
        <span>Univents</span>
      </div>
      {error ? (
        <div className="app-loading-message" role="alert">
          <p>{error}</p>
          <Button onClick={onRetry}>Try again</Button>
        </div>
      ) : (
        <div className="app-loading-message">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Preparing your campus experience...</p>
        </div>
      )}
    </main>
  );
}

export function PageLoading({ label = 'Loading page...' }) {
  return <div className="page-loading" role="status" aria-live="polite"><span className="loading-spinner" aria-hidden="true" /><span>{label}</span></div>;
}

export function Skeleton({ className = '', width, height }) {
  return <span className={`skeleton ${className}`.trim()} aria-hidden="true" style={{ width, height }} />;
}

export function EventCardSkeleton() {
  return (
    <article className="card skeleton-card" aria-hidden="true">
      <Skeleton className="skeleton-banner" />
      <Skeleton width="34%" height="12px" />
      <Skeleton width="78%" height="20px" />
      <Skeleton width="92%" height="14px" />
      <Skeleton width="62%" height="14px" />
    </article>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="table-skeleton" role="status" aria-label="Loading table">
      {Array.from({ length: rows }, (_, row) => (
        <div className="table-skeleton-row" key={row}>
          {Array.from({ length: columns }, (_, column) => <Skeleton key={column} height="14px" />)}
        </div>
      ))}
    </div>
  );
}
