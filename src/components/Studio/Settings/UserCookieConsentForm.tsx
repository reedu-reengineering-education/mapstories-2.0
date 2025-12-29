'use client'

import { Card } from '@/src/components/Card'
import {
  clearAllConsents,
  getAllConsentCookies,
} from '@/src/helper/getConsentCookies'
import { Button } from '../../Elements/Button'
import Switch from '../../Elements/Switch'
import EmbedIconFactory from '../../Icons/EmbedIconFactory'
import { getMediaPrivacyInfo } from '@/src/helper/embedPrivacy'
import { MediaType } from '@prisma/client'
import { useEffect, useState } from 'react'
import { toast } from '@/src/lib/toast'

export default function UserCookieConsentForm() {
  const [allCookies, setAllCookies] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setAllCookies(getAllConsentCookies())

  }, [])
  
  const submitCookies = () => {
    Object.entries(allCookies).forEach(([service, allowed]) => {
      document.cookie = `consent:${service}=${allowed}; path=/; max-age=${
        60 * 60 * 24 * 365
      }`
    })
    toast({
      message: 'Einstellungen gespeichert',
      type: 'success',
    })
  }



  return (
    <Card className=" ">
      <Card.Header>
        <Card.Title>Privatsphäre-Einstellungen</Card.Title>
      </Card.Header>

      <Card.Content className="space-y-6">
        {Object.entries(allCookies).length === 0 && (
          <p className="text-sm text-gray-600">
            Es wurden noch keine Cookie-Consents gesetzt.
          </p>
        )}

        {Object.entries(allCookies).map(([service, allowed]) => {
          const type = service.replace(/Consent$/, '') as MediaType
          const privacyUrl =
            getMediaPrivacyInfo(type)?.privacyPolicyUrl

          return (
            <div
              className="
                flex flex-col gap-3
                rounded-lg border border-gray-200
                p-4
                bg-gray-50
              "
              key={service}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                  <EmbedIconFactory type={type} />
                  <span>{type}</span>
                </div>

                {privacyUrl && (
                  <a
                    className="text-sm text-blue-600 underline"
                    href={privacyUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Datenschutzerklärung
                  </a>
                )}
              </div>

              {/* Toggle Row */}
              <div className="flex items-center gap-5">
                <span className="text-sm text-gray-700">
                  Externe Inhalte erlauben
                </span>

                <Switch
                  defaultChecked={allowed}
                  onCheckedChange={(e) =>
                    setAllCookies((prev) => ({
                      ...prev,
                      [service]: e,
                    }))

                  }
                />
              </div>
            </div>
          )
        })}

        {/* Danger Zone */}
        {Object.entries(allCookies).length > 0 && (
          <div className="pt-4 border-t justify-between border-gray-200 flex ">
                        <Button
              onClick={() => {
                clearAllConsents()
                window.location.reload()
              }}
              variant="danger"
            >
              Alle Consents löschen
            </Button>
            <Button 

              onClick={submitCookies}
              variant="primary"
            >
              Änderungen übernehmen
            </Button>


          </div>
        )}
      </Card.Content>
    </Card>
  )
}
