import { Bell, CheckCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { formatRelativeTime } from '../../utils/dates.js';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: 800 }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>In-App Notifications</h1>
          <p className="text-secondary text-sm">
            Updates on registrations, attendance verifications, and event changes.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" icon={CheckCheck} onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => {
            const isUnread = !notif.readAt;

            return (
              <div
                key={notif.id}
                className="card notification-item"
                style={{
                  backgroundColor: isUnread ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                  borderLeft: isUnread ? '4px solid var(--primary)' : '1px solid var(--border-color)',
                }}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor:
                        notif.type === 'attendance'
                          ? 'var(--success-light)'
                          : notif.type === 'cancellation'
                          ? 'var(--error-light)'
                          : 'var(--primary-light)',
                      color:
                        notif.type === 'attendance'
                          ? 'var(--success-text)'
                          : notif.type === 'cancellation'
                          ? 'var(--error-text)'
                          : 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    {notif.type === 'attendance' ? (
                      <CheckCircle2 size={18} />
                    ) : notif.type === 'cancellation' ? (
                      <AlertCircle size={18} />
                    ) : (
                      <Bell size={18} />
                    )}
                  </div>

                  <div className="notification-item__body">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 style={{ fontSize: '0.95rem', fontWeight: isUnread ? 700 : 600 }}>
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            display: 'inline-block',
                            flexShrink: 0,
                          }}
                          aria-label="Unread"
                        />
                      )}
                    </div>
                    <p className="text-xs text-secondary" style={{ marginTop: '0.25rem', lineHeight: 1.5 }}>
                      {notif.message}
                    </p>
                    <span className="text-xs text-muted block" style={{ marginTop: '0.5rem' }}>
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                </div>

                {isUnread && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="btn btn-ghost btn-sm text-xs flex-shrink-0"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Mark read
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="You'll be notified here when you register for events, when attendance is verified, or when organizers make updates."
        />
      )}
    </div>
  );
}
