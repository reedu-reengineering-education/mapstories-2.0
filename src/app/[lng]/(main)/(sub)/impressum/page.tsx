import { PageHeader } from '@/src/components/PageHeader'

export default function Page() {
  return (
    <div>
      <PageHeader heading="Impressum"></PageHeader>
      <p>
        <h1 className="my-1">Angaben gemäß § 5 TMG: </h1>
        <h6>Reedu GmbH & Co. KG</h6>
        <h6>Von-Steuben-Str. 21</h6>
        <h6> 48143 Münster</h6>
        <h1 className="my-1">Vertreten durch:</h1>
        <h6>
          Reedu Verwaltungs GmbH, Vertreten durch die Geschäftsführer Dr. Thomas
          Bartoschek und Umut Tas
        </h6>
        <h1 className="my-1">Kontakt:</h1>
        <h6>Telefon: +49 251 98119797 </h6>
        <h6>E-Mail: kontakt@reedu.de</h6>
        <h1 className="my-1">Geschäftsführer:</h1>
        <h6>Dr. Thomas Bartoschek & Umut Tas</h6>
        <h1 className="my-1">Registereintrag:</h1>
        <h6>Eintragung im Handelsregister.</h6>
      </p>
    </div>
  )
}
