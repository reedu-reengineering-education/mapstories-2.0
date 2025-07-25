import { PageHeader } from '@/src/components/PageHeader';
import React from 'react';

export default function PageContent() {
  return (
    <div className="max-w-7xl mx-auto mt-4">
      <div className="bg-white p-4 rounded shadow max-h-[80vh] overflow-y-auto space-y-4 text-sm leading-relaxed flex flex-col gap-4">
        <PageHeader heading="Datenschutzerklärung" />

        <h2 className="font-semibold">
          1) Information über die Erhebung personenbezogener Daten und
          Kontaktdaten des Verantwortlichen
        </h2>
        <div>
          <strong>1.1</strong> Wir freuen uns, dass Sie unsere Website besuchen
          und bedanken uns für Ihr Interesse. Im Folgenden informieren wir Sie
          über den Umgang mit Ihren personenbezogenen Daten bei der Nutzung
          unserer Website. Personenbezogene Daten sind hierbei alle Daten, mit
          denen Sie persönlich identifiziert werden können.
        </div>
        <div>
          <strong>1.2</strong> Verantwortlicher für die Datenverarbeitung auf
          dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
          <ul>
            <li>Reedu GmbH & Co. KG</li>
            <li>Von-Steuben-Str. 21, 48143 Münster Deutschland</li>
            <li>Tel.: +49 (0) 251 98119797</li>
            <li>E-Mail: kontakt@reedu.de</li>
          </ul>
          <br></br>
          Der für die Verarbeitung von personenbezogenen Daten Verantwortliche
          ist diejenige natürliche oder juristische Person, die allein oder
          gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von
          personenbezogenen Daten entscheidet.
        </div>
        <div>
          <strong>1.3</strong> Diese Website nutzt aus Sicherheitsgründen und
          zum Schutz der Übertragung personenbezogener Daten und anderer
          vertraulicher Inhalte (z.B. Bestellungen oder Anfragen an den
          Verantwortlichen) eine SSL-bzw. TLS-Verschlüsselung. Sie können eine
          verschlüsselte Verbindung an der Zeichenfolge „https://“ und dem
          Schloss-Symbol in Ihrer Browserzeile erkennen.
        </div>

        <h2 className="font-semibold">
          2) Datenerfassung beim Besuch unserer Website
        </h2>
        <div>
          Bei der bloß informatorischen Nutzung unserer Website, also wenn Sie
          sich nicht registrieren oder uns anderweitig Informationen
          übermitteln, erheben wir nur solche Daten, die Ihr Browser an unseren
          Server übermittelt (sog. „Server-Logfiles“). Wenn Sie unsere Website
          aufrufen, erheben wir die folgenden Daten, die für uns technisch
          erforderlich sind, um Ihnen die Website anzuzeigen:
          <ul className="list-disc pl-6">
            <li>Unsere besuchte Website</li>
            <li>Datum und Uhrzeit zum Zeitpunkt des Zugriffes</li>
            <li>Menge der gesendeten Daten in Byte</li>
            <li>Quelle/Verweis, von welchem Sie auf die Seite gelangten</li>
            <li>Verwendeter Browser</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Verwendete IP-Adresse (ggf.: in anonymisierter Form)</li>
          </ul>
          Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis
          unseres berechtigten Interesses an der Verbesserung der Stabilität und
          Funktionalität unserer Website. Eine Weitergabe oder anderweitige
          Verwendung der Daten findet nicht statt. Wir behalten uns allerdings
          vor, die Server-Logfiles nachträglich zu überprüfen, sollten konkrete
          Anhaltspunkte auf eine rechtswidrige Nutzung hinweisen.
        </div>

        <h2 className="font-semibold">3) Cookies</h2>
        <div>
          Um den Besuch unserer Website attraktiv zu gestalten und die Nutzung
          bestimmter Funktionen zu ermöglichen, verwenden wir auf verschiedenen
          Seiten sogenannte Cookies. Hierbei handelt es sich um kleine
          Textdateien, die auf Ihrem Endgerät abgelegt werden. Einige der von
          uns verwendeten Cookies werden nach dem Ende der Browser-Sitzung, also
          nach Schließen Ihres Browsers, wieder gelöscht (sog.
          Sitzungs-Cookies). Andere Cookies verbleiben auf Ihrem Endgerät und
          ermöglichen, Ihren Browser beim nächsten Besuch wiederzuerkennen (sog.
          persistente Cookies). Werden Cookies gesetzt, erheben und verarbeiten
          diese im individuellen Umfang bestimmte Nutzerinformationen wie
          Browser- und Standortdaten sowie IP-Adresswerte. Persistente Cookies
          werden automatisiert nach einer vorgegebenen Dauer gelöscht, die sich
          je nach Cookie unterscheiden kann. Die Dauer der jeweiligen
          Cookie-Speicherung können Sie der Übersicht zu den
          Cookie-Einstellungen Ihres Webbrowsers entnehmen. Teilweise dienen die
          Cookies dazu, durch Speicherung von Einstellungen den Bestellprozess
          zu vereinfachen (z.B. Merken des Inhalts eines virtuellen Warenkorbs
          für einen späteren Besuch auf der Website). Sofern durch einzelne von
          uns eingesetzte Cookies auch personenbezogene Daten verarbeitet
          werden, erfolgt die Verarbeitung gemäß Art. 6 Abs. 1 lit. b DSGVO
          entweder zur Durchführung des Vertrages, gemäß Art. 6 Abs. 1 lit. a
          DSGVO im Falle einer erteilten Einwilligung oder gemäß Art. 6 Abs. 1
          lit. f DSGVO zur Wahrung unserer berechtigten Interessen an der
          bestmöglichen Funktionalität der Website sowie einer
          kundenfreundlichen und effektiven Ausgestaltung des Seitenbesuchs.
          Bitte beachten Sie, dass Sie Ihren Browser so einstellen können, dass
          Sie über das Setzen von Cookies informiert werden und einzeln über
          deren Annahme entscheiden oder die Annahme von Cookies für bestimmte
          Fälle oder generell ausschließen können. Jeder Browser unterscheidet
          sich in der Art, wie er die Cookie-Einstellungen verwaltet. Diese ist
          in dem Hilfemenü jedes Browsers beschrieben, welches Ihnen erläutert,
          wie Sie Ihre Cookie-Einstellungen ändern können. Diese finden Sie für
          die jeweiligen Browser unter den folgenden Links:
          <ul className="list-disc pl-6">
            <li>
              Microsoft Edge:{' '}
              <a
                className="text-blue-600 hover:underline"
                href="https://support.microsoft.com/de-de/help/4468242/microsoft-edge-help"
              >
                https://support.microsoft.com/de-de/help/4468242/microsoft-edge-help
              </a>
            </li>
            <li>
              Internet Explorer:{' '}
              <a
                className="text-blue-600 hover:underline"
                href="https://support.microsoft.com/de-de/help/17442/windows-internet-explorer-delete-manage-cookies"
              >
                https://support.microsoft.com/de-de/help/17442/windows-internet-explorer-delete-manage-cookies
              </a>
            </li>
            <li>
              Firefox:{' '}
              <a
                className="text-blue-600 hover:underline"
                href="https://support.mozilla.org/de/kb/cookies-erlaub        en-und-ablehnen"
              >
                https://support.mozilla.org/de/kb/cookies-erlauben-und-ablehnen
              </a>
            </li>
            <li>
              Chrome:{' '}
              <a
                className="text-blue-600 hover:underline"
                href="https://support.google.com/chrome/answer/95647
?hl=de&hlrm=en"
              >
                https://support.google.com/chrome/answer/95647?hl=de&hlrm=en
              </a>
            </li>
            <li>
              Safari:{' '}
              <a
                className="text-blue-600 hover:underline"
                href="https://support.apple.com/de-de/guide/safari/sfri11471/mac"
              >
                https://support.apple.com/de-de/guide/safari/sfri11471/mac
              </a>
            </li>
            <li>
              Opera:{' '}
              <a
                className="text-blue-600 hover:underline"
                href="https://help.opera.com/de/latest/web-preferences/#
cookies"
              >
                https://help.opera.com/de/latest/web-preferences/#cookies
              </a>
            </li>
          </ul>
          Bitte beachten Sie, dass bei Nichtannahme von Cookies die
          Funktionalität unserer Website eingeschränkt sein kann.
        </div>

        <h2 className="font-semibold">4) Kontaktaufnahme</h2>
        <div>
          Im Rahmen der Kontaktaufnahme mit uns (z.B. per Kontaktformular oder
          E-Mail) werden personenbezogene Daten erhoben. Welche Daten im Falle
          der Nutzung eines Kontaktformulars erhoben werden, ist aus dem
          jeweiligen Kontaktformular ersichtlich. Diese Daten werden
          ausschließlich zum Zweck der Beantwortung Ihres Anliegens bzw. für die
          Kontaktaufnahme und die damit verbundene technische Administration
          gespeichert und verwendet. Rechtsgrundlage für die Verarbeitung dieser
          Daten ist unser berechtigtes Interesse an der Beantwortung Ihres
          Anliegens gemäß Art. 6 Abs. 1 lit. f DSGVO. Zielt Ihre Kontaktierung
          auf den Abschluss eines Vertrages ab, so ist zusätzliche
          Rechtsgrundlage für die Verarbeitung Art. 6 Abs. 1 lit. b DSGVO. Ihre
          Daten werden nach abschließender Bearbeitung Ihrer Anfrage gelöscht.
          Dies ist der Fall, wenn sich aus den Umständen entnehmen lässt, dass
          der betroffene Sachverhalt abschließend geklärt ist und sofern keine
          gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </div>

        <h2 className="font-semibold">5) Webanalysedienste</h2>
        <div>
          Matomo (ehemals Piwik) <br></br>
          Auf dieser Website werden unter Einsatz der Webanalysedienst-Software
          Matomo (www.matomo.org), einem Dienst des Anbieters InnoCraft Ltd.,
          150 Willis St, 6011 Wellington, Neuseeland, („Matomo“) auf Basis
          unseres berechtigten Interesses an der statistischen Analyse des
          Nutzerverhaltens zu Optimierungs- und Marketingzwecken gemäß Art. 6
          Abs. 1 lit. f DSGVO Daten gesammelt und gespeichert. Aus diesen Daten
          können zum selben Zweck pseudonymisierte Nutzungsprofile erstellt und
          ausgewertet werden. Hierzu können Cookies eingesetzt werden. Bei
          Cookies handelt es sich um kleine Textdateien, die lokal im
          Zwischenspeicher des Internet-Browsers des Seitenbesuchers gespeichert
          werden. Die Cookies ermöglichen unter anderem die Wiedererkennung des
          Internet-Browsers. Die mit der Matomo-Technologie erhobenen Daten
          (einschließlich Ihrer pseudonymisierten IP-Adresse) werden auf unseren
          Servern verarbeitet. Die durch das Cookie erzeugten Informationen im
          pseudonymen Nutzerprofil werden nicht dazu benutzt, den Besucher
          dieser Website persönlich zu identifizieren und nicht mit
          personenbezogenen Daten über den Träger des Pseudonyms
          zusammengeführt. Wenn Sie mit der Speicherung und Auswertung dieser
          Daten aus Ihrem Besuch nicht einverstanden sind, dann können Sie der
          Speicherung und Nutzung für die Zukunft per Mausklick jederzeit
          widersprechen. In diesem Fall wird in Ihrem Browser ein sog.
          Opt-Out-Cookie abgelegt, mit der Folge, dass Matomo keinerlei
          Sitzungsdaten erhebt. Bitte beachten Sie, dass die vollständige
          Löschung Ihrer Cookies zur Folge, dass auch das Opt-Out-Cookie
          gelöscht wird und ggf. von Ihnen erneut aktiviert werden muss. Soweit
          rechtlich erforderlich, haben wir zur vorstehend dargestellten
          Verarbeitung Ihrer Daten Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a
          DSGVO eingeholt. Sie können Ihre erteilte Einwilligung jederzeit mit
          Wirkung für die Zukunft widerrufen. Um Ihren Widerruf auszuüben,
          deaktivieren Sie diesen Dienst bitte in dem auf der Webseite
          bereitgestellten „Cookie-Consent-Tool“.
        </div>

        <h2 className="font-semibold">6) Einbettung von Videos</h2>
        <div>
          Auf unserer Website sind Videos externer Plattformen wie z. B.
          YouTube, Facebook, Instagram oder vergleichbarer Dienste eingebettet.
          Diese Einbettungen erfolgen im Interesse einer ansprechenden und
          informativen Darstellung unserer Online-Angebote gemäß Art. 6 Abs. 1
          lit. f DSGVO. Dabei handelt es sich um sogenannte „Plugins“ oder
          „Embed“-Funktionen, die von den jeweiligen Anbietern bereitgestellt
          werden.
        </div>
        <div>
          Bereits beim Aufruf einer Seite mit eingebettetem Video kann – je nach
          Plattform – eine Verbindung zu den Servern des jeweiligen Anbieters
          hergestellt werden, unabhängig davon, ob das Video aktiv abgespielt
          wird. Dabei können personenbezogene Daten (z. B. Ihre IP-Adresse,
          Browserinformationen, Gerätedaten, ggf. Referrer-URL) übermittelt
          werden. Wenn Sie gleichzeitig bei einem dieser Dienste eingeloggt
          sind, kann der Anbieter den Seitenaufruf Ihrem Benutzerkonto zuordnen.
        </div>
        <div>
          Wir nutzen für die Einbettung von YouTube-Videos den sogenannten
          erweiterten Datenschutzmodus, sofern dieser vom Anbieter zur Verfügung
          gestellt wird. Laut Angaben von YouTube werden in diesem Modus erst
          beim Starten des Videos personenbezogene Daten verarbeitet. Für andere
          Plattformen (z. B. Facebook oder Instagram) gelten deren jeweilige
          Datenschutzbestimmungen.
        </div>
        <div>
          Bitte beachten Sie, dass wir keinen Einfluss auf Umfang, Art und Zweck
          der Datenverarbeitung durch die Drittanbieter haben. Nähere
          Informationen zur Datenverarbeitung durch die jeweiligen Anbieter
          finden Sie in deren Datenschutzerklärungen:
        </div>

        <ul>
          <li>
            YouTube (Google Ireland Limited):{' '}
            <a
              className="text-blue-600 hover:underline"
              href="https://policies.google.com/privacy?hl=de"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://policies.google.com/privacy?hl=de
            </a>
          </li>
          <li>
            Meta (Facebook & Instagram):{' '}
            <a
              className="text-blue-600 hover:underline"
              href="https://www.facebook.com/privacy/policy"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://www.facebook.com/privacy/policy
            </a>
          </li>
          <li>
            Weitere Plattformen: siehe Datenschutzhinweise des jeweiligen
            Anbieters
          </li>
        </ul>

        <div>
          Sofern eine entsprechende Einwilligung abgefragt wurde (z. B. über ein
          Cookie-Consent-Tool), erfolgt die Verarbeitung ausschließlich auf
          Grundlage von Art. 6 Abs. 1 lit. a DSGVO. Diese Einwilligung ist
          jederzeit widerrufbar.
        </div>

        <h2 className="font-semibold">7) Ihre Rechte als betroffene Person</h2>
        <div>
          Das geltende Datenschutzrecht gewährt Ihnen gegenüber dem
          Verantwortlichen hinsichtlich der Verarbeitung Ihrer personenbezogenen
          Daten umfassende Betroffenenrechte (Auskunfts- und
          Interventionsrechte), über die wir Sie nachstehend informieren:
          <br></br>
          <ul className="list-disc pl-6">
            <li>
              Auskunftsrecht gemäß Art. 15 DSGVO: Sie haben insbesondere ein
              Recht auf Auskunft über Ihre von uns verarbeiteten
              personenbezogenen Daten, die Verarbeitungszwecke, die Kategorien
              der verarbeiteten personenbezogenen Daten, die Empfänger oder
              Kategorien von Empfängern, gegenüber denen Ihre Daten offengelegt
              wurden oder werden, die geplante Speicherdauer bzw. die Kriterien
              für die Festlegung der Speicherdauer, das Bestehen eines Rechts
              auf Berichtigung, Löschung, Einschränkung der Verarbeitung,
              Widerspruch gegen die Verarbeitung, Beschwerde bei einer
              Aufsichtsbehörde, die Herkunft Ihrer Daten, wenn diese nicht durch
              uns bei Ihnen erhoben wurden, das Bestehen einer automatisierten
              Entscheidungsfindung einschließlich Profiling und ggf.
              aussagekräftige Informationen über die involvierte Logik und die
              Sie betreffende Tragweite und die angestrebten Auswirkungen einer
              solchen Verarbeitung, sowie Ihr Recht auf Unterrichtung, welche
              Garantien gemäß Art. 46 DSGVO bei Weiterleitung Ihrer Daten in
              Drittländer bestehen;
            </li>
            <li>
              Recht auf Berichtigung gemäß Art. 16 DSGVO: Sie haben ein Recht
              auf unverzügliche Berichtigung Sie betreffender unrichtiger Daten
              und/oder Vervollständigung Ihrer bei uns gespeicherten
              unvollständigen Daten;
            </li>
            <li>
              Recht auf Löschung gemäß Art. 17 DSGVO: Sie haben das Recht, die
              Löschung Ihrer personenbezogenen Daten bei Vorliegen der
              Voraussetzungen des Art. 17 Abs. 1 DSGVO zu verlangen. Dieses
              Recht besteht jedoch insbesondere dann nicht, wenn die
              Verarbeitung zur Ausübung des Rechts auf freie Meinungsäußerung
              und Information, zur Erfüllung einer rechtlichen Verpflichtung,
              aus Gründen des öffentlichen Interesses oder zur Geltendmachung,
              Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist;
            </li>
            <li>
              Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO: Sie
              haben das Recht, die Einschränkung der Verarbeitung Ihrer
              personenbezogenen Daten zu verlangen, solange die von Ihnen
              bestrittene Richtigkeit Ihrer Daten überprüft wird, wenn Sie eine
              Löschung Ihrer Daten wegen unzulässiger Datenverarbeitung ablehnen
              und stattdessen die Einschränkung der Verarbeitung Ihrer Daten
              verlangen, wenn Sie Ihre Daten zur Geltendmachung, Ausübung oder
              Verteidigung von Rechtsansprüchen benötigen, nachdem wir diese
              Daten nach Zweckerreichung nicht mehr benötigen oder wenn Sie
              Widerspruch aus Gründen Ihrer besonderen Situation eingelegt
              haben, solange noch nicht feststeht, ob unsere berechtigten Gründe
              überwiegen;
            </li>
            <li>
              Recht auf Unterrichtung gemäß Art. 19 DSGVO: Haben Sie das Recht
              auf Berichtigung, Löschung oder Einschränkung der Verarbeitung
              gegenüber dem Verantwortlichen geltend gemacht, ist dieser
              verpflichtet, allen Empfängern, denen die Sie betreffenden
              personenbezogenen Daten offengelegt wurden, diese Berichtigung
              oder Löschung der Daten oder Einschränkung der Verarbeitung
              mitzuteilen, es sei denn, dies erweist sich als unmöglich oder ist
              mit einem unverhältnismäßigen Aufwand verbunden. Ihnen steht das
              Recht zu, über diese Empfänger unterrichtet zu werden.
            </li>
            <li>
              Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO: Sie haben das
              Recht, Ihre personenbezogenen Daten, die Sie uns bereitgestellt
              haben, in einem strukturierten, gängigen und maschinenlesebaren
              Format zu erhalten oder die Übermittlung an einen anderen
              Verantwortlichen zu verlangen, soweit dies technisch machbar ist;
            </li>
            <li>
              Recht auf Widerruf erteilter Einwilligungen gemäß Art. 7 Abs. 3
              DSGVO: Sie haben das Recht, eine einmal erteilte Einwilligung in
              die Verarbeitung von Daten jederzeit mit Wirkung für die Zukunft
              zu widerrufen. Im Falle des Widerrufs werden wir die betroffenen
              Daten unverzüglich löschen, sofern eine weitere Verarbeitung nicht
              auf eine Rechtsgrundlage zur einwilligungslosen Verarbeitung
              gestützt werden kann. Durch den Widerruf der Einwilligung wird die
              Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf
              erfolgten Verarbeitung nicht berührt;
            </li>
            <li>
              Recht auf Beschwerde gemäß Art. 77 DSGVO: Wenn Sie der Ansicht
              sind, dass die Verarbeitung der Sie betreffenden personenbezogenen
              Daten gegen die DSGVO verstößt, haben Sie - unbeschadet eines
              anderweitigen verwaltungsrechtlichen oder gerichtlichen
              Rechtsbehelfs - das Recht auf Beschwerde bei einer
              Aufsichtsbehörde, insbesondere in dem Mitgliedstaat Ihres
              Aufenthaltsortes, Ihres Arbeitsplatzes oder des Ortes des
              mutmaßlichen Verstoßes.
            </li>
          </ul>
        </div>
        <h2 className="font-semibold">
          8) Dauer der Speicherung personenbezogener Daten
        </h2>
        <div>
          Die Dauer der Speicherung von personenbezogenen Daten bemisst sich
          anhand der jeweiligen Rechtsgrundlage, am Verarbeitungszweck und –
          sofern einschlägig – zusätzlich anhand der jeweiligen gesetzlichen
          Aufbewahrungsfrist (z.B. handels- und steuerrechtliche
          Aufbewahrungsfristen).
          <br></br>
          Bei der Verarbeitung von personenbezogenen Daten auf Grundlage einer
          ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO werden
          diese Daten so lange gespeichert, bis der Betroffene seine
          Einwilligung widerruft.
          <br></br>
          Existieren gesetzliche Aufbewahrungsfristen für Daten, die im Rahmen
          rechtsgeschäftlicher bzw. rechtsgeschäftsähnlicher Verpflichtungen auf
          der Grundlage von Art. 6 Abs. 1 lit. b DSGVO verarbeitet werden,
          werden diese Daten nach Ablauf der Aufbewahrungsfristen routinemäßig
          gelöscht, sofern sie nicht mehr zur Vertragserfüllung oder
          Vertragsanbahnung erforderlich sind und/oder unsererseits kein
          berechtigtes Interesse an der Weiterspeicherung fortbesteht.
          <br></br>
          Bei der Verarbeitung von personenbezogenen Daten auf Grundlage von
          Art. 6 Abs. 1 lit. f DSGVO werden diese Daten so lange gespeichert,
          bis der Betroffene sein Widerspruchsrecht nach Art. 21 Abs. 1 DSGVO
          ausübt, es sei denn, wir können zwingende schutzwürdige Gründe für die
          Verarbeitung nachweisen, die die Interessen, Rechte und Freiheiten der
          betroffenen Person überwiegen, oder die Verarbeitung dient der
          Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.
          <br></br>
          Bei der Verarbeitung von personenbezogenen Daten zum Zwecke der
          Direktwerbung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO werden
          diese Daten so lange gespeichert, bis der Betroffene sein
          Widerspruchsrecht nach Art. 21 Abs. 2 DSGVO ausübt.
          <br></br>
          Sofern sich aus den sonstigen Informationen dieser Erklärung über
          spezifische Verarbeitungssituationen nichts anderes ergibt, werden
          gespeicherte personenbezogene Daten im Übrigen dann gelöscht, wenn sie
          für die Zwecke, für die sie erhoben oder auf sonstige Weise
          verarbeitet wurden, nicht mehr notwendig sind.
        </div>

        <h1 className="font-semibold"> Widerspruchsrecht</h1>
        <div>
          WENN WIR IM RAHMEN EINER INTERESSENABWÄGUNG IHRE PERSONENBEZOGENEN
          DATEN AUFGRUND UNSERES ÜBERWIEGENDEN BERECHTIGTEN INTERESSES
          VERARBEITEN, HABEN SIE DAS JEDERZEITIGE RECHT, AUS GRÜNDEN, DIE SICH
          AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIESE VERARBEITUNG
          WIDERSPRUCH MIT WIRKUNG FÜR DIE ZUKUNFT EINZULEGEN. MACHEN SIE VON
          IHREM WIDERSPRUCHSRECHT GEBRAUCH, BEENDEN WIR DIE VERARBEITUNG DER
          BETROFFENEN DATEN. EINE WEITERVERARBEITUNG BLEIBT ABER VORBEHALTEN,
          WENN WIR ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG
          NACHWEISEN KÖNNEN, DIE IHRE INTERESSEN, GRUNDRECHTE UND
          GRUNDFREIHEITEN ÜBERWIEGEN, ODER WENN DIE VERARBEITUNG DER
          GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON RECHTSANSPRÜCHEN DIENT.
          WERDEN IHRE PERSONENBEZOGENEN DATEN VON UNS VERARBEITET, UM
          DIREKTWERBUNG ZU BETREIBEN, HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH
          GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM
          ZWECKE DERARTIGER WERBUNG EINZULEGEN. SIE KÖNNEN DEN WIDERSPRUCH WIE
          OBEN BESCHRIEBEN AUSÜBEN. MACHEN SIE VON IHREM WIDERSPRUCHSRECHT
          GEBRAUCH, BEENDEN WIR DIE VERARBEITUNG DER BETROFFENEN DATEN ZU
          DIREKTWERBEZWECKEN.
        </div>

        <PageHeader heading="Privacy Policy 🇬🇧" />
        <h2 className="text-lg font-bold pt-4">Data Protection Declaration</h2>

        <h2 className="font-semibold">
          1) Information on the Collection of Personal Data...
        </h2>
        <div>We are pleased that you are visiting our website...</div>

        <h2 className="font-semibold">
          2) Data Collection When You Visit Our Website
        </h2>
        <div>When using our website for information only...</div>

        <h2 className="font-semibold">3) Cookies</h2>
        <div>In order to make your visit to our website attractive...</div>

        <h2 className="font-semibold">4) Contacting Us</h2>
        <div>When you contact us via form or email...</div>

        <h2 className="font-semibold">
          5) Data Processing When Opening a Customer Account...
        </h2>
        <div>Personal data will continue to be collected and processed...</div>

        <h2 className="font-semibold">
          6) Use of Client Data for Direct Advertising
        </h2>
        <div>If you subscribe to our e-mail newsletter...</div>

        <h2 className="font-semibold">
          7) Processing of Data for the Purpose of Order Handling
        </h2>
        <div>
          The personal data collected by us will be passed on to the transport
          company...
        </div>

        <h2 className="font-semibold">8) Web Analysis Services</h2>
        <div>Matomo (formerly Piwik)...</div>

        <h2 className="font-semibold">9) Rights of the Data Subject</h2>
        <div>
          You have the right to information, correction, deletion, etc. under
          GDPR...
        </div>

        <h2 className="font-semibold">
          10) Duration of Storage of Personal Data
        </h2>
        <div>
          Storage duration is based on legal basis, purpose and statutory
          requirements...
        </div>
      </div>
    </div>
  );
}
