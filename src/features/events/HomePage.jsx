import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Sparkles, GraduationCap, Users, ShieldCheck } from 'lucide-react';
import { useEvents } from '../../context/EventContext.jsx';
import { EventCard } from './components/EventCard.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const LIGHT_HERO_VIDEO_SRC = `${import.meta.env.BASE_URL}videos/anime-sky.mp4`;
const DARK_HERO_VIDEO_SRC = `${import.meta.env.BASE_URL}videos/darkbackground.mp4`;

export function HomePage() {
  const { events, categories } = useEvents();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const clockSync = window.setTimeout(() => setCurrentTime(Date.now()), 0);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(motionQuery.matches);
    motionQuery.addEventListener('change', updateMotionPreference);
    return () => {
      window.clearTimeout(clockSync);
      motionQuery.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  const publishedEvents = events.filter((event) => event.status === 'published');
  const upcomingEvents = publishedEvents.filter((event) => new Date(event.startAt).getTime() > currentTime);

  // Deduplicate: prioritize featured events first, then remaining upcoming events, up to 6 unique events
  const featuredEvents = upcomingEvents.filter((event) => event.featured);
  const nonFeaturedEvents = upcomingEvents.filter((event) => !event.featured);
  const showcaseEvents = [...featuredEvents, ...nonFeaturedEvents].slice(0, 6);

  const activeCategories = categories.filter((category) => category.isActive);

  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="home-hero-title">
        <video
          key={isDark ? 'dark' : 'light'}
          className="hero__video"
          autoPlay={!prefersReducedMotion}
          muted
          loop={!prefersReducedMotion}
          playsInline
          preload={prefersReducedMotion ? 'auto' : 'metadata'}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={isDark ? DARK_HERO_VIDEO_SRC : LIGHT_HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="hero__overlay" aria-hidden="true" />
        <div className="hero__content">
          <p className="hero__eyebrow"><Sparkles size={15} /> THE CAMPUS EXPERIENCE</p>
          <h1 id="home-hero-title">Your campus,<br /><span>your next big moment.</span></h1>
          <p className="hero__description">Find the talks, shows, workshops and gatherings that make university feel like yours.</p>
          <div className="hero__actions">
            <Link to="/events" className="hero__cta">Explore events <ArrowRight size={16} /></Link>
            <Link to="/login?role=organizer" className="hero__secondary">Host an event</Link>
          </div>
        </div>
      </section>

      <section className="discovery-band" aria-label="Find a campus event">
        <div className="container discovery-band__inner">
          <div className="discovery-heading"><span className="section-kicker">Make a plan</span><h2>What are you in the mood for?</h2></div>
          <form className="home-search" onSubmit={(event) => { event.preventDefault(); navigate(`/events${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`); }}>
            <Search size={19} /><input aria-label="Search events" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, places, interests…" /><button type="submit">Search <ArrowRight size={15} /></button>
          </form>
          <div className="category-list" aria-label="Browse event categories">
            {activeCategories.map((category) => <Link key={category.id} to={`/events?category=${category.slug || category.id}`} className="category-chip">{category.name}<ArrowRight size={13} /></Link>)}
            <Link to="/events" className="category-chip category-chip--all">Browse all <ArrowRight size={13} /></Link>
          </div>
        </div>
      </section>

      <section className="event-section" aria-label="Campus event showcase">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Picked for campus</span>
              <h2>Worth stepping out for.</h2>
              <p>Standout moments and upcoming gatherings from across your university.</p>
            </div>
            <Link to="/events" className="section-more">
              Explore all events <ArrowRight size={16} />
            </Link>
          </div>
          {showcaseEvents.length ? (
            <div className="event-grid">
              {showcaseEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="event-empty">No upcoming events just yet. Check back soon.</p>
          )}
        </div>
      </section>

      <section className="campus-section">
        <div className="container">
          <div className="campus-intro"><span className="section-kicker">One campus, many ways in</span><h2>Make campus<br />feel a little smaller.</h2><p>Discover something to join, share something you care about, or help make a great campus event happen.</p></div>
          <div className="campus-features">
            <article className="campus-feature"><span className="campus-feature__icon"><GraduationCap size={20} /></span><h3>Find your people</h3><p>Browse university activities, reserve a place and keep your event details close.</p><Link to="/login?role=student">Student access <ArrowRight size={14} /></Link></article>
            <article className="campus-feature"><span className="campus-feature__icon"><Users size={20} /></span><h3>Bring an idea to life</h3><p>Shape an event, submit it for review and follow registrations in one place.</p><Link to="/login?role=organizer">Organizer access <ArrowRight size={14} /></Link></article>
            <article className="campus-feature"><span className="campus-feature__icon"><ShieldCheck size={20} /></span><h3>Keep things moving</h3><p>Review event submissions, manage categories and support a thriving campus calendar.</p><Link to="/login?role=admin">Administrator access <ArrowRight size={14} /></Link></article>
          </div>
        </div>
      </section>
    </div>
  );
}
