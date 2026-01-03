'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, X, AlertCircle, User, FileText, CreditCard, Gift } from 'lucide-react'
import { api } from '@/lib/api'
import type { Notification } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface NotificationBellProps {
  isAdmin: boolean
}

export default function NotificationBell({ isAdmin }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [isAdmin])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const { count } = isAdmin
        ? await api.getAdminUnreadNotificationCount()
        : await api.getClientUnreadNotificationCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch notification count:', error)
    }
  }

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const data = isAdmin
        ? await api.getAdminNotifications()
        : await api.getClientNotifications()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications()
    }
    setIsOpen(!isOpen)
  }

  const handleMarkRead = async (id: number) => {
    try {
      isAdmin
        ? await api.markAdminNotificationRead(id)
        : await api.markClientNotificationRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification read:', error)
    }
  }

  const handleAcknowledge = async (id: number) => {
    try {
      await api.acknowledgeNotification(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_acknowledged: true, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to acknowledge notification:', error)
    }
  }

  const handleRespondOffer = async (id: number, accepted: boolean) => {
    try {
      await api.respondToOffer(id, accepted)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, offer_accepted: accepted, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to respond to offer:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      isAdmin
        ? await api.markAllAdminNotificationsRead()
        : await api.markAllClientNotificationsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'profile_change':
      case 'business_change':
        return <User className="w-4 h-4" />
      case 'offer':
        return <Gift className="w-4 h-4" />
      case 'payment':
        return <CreditCard className="w-4 h-4" />
      case 'report':
        return <FileText className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'profile_change':
      case 'business_change':
        return 'text-blue-500 bg-blue-50'
      case 'offer':
        return 'text-purple-500 bg-purple-50'
      case 'payment':
        return 'text-green-500 bg-green-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl border border-border shadow-lg z-50 max-h-[500px] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-accent hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-text-muted">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-bg-secondary transition-colors ${
                      !notification.is_read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.notification_type)}`}>
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-text-primary text-sm">
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkRead(notification.id)}
                              className="text-text-muted hover:text-accent p-1"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-text-muted mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>

                        {/* Show changed fields if profile/business change */}
                        {(notification.notification_type === 'profile_change' ||
                          notification.notification_type === 'business_change') &&
                          notification.changed_fields && (
                            <div className="mt-2 p-2 bg-bg-secondary rounded-lg text-xs">
                              <p className="font-medium text-text-secondary mb-1">Changed fields:</p>
                              <div className="flex flex-wrap gap-1">
                                {notification.changed_fields.map((field) => (
                                  <Badge key={field} variant="default">{field}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Acknowledge button for profile changes (client only) */}
                        {!isAdmin &&
                          (notification.notification_type === 'profile_change' ||
                            notification.notification_type === 'business_change') &&
                          !notification.is_acknowledged && (
                            <button
                              onClick={() => handleAcknowledge(notification.id)}
                              className="mt-2 px-3 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent/90 transition-colors"
                            >
                              Acknowledge Changes
                            </button>
                          )}

                        {/* Show acknowledged status */}
                        {notification.is_acknowledged && (
                          <div className="mt-2 flex items-center gap-1 text-green-600 text-xs">
                            <Check className="w-3 h-3" />
                            Acknowledged
                          </div>
                        )}

                        {/* Offer response buttons (client only) */}
                        {!isAdmin &&
                          notification.notification_type === 'offer' &&
                          notification.offer_accepted === null && (
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => handleRespondOffer(notification.id, true)}
                                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleRespondOffer(notification.id, false)}
                                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                              >
                                <X className="w-4 h-4" />
                                Decline
                              </button>
                            </div>
                          )}

                        {/* Show offer response status */}
                        {notification.notification_type === 'offer' &&
                          notification.offer_accepted !== null && (
                            <div className={`mt-2 flex items-center gap-1 text-xs ${
                              notification.offer_accepted ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {notification.offer_accepted ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  Offer accepted
                                </>
                              ) : (
                                <>
                                  <X className="w-3 h-3" />
                                  Offer declined
                                </>
                              )}
                            </div>
                          )}

                        <p className="text-xs text-text-muted mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
