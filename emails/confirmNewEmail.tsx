import { Html } from '@react-email/html'
import * as React from 'react'
import { Tailwind } from '@react-email/tailwind'
import { Head } from '@react-email/head'
import { Heading } from '@react-email/heading'
import { Text } from '@react-email/text'
import { Font } from '@react-email/font'
import { Container } from '@react-email/container'
import { Button } from '@react-email/button'
interface SignInProps {
  url: string
}

export default function ConfirmNewEmail({ url }: SignInProps) {
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
        <title>Mapstories E-Mail bestätigen</title>
        <Font
          fallbackFontFamily="Helvetica"
          fontFamily="sans-serif"
          fontStyle="normal"
          fontWeight={400}
        />
      </Head>
      <Html>
        <Container>
          <Heading as="h2">Mapstories E-Mail bestätigen</Heading>
          <Text>
            Du möchtest deine E-Mail Adresse ändern? Dann bestätige deine neue E-Mail Adresse!
          </Text>
          Kopiere diesen Link in deinen Browser, um dich anzumelden / Copy this
          link to sign in / Copia este enlace para iniciar sesión / Copiez ce
          lien pour vous connecter:
          <br />
          <br />
          <Button
            className="bg-brand text-md mx-auto rounded-md px-4 py-2 font-medium text-white"
            href={url}
          >
            {' '}
            E-Mail bestätigen{' '}
          </Button>
        </Container>
      </Html>
    </Tailwind>
  )
}
