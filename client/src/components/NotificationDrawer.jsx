import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  CheckCircle2,
  Briefcase,
  UserCheck,
  Award,
  Sparkles,
  ExternalLink,
  Trash2,
  Clock,
  Layers,
} from 'lucide-react';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} from '../services/api';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'drive':
      return { icon: Briefcase, color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' };
    case 'shortlist':
      return { icon: UserCheck, color: 'text-violet-400 bg-violet-500/15 border-violet-500/30' };
    case 'placement':
      return { icon: Award, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' };
    case 'interview':
      return { icon: Sparkles, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' };
    default:
      return { icon: Bell, color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30' };
  }
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationDrawer = ({ isOpen, onClose, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadNotifications = () => {
    setLoading(true);
    fetchNotifications()
      .then((data) => {
        const list = data?.notifications || [];
        setNotifications(list);
        if (onUnreadCountChange) {
          onUnreadCountChange(data?.unreadCount || list.filter((n) => !n.read).length);
        }
      })
      .catch((err) => {
        console.error('Failed to load notifications:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      if (onUnreadCountChange) onUnreadCountChange(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.read) {
      try {
        await markNotificationRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
        if (onUnreadCountChange) {
          onUnreadCountChange((c) => Math.max(0, c - 1));
        }
      } catch (err) {
        console.error('Error marking read:', err);
      }
    }
    if (notif.link) {
      onClose();
      navigate(notif.link);
    }
  };

  const handleDismiss = async (e, id) => {
    e.stopPropagation();
    try {
      await dismissNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Error dismissing notification:', err);
    }
  };

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col bg-[#17172b]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl overflow-hidden text-white animate-slide-left">
        {/* Header */}
        <div className="p-6 border-b border-white/8 bg-gradient-to-r from-violet-600/10 via-cyan-600/5 to-transparent flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-lg shadow-violet-500/20">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#17172b] animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base tracking-tight">Placement Intelligence</h2>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-2.5 py-1 text-[11px] font-semibold text-violet-300 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Mark all as read"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-3 border-b border-white/5 bg-[#0f0f1a]/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'drive', label: 'Drives' },
            { id: 'shortlist', label: 'Shortlists' },
            { id: 'placement', label: 'Offers' },
            { id: 'interview', label: 'Interviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/8'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar-dark">
          {loading ? (
            <div className="space-y-3 p-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">No alerts in this category</p>
              <p className="text-xs text-slate-500 mt-1">You're all up to date!</p>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const { icon: CatIcon, color } = getCategoryIcon(n.category);
              return (
                <div
                  key={n._id}
                  onClick={() => handleItemClick(n)}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    !n.read
                      ? 'bg-white/[0.07] hover:bg-white/[0.1] border-violet-500/30 shadow-md'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 opacity-80'
                  }`}
                >
                  {/* Category icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${color}`}
                  >
                    <CatIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          !n.read ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1 shadow-sm shadow-cyan-400/50" />
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(n.createdAt)}
                      </span>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {n.link && (
                          <span className="text-violet-400 hover:text-violet-300 flex items-center gap-0.5 font-semibold">
                            <span>Open</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                        <button
                          onClick={(e) => handleDismiss(e, n._id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-0.5"
                          title="Dismiss"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#0f0f1a]/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live Webhooks Synced
          </span>
          <button
            onClick={loadNotifications}
            className="text-[11px] text-violet-400 hover:text-violet-300 font-semibold"
          >
            Refresh Feed
          </button>
        </div>
      </aside>
    </>
  );
};

export default NotificationDrawer;
