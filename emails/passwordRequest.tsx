import { Html } from '@react-email/html'
import * as React from 'react'
import { Tailwind } from '@react-email/tailwind'
import { Head } from '@react-email/head'
import { Heading } from '@react-email/heading'
import { Text } from '@react-email/text'
import { Font } from '@react-email/font'
import { Container } from '@react-email/container'

interface PasswordRequestProps {
  password: string
}

export default function PasswordRequest({ password }: PasswordRequestProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: '#38383a',
            },
          },
        },
      }}
    >
      <Head>
        <title>Mapstories Password Request</title>
        <Font
          fallbackFontFamily="Helvetica"
          fontFamily="sans-serif"
          fontStyle="normal"
          fontWeight={400}
        />
      </Head>
      <Html>
        <Container className="p-4">
          <Heading as="h2" className="text-brand text-lg font-bold">
            Mapstories Password Request
          </Heading>
          <Text className="text-base text-gray-700">
            Du hast ein neues Passwort für deinen Zugang bei Mapstories
            angefordert. Unten findest du dein neues Passwort:
          </Text>
          <Text className="mt-4 text-lg font-medium text-gray-900">
            Passwort: <span className="text-brand font-bold">{password}</span>
          </Text>
          <Text className="mt-4 text-sm text-gray-600">
            Bitte ändere dein Passwort nach dem Einloggen, um deine Sicherheit
            zu gewährleisten.
          </Text>
        </Container>
      </Html>
    </Tailwind>
  )
}
