'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    location: '',
    website: '',
  })

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/users/profile')
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        const data = await response.json()
        setProfile(data)
        setFormData({
          display_name: data.display_name || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
        })
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/profile/${profile.handle}`)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-2xl px-4">
      {/* Header */}
      <div className="app-shell-header -mx-4 flex items-center gap-3 px-4">
        <Link href={`/profile/${profile?.handle}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="app-shell-title">Edit Profile</h1>
      </div>

      <Card className="mx-0 rounded-none border-x-0 border-t border-b-0 shadow-none">
        <CardContent className="p-6 pt-8 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Profile updated successfully! Redirecting...</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="display_name" className="text-sm font-medium">
                Display Name
              </label>
              <Input
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                placeholder="Your display name"
                disabled={saving}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                disabled={saving}
                maxLength={160}
                className="resize-none"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/160
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium">
                Website
              </label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                disabled={saving}
                type="url"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                asChild
              >
                <Link href={`/profile/${profile?.handle}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
