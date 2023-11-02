import { Html } from '@react-email/html'
import * as React from 'react'
import { Tailwind } from '@react-email/tailwind'
import { Head } from '@react-email/head'
import { Heading } from '@react-email/heading'
import { Text } from '@react-email/text'
import { Font } from '@react-email/font'
import { Container } from '@react-email/container'

interface SignInProps {
  url: string
}

export default function SignInEmail({ url }: SignInProps) {
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
        <title>Mapstories Login</title>
        <Font
          fallbackFontFamily="Helvetica"
          fontFamily="sans-serif"
          fontStyle="normal"
          fontWeight={400}
        />
      </Head>
      <Html>
        <Container>
          <Heading as="h2">Mapstories Login</Heading>
          <Text>
            Danke, dass Du Mapstories nutzen möchtest. Wir freuen uns sehr dich
            dabei zu haben. Um Mapstories nutzen zu können, melde dich bitte an:
          </Text>
          <Text>Kopieren diesen Link um dich anzumelden: {url}</Text>
        </Container>
      </Html>
    </Tailwind>
  )
}
