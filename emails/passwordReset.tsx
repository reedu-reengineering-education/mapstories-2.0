import { Html } from '@react-email/html'
import * as React from 'react'
import { Tailwind } from '@react-email/tailwind'
import { Head } from '@react-email/head'
import { Heading } from '@react-email/heading'
import { Text } from '@react-email/text'
import { Button } from '@react-email/button'
import { Font } from '@react-email/font'
import { Container } from '@react-email/container'

interface PasswordResetProps {
  resetLink: string
}

export default function PasswordReset({ resetLink }: PasswordResetProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: '#38383a',
              primary: '#1d4ed8', // Beispiel für einen blauen Button
            },
          },
        },
      }}
    >
      <Head>
        <title>Passwort zurücksetzen – Mapstories</title>
        <Font
          fallbackFontFamily="Helvetica"
          fontFamily="sans-serif"
          fontStyle="normal"
          fontWeight={400}
        />
      </Head>
      <Html>
        <Container className="p-6">
          <Heading as="h2" className="text-brand mb-4 text-2xl font-bold">
            Passwort zurücksetzen
          </Heading>
          <Text className="text-base text-gray-700">
            Du hast eine Anfrage zum Zurücksetzen deines Passworts für deinen
            Mapstories-Account gestellt. Um dein Passwort zu ändern, klicke
            bitte auf den untenstehenden Button:
          </Text>
          <Button
            className="mt-6 rounded-md bg-primary px-6 py-3 text-base font-semibold text-white"
            href={resetLink}
          >
            Passwort zurücksetzen
          </Button>
          <Text className="mt-6 text-sm text-gray-600">
            Wenn du diese Anfrage nicht gestellt hast, kannst du diese E-Mail
            ignorieren. Dein Passwort bleibt unverändert.
          </Text>
          <Text className="mt-6 text-sm text-gray-600">
            Solltest du weitere Hilfe benötigen, wende dich bitte an unseren
            Support.
          </Text>
        </Container>
      </Html>
    </Tailwind>
  )
}
