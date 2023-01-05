import { Logo } from './Icons'

export function Footer() {
  return (
    <footer className="container bg-white text-slate-600">
      <div className="flex  flex-col items-center justify-between gap-4 border-t border-t-slate-200 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo className="w-8" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{' '}
            <a
              className="font-medium underline underline-offset-4"
              href={'#'}
              rel="noreferrer"
              target="_blank"
            >
              reedu
            </a>
            . Hosted on{' '}
            <a
              className="font-medium underline underline-offset-4"
              href="https://vercel.com"
              rel="noreferrer"
              target="_blank"
            >
              Vercel
            </a>
            .
          </p>
        </div>
        <p className="text-center text-sm md:text-left">
          The source code is available on{' '}
          <a
            className="font-medium underline underline-offset-4"
            href={'#'}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
