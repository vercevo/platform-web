"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Server, Users, Shield, Lock, Clock, Gamepad2 } from 'lucide-react'

interface Player {
  name: string
  score: number
  duration: number
}

interface ServerData {
  last_status_update: string
  error: string | null
  server_name: string
  server_type: string
  platform: string
  player_count: number
  password_protected: boolean
  vac_enabled: boolean
  port: number
  steam_id: number
  keywords: string
  game_id: number
  players: Player[]
}

export default function ValheimServerStatus() {
  const [serverData, setServerData] = useState<ServerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_VALHEIM_BACKEND_URL!)
        if (!response.ok) {
          throw new Error('Failed to fetch server data')
        }
        const data = await response.json()
        setServerData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchServerData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchServerData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatLastUpdate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <Server className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-medium">Failed to load server data</p>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!serverData) return null

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Server Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">{serverData.server_name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last updated: {formatLastUpdate(serverData.last_status_update)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {serverData.password_protected && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Password Protected
                </Badge>
              )}
              {serverData.vac_enabled && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  VAC Enabled
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Server Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{serverData.player_count}</p>
                <p className="text-sm text-muted-foreground">Players Online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{serverData.port}</p>
                <p className="text-sm text-muted-foreground">Port</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-lg font-semibold">{serverData.platform === 'l' ? 'Linux' : 'Windows'}</p>
              <p className="text-sm text-muted-foreground">Platform</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-lg font-semibold">{serverData.keywords}</p>
              <p className="text-sm text-muted-foreground">Version</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Players List */}
      {serverData.players && serverData.players.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Players ({serverData.players.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serverData.players.map((player, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {player.name || `Player ${index + 1}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Score: {player.score}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDuration(player.duration)}
                    </div>
                  </div>
                  {index < serverData.players.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Server Details */}
      <Card>
        <CardHeader>
          <CardTitle>Server Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Steam ID</p>
              <p className="font-mono">{serverData.steam_id}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Game ID</p>
              <p>{serverData.game_id}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Server Type</p>
              <p>{serverData.server_type === 'd' ? 'Dedicated' : 'Listen'}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Status</p>
              <Badge variant={serverData.error ? "destructive" : "default"}>
                {serverData.error ? "Error" : "Online"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
