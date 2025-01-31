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
              gray: {
                700: '#4b5563',
                600: '#6b7280',
              },
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
          <div className="flex items-center">
            <Button
              className="bg-brand text-md mx-auto rounded-md px-4 py-2 font-medium text-white"
              href={resetLink}
            >
              Passwort zurücksetzen
            </Button>
          </div>

          <Text className="mt-4 text-sm text-gray-600">
            Hinweis: Der obige Link ist nur 1 Stunde lang gültig.
          </Text>
          <Text className="mt-6 text-sm text-gray-600">
            Wenn du diese Anfrage nicht gestellt hast, kannst du diese E-Mail
            ignorieren. Dein Passwort bleibt unverändert. Alternativ kannst du
            auch auf folgenden Link klicken oder kopieren und in deinen
            Webbrowser einfügen.
          </Text>
          <Text className="mt-6 text-sm text-gray-600">
            {' '}
            Alternativ kannst du auch auf folgenden Link klicken oder kopieren
            und in deinen Webbrowser einfügen.
          </Text>
          <div
            className="cursor-pointer break-all rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700"
            onClick={() => navigator.clipboard.writeText(resetLink)}
            title="Klicken, um den Link zu kopieren"
          >
            {resetLink}
          </div>
        </Container>
      </Html>
    </Tailwind>
  )
}
