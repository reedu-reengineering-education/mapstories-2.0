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
          Server übermittelt (sog. &quot;Server-Logfiles&quot;). Wenn Sie unsere Website
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
          Information about the collection of personal data and contact details
          of the controller
        </h2>
        <div>
          <strong>1.1</strong> We are pleased that you are visiting our website
          and thank you for your interest. On the following pages, we inform you
          about the handling of your personal data when using our website.
          Personal data is all data with which you can be personally identified.
        </div>

        <div>
          <strong>1.2</strong>
          The controller in charge of data processing on this website, within
          the meaning of the General Data Protection Regulation (GDPR), is Reedu
          GmbH & Co. KG, Von-Steuben-Str. 21, 48143 Münster, Deutschland, Tel.:
          +49 (0) 251 98119797, E-Mail: kontakt@reedu.de. The controller in
          charge of the processing of personal data is the natural or legal
          person who alone or jointly with others determines the purposes and
          means of the processing of personal data.
        </div>
        <div>
          <strong>1.3 </strong>
          This website uses SSL or TLS encryption for security reasons and to
          protect the transmission of personal data and other confidential
          content (e.g. orders or inquiries to the controller). You can
          recognize an encrypted connection by the character string https:// and
          the lock symbol in your browser line.
        </div>
        <h2 className="font-semibold">
          2) Data Collection When You Visit Our Website
        </h2>
        <div>
          When using our website for information only, i.e. if you do not
          register or otherwise provide us with information, we only collect
          data that your browser transmits to our server (so-called &quot;server log
          files&quot;). When you visit our website, we collect the following data
          that is technically necessary for us to display the website to you:
          <ul className="list-disc pl-6">
            <li>Our visited Webiste</li>
            <li>Date and time at the moment of access</li>
            <li> Amount of data sent in bytes</li>
            <li>Source/reference from which you came to the page</li>
            <li>Browser used</li>
            <li>Operating system used</li>
            <li>IP address used (if applicable: in anonymized form)</li>
          </ul>
          Data processing is carried out in accordance with Art. 6 (1) point f
          GDPR on the basis of our legitimate interest in improving the
          stability and functionality of our website. The data will not be
          passed on or used in any other way. However, we reserve the right to
          check the server log files subsequently, if there are any concrete
          indications of illegal use.
        </div>
        <h2 className="font-semibold">3) Cookies</h2>
        <div>
          In order to make your visit to our website attractive and to enable
          the use of certain functions, we use so-called cookies on various
          pages. These are small text files that are stored on your end device.
          Some of the cookies we use are deleted after the end of the browser
          session, i.e. after closing your browser (so-called session cookies).
          Other cookies remain on your terminal and enable us or our partner
          companies (third-party cookies) to recognize your browser on your next
          visit (persistent cookies). If cookies are set, they collect and
          process specific user information such as browser and location data as
          well as IP address values according to individual requirements.
          Persistent cookies are automatically deleted after a specified period,
          which may vary depending on the cookie. You can check the duration of
          the respective cookie storage in the overview of the cookie settings
          of your web browser. In some cases, cookies are used to simplify the
          ordering process by saving settings (e.g. remembering the content of a
          virtual shopping basket for a later visit to the website). If personal
          data are also processed by individual cookies set by us, the
          processing is carried out in accordance with Art. 6 (1) point b GDPR
          either for the execution of the contract or in accordance with Art. 6
          (1) point f GDPR to safeguard our legitimate interests in the best
          possible functionality of the website and a customer-friendly and
          effective design of the page visit. We work together with advertising
          partners who help us to make our website more interesting for you. For
          this purpose, cookies from partner companies are also stored on your
          hard drive when you visit our website (third-party cookies). You will
          be informed individually and separately about the use of such cookies
          and the scope of the information collected in each case within the
          following sections. Please note that you can set your browser in such
          a way that you are informed about the setting of cookies and you can
          decide individually about their acceptance or exclude the acceptance
          of cookies for certain cases or generally. Each browser differs in the
          way it manages the cookie settings. This is described in the help menu
          of each browser, which explains how you can change your cookie
          settings. You will find these for the respective browsers under the
          following links:
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
        </div>

        <h2 className="font-semibold">4) Contacting Us</h2>
        <div>
          When you contact us (e.g. via contact form or e-mail), personal data
          is collected. Which data is collected in the case of a contact form
          can be seen from the respective contact form. This data is stored and
          used exclusively for the purpose of responding to your request or for
          establishing contact and for the associated technical administration.
          The legal basis for processing data is our legitimate interest in
          responding to your request in accordance with Art. 6 (1) point f GDPR.
          If your contact is aimed at concluding a contract, the additional
          legal basis for the processing is Art. 6 (1) point b GDPR. Your data
          will be deleted after final processing of your enquiry; this is the
          case if it can be inferred from the circumstances that the facts in
          question have been finally clarified, provided there are no legal
          storage obligations to the contrary.
        </div>

        <h2 className="font-semibold">5) Web Analysis Services</h2>
        <div>
          Matomo (formerly Piwik) <br></br>
          Data is collected and stored on this website using the Matomo web
          analysis service software (www.matomo.org), a service of InnoCraft
          Ltd., 150 Willis St, 6011 Wellington, New Zealand, (&quot;Matomo&quot;). This is
          done on the basis of our legitimate interest in statistical analysis
          of user behavior for optimization and marketing purposes pursuant to
          Art. 6 (1) point f GDPR. Pseudonymized user profiles can be created
          and evaluated from this data for the same purpose. To this end,
          cookies may be used. Cookies are small text files that are stored
          locally in the cache of the visitor&#39;s Internet browser. The cookies
          allow, among other things, the internet browser to be recognized. The
          data collected using Matomo technology (including your pseudonymized
          IP address) will be processed on our servers. The pseudonymized
          information generated by the cookie is not used to personally identify
          the visitor to this website and is not merged with personal data about
          the holder of the pseudonym. If you do not agree to the storage and
          evaluation of this data arising from your visit, you can object to the
          subsequent storage and use at any time, via mouse click. In this case,
          a so-called opt-out cookie is stored in your browser, which means that
          Matomo does not collect any session data. Please note: If your cookies
          are completely deleted, the opt-out cookie will also be deleted, and
          you may have to activate it again. To the extent required by law, we
          have obtained your consent to the processing of your data as described
          in accordance with Art. 6 (1) point a GDPR. You can withdraw your
          consent at any time with effect for the future. In order to exercise
          your right of withdrawal, please follow the procedure described above.
        </div>

        <h2 className="font-semibold">
          6) Embedding of Videos (e.g. YouTube, Facebook, Instagram)
        </h2>

        <div>
          Our website includes videos embedded from external platforms such as
          YouTube, Facebook, Instagram, or similar services. These integrations
          are made in the interest of providing an engaging and informative user
          experience in accordance with Art. 6 (1) lit. f GDPR. The embedded
          content is provided via so-called &quot;plugins&quot; or &quot;embed&quot; functions from
          the respective providers.
        </div>

        <div>
          When you access a page containing an embedded video, a connection to
          the servers of the respective provider may be established — regardless
          of whether the video is actively played. In doing so, personal data
          (e.g. your IP address, browser details, device information, possibly
          referrer URL) may be transmitted. If you are logged into one of these
          services, the provider may associate the page visit with your personal
          user account.
        </div>

        <div>
          We use the &quot;extended data protection mode&quot; provided by YouTube
          wherever possible. According to YouTube, in this mode, personal data
          is only processed once the video is played. For other providers (e.g.
          Facebook or Instagram), their respective privacy policies apply.
        </div>

        <div>
          Please note that we have no control over the scope and nature of data
          processing performed by third-party providers. For more information on
          how your data is handled, please refer to the privacy policies of the
          respective services:
        </div>

        <ul>
          <li>
            YouTube (Google Ireland Limited):{' '}
            <a
              className="text-blue-600 hover:underline"
              href="https://policies.google.com/privacy?hl=en"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://policies.google.com/privacy?hl=en
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
            Other platforms: please refer to the respective provider’s privacy
            notice
          </li>
        </ul>

        <div>
          Where consent is required for such embedding (e.g. via a cookie
          consent tool), the processing is based exclusively on Art. 6 (1)
          lit. a GDPR. This consent can be withdrawn at any time with future
          effect.
        </div>

        <h2 className="font-semibold">7) Right of the Data Subject</h2>
        <div>
          The applicable data protection law grants you the following
          comprehensive rights of data subjects (rights of information and
          intervention) vis-à-vis the data controller with regard to the
          processing of your personal data:
          <ul className="list-disc pl-6">
            <li>
              Right of access by the data subject pursuant to Art. 15 GDPR: You
              shall have the right to receive the following information: The
              personal data processed by us; the purposes of the processing; the
              categories of processed personal data; the recipients or
              categories of recipients to whom the personal data have been or
              will be disclosed; the envisaged period for which the personal
              data will be stored, or, if not possible, the criteria used to
              determine that period; the existence of the right to request from
              the controller rectification or erasure of personal data or
              restriction of processing personal data concerning the data
              subject or to object to such processing; the right to lodge a
              complaint with a supervisory authority; where the personal are not
              collected from the data subject, any available information as to
              their source; the existence of automated decision-making,
              including profiling and at least in those cases, meaningful
              information about the logic involved, as well as the significance
              and envisaged consequences of such processing for the data
              subject; the appropriate safeguards pursuant to Article 46 when
              personal data is transferred to a third country.
            </li>

            <li>
              Right to rectification pursuant to Art. 16 GDPR: You have the
              right to obtain from the controller without undue delay the
              rectification of inaccurate personal data concerning you and/or
              the right to have incomplete personal data completed which are
              stored by us.
            </li>

            <li>
              Right to erasure (“right to be forgotten”) pursuant to Art. 17
              GDPR: You have the right to obtain from the controller the erasure
              of personal data concerning you if the conditions of Art. 17 (2)
              GDPR are fulfilled. However, this right will not apply for
              exercising the freedom of expression and information, for
              compliance with a legal obligation, for reasons of public interest
              or for the establishment, exercise or defense of legal claims.
            </li>

            <li>
              Right to restriction of processing pursuant to Art. 18 GDPR: You
              have the right to obtain from the controller restriction of
              processing your personal data for the following reasons: As long
              as the accuracy of your personal data contested by you will be
              verified. If you oppose the erasure of your personal data because
              of unlawful processing and you request the restriction of their
              use instead. If you require the personal data for the
              establishment, exercise or defense of legal claims, once we no
              longer need those data for the purposes of the processing. If you
              have objected to processing on grounds relating to your personal
              situation pending the verification whether our legitimate grounds
              override your grounds.
            </li>

            <li>
              Right to be informed pursuant to Art. 19 GDPR: If you have
              asserted the right of rectification, erasure or restriction of
              processing against the controller, he is obliged to communicate to
              each recipient to whom the personal date has been disclosed any
              rectification or erasure of personal data or restriction of
              processing, unless this proves impossible or involves
              disproportionate effort. You have the right to be informed about
              those recipients.
            </li>

            <li>
              Right to data portability pursuant to Art. 20 GDPR: You shall have
              the right to receive the personal data concerning you, which you
              have provided to us, in a structured, commonly used and
              machine-readable format or to require that those data be
              transmitted to another controller, where technically feasible.
            </li>

            <li>
              Right to withdraw a given consent pursuant to Art. 7 (3) GDPR: You
              have the right to withdraw your consent for the processing of
              personal data at any time with effect for the future. In the event
              of withdrawal, we will immediately erase the data concerned,
              unless further processing can be based on a legal basis for
              processing without consent. The withdrawal of consent shall not
              affect the lawfulness of processing based on consent before its
              withdrawal.
            </li>

            <li>
              Right to lodge a complaint pursuant to Art. 77 GDPR: Without
              prejudice to any other administrative or judicial remedy, you have
              the right to lodge a complaint with a supervisory authority, in
              particular in the Member State of your habitual residence, place
              of work or place of the alleged infringement if you consider that
              the processing of personal data relating to you infringes the
              GDPR.
            </li>
          </ul>
          <h2 className="font-semibold">
            8) Duration of Storage of Personal Data
          </h2>
          <div>
            The duration of the storage of personal data is based on the
            respective legal basis, the purpose of processing and - if relevant
            – on the respective legal retention period (e.g. commercial and tax
            retention periods). If personal data is processed on the basis of an
            express consent pursuant to Art. 6 (1) point a GDPR, this data is
            stored until the data subject revokes his consent. If there are
            legal storage periods for data that is processed within the
            framework of legal or similar obligations on the basis of Art. 6 (1)
            point b GDPR, this data will be routinely deleted after expiry of
            the storage periods if it is no longer necessary for the fulfillment
            of the contract or the initiation of the contract and/or if we no
            longer have a justified interest in further storage. When processing
            personal data on the basis of Art. 6 (1) point f GDPR, this data is
            stored until the data subject exercises his right of objection in
            accordance with Art. 21 (1) GDPR, unless we can provide compelling
            grounds for processing worthy of protection which outweigh the
            interests, rights and freedoms of the data subject, or the
            processing serves to assert, exercise or defend legal claims. If
            personal data is processed for the purpose of direct marketing on
            the basis of Art. 6 (1) point f GDPR, this data is stored until the
            data subject exercises his right of objection pursuant to Art. 21
            (2) GDPR. Unless otherwise stated in the information contained in
            this declaration on specific processing situations, stored personal
            data will be deleted if it is no longer necessary for the purposes
            for which it was collected or otherwise processed.
          </div>
        </div>
        <h1 className="font-semibold">RIGHT TO OBJECT </h1>
        <div>
          IF, WITHIN THE FRAMEWORK OF A CONSIDERATION OF INTERESTS, WE PROCESS
          YOUR PERSONAL DATA ON THE BASIS OF OUR PREDOMINANT LEGITIMATE
          INTEREST, YOU HAVE THE RIGHT AT ANY TIME TO OBJECT TO THIS PROCESSING
          WITH EFFECT FOR THE FUTURE ON THE GROUNDS THAT ARISE FROM YOUR
          PARTICULAR SITUATION. IF YOU EXERCISE YOUR RIGHT TO OBJECT, WE WILL
          STOP PROCESSING THE DATA CONCERNED. HOWEVER, WE RESERVE THE RIGHT TO
          FURTHER PROCESSING IF WE CAN PROVE COMPELLING REASONS WORTHY OF
          PROTECTION FOR PROCESSING WHICH OUTWEIGH YOUR INTERESTS, FUNDAMENTAL
          RIGHTS AND FREEDOMS, OR IF THE PROCESSING SERVES TO ASSERT, EXERCISE
          OR DEFEND LEGAL CLAIMS. IF WE PROCESS YOUR PERSONAL DATA FOR DIRECT
          MARKETING PURPOSES, YOU HAVE THE RIGHT TO OBJECT AT ANY TIME TO THE
          PROCESSING OF YOUR PERSONAL DATA WHICH ARE USED FOR DIRECT MARKETING
          PURPOSES. YOU MAY EXERCISE THE OBJECTION AS DESCRIBED ABOVE. IF YOU
          EXERCISE YOUR RIGHT TO OBJECT, WE WILL STOP PROCESSING THE DATA
          CONCERNED FOR DIRECT ADVERTISING PURPOSES.
        </div>
      </div>
    </div>
  );
}
