'use client'

import { useEffect, useState } from 'react'
import { Package, Calendar, Check, AlertCircle, Gift, X } from 'lucide-react'
import { api } from '@/lib/api'
import type { ClientProfile, Notification } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function ClientPlanPage() {
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [offers, setOffers] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [respondingTo, setRespondingTo] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, notificationsData] = await Promise.all([
          api.getClientProfile(),
          api.getClientNotifications({ type: 'offer' }),
        ])
        setProfile(profileData)
        // Filter to only show pending offers
        setOffers(Array.isArray(notificationsData)
          ? notificationsData.filter(n => n.offer_accepted === null)
          : []
        )
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRespondOffer = async (id: number, accepted: boolean) => {
    setRespondingTo(id)
    try {
      await api.respondToOffer(id, accepted)
      setOffers(offers.filter(o => o.id !== id))
    } catch (error) {
      console.error('Failed to respond to offer:', error)
    } finally {
      setRespondingTo(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-text-muted">Loading plan details...</p>
        </div>
      </div>
    )
  }

  const plan = profile?.plan
  const isExpired = profile?.subscription_status === 'expired'
  const isActive = profile?.subscription_status === 'active'

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">My Plan</h1>

      {/* Special Offers */}
      {offers.length > 0 && (
        <div className="mb-6 space-y-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gift className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-purple-800">{offer.title}</h3>
                    <Badge variant="info">Special Offer</Badge>
                  </div>
                  <p className="text-sm text-purple-700 mb-3">{offer.message}</p>
                  {offer.offer_details?.discount_percent && (
                    <p className="text-lg font-bold text-purple-800 mb-3">
                      {offer.offer_details.discount_percent}% OFF
                    </p>
                  )}
                  {offer.offer_expires_at && (
                    <p className="text-xs text-purple-600 mb-3">
                      Expires: {new Date(offer.offer_expires_at).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleRespondOffer(offer.id, true)}
                      isLoading={respondingTo === offer.id}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept Offer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRespondOffer(offer.id, false)}
                      isLoading={respondingTo === offer.id}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!plan ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No active plan</h3>
          <p className="text-text-muted mb-4">You don&apos;t have an active subscription plan.</p>
          <p className="text-sm text-text-muted">Contact us to get started with a plan that fits your needs.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Plan Status Alert */}
          {isExpired && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Your subscription has expired</h3>
                <p className="text-sm text-red-600">
                  Please contact us to renew your subscription and continue enjoying our services.
                </p>
              </div>
            </div>
          )}

          {/* Plan Card */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="bg-primary p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <p className="text-white/70 mt-1">{plan.description}</p>
                </div>
                <Badge variant={isActive ? 'success' : 'danger'} className="text-sm">
                  {isActive ? 'Active' : 'Expired'}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              {/* Pricing */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-text-primary">${plan.price}</span>
                {plan.is_recurring && <span className="text-text-muted">/month</span>}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg">
                  <Calendar className="w-5 h-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Start Date</p>
                    <p className="font-medium text-text-primary">
                      {profile.subscription_start_date
                        ? new Date(profile.subscription_start_date).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg">
                  <Calendar className="w-5 h-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">End Date</p>
                    <p className={`font-medium ${isExpired ? 'text-red-600' : 'text-text-primary'}`}>
                      {profile.subscription_end_date
                        ? new Date(profile.subscription_end_date).toLocaleDateString()
                        : 'Ongoing'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              {plan.features && plan.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Plan Features</h3>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="p-1 bg-green-100 rounded-full">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-text-primary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-bg-secondary rounded-xl p-6 text-center">
            <p className="text-text-muted">
              Need to upgrade or have questions about your plan?
            </p>
            <p className="font-medium text-text-primary mt-1">
              Contact us at support@websiteandseoagency.com
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
