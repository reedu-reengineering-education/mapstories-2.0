import { PageHeader } from '@/src/components/PageHeader';
import React from 'react';

export default function PageContent() {
  return (
    <div className="max-w-7xl mx-auto mt-4">
      <div className="bg-white p-4 rounded shadow max-h-[80vh] overflow-y-auto">
        <PageHeader heading="Impressum" />
        <p><strong>Angaben gemäß § 5 TMG:</strong><br />
          Reedu GmbH & Co. KG<br />
          Von-Steuben-Str. 21<br />
          48143 Münster<br />
          Vertreten durch: Reedu Verwaltungs GmbH,<br />
          Geschäftsführer: Dr. Thomas Bartoschek, Umut Tas
        </p>

        <p><strong>Kontakt:</strong><br />
          Tel: +49 251 98119797<br />
          E-Mail: <a href="mailto:kontakt@reedu.de">kontakt@reedu.de</a>
        </p>

        <p><strong>Registereintrag:</strong><br />
          Amtsgericht Münster – HRA 10639
        </p>

        <p><strong>Umsatzsteuer-ID:</strong><br />
          DE317828779
        </p>

        <p><strong>Verantwortlich nach § 55 Abs. 2 RStV:</strong><br />
          Umut Tas<br />
          Von-Steuben-Str. 21<br />
          48143 Münster
        </p>

        <p><strong>Streitschlichtung:</strong><br />
          Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: <a href="https://ec.europa.eu/consumers/odr" rel="noopener noreferrer" target="_blank">https://ec.europa.eu/consumers/odr</a><br />
          Wir nehmen nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil.
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8–10 TMG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen. Bei Bekanntwerden von Rechtsverletzungen entfernen wir entsprechende Inhalte umgehend.
        </p>

        <h2>Haftung für Links</h2>
        <p>
          Unsere Website enthält Links zu externen Websites Dritter. Für deren Inhalte übernehmen wir keine Gewähr. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Eine permanente Kontrolle ist ohne konkrete Hinweise nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir entsprechende Links umgehend.
        </p>

        <h2>Urheberrecht</h2>
        <p>
          Die Inhalte dieser Website unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Downloads und Kopien sind nur für den privaten Gebrauch gestattet. Bei Bekanntwerden von Urheberrechtsverletzungen entfernen wir die betreffenden Inhalte umgehend.
        </p>
        <br></br>
        <h1>English Version 🇬🇧</h1>

        <p><strong>Information according to §5 TMG:</strong><br />
          Reedu GmbH & Co. KG<br />
          Von-Steuben-Str. 21, 48143 Münster<br />
          Represented by: Reedu Verwaltungs GmbH, Dr. Thomas Bartoschek & Umut Tas
        </p>

        <p><strong>Contact:</strong><br />
          Phone: +49 251 98119797<br />
          Email: <a href="mailto:kontakt@reedu.de">kontakt@reedu.de</a>
        </p>

        <p><strong>Register:</strong><br />
          Amtsgericht Münster – HRA 10639<br />
          VAT ID: DE317828779
        </p>

        <p><strong>Dispute Resolution:</strong><br />
          EU platform: <a href="https://ec.europa.eu/consumers/odr" rel="noopener noreferrer" target="_blank">https://ec.europa.eu/consumers/odr</a><br />
          We do not participate in consumer arbitration.
        </p>

        <p><strong>Liability & Copyright:</strong><br />
          We are liable for our own content under §7 TMG. We are not obligated to monitor third-party content (§§8–10 TMG). Linked content is the responsibility of the respective provider. Copyright laws apply to all content. Please inform us of any violations.
        </p>
      </div>
    </div>
  );
}
