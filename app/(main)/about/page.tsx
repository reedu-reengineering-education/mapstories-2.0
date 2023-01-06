import { PageHeader } from '@/components/PageHeader'

export default function Page() {
  return (
    <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
      <div className="mx-auto flex flex-col items-start gap-4 lg:w-[52rem]">
        <PageHeader
          heading="Über Mapstories"
          text="Hier sind weitere Informationen über Mapstories"
        ></PageHeader>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti,
          voluptatum a molestiae itaque natus amet? Deleniti esse, ipsum
          placeat, inventore omnis dolore ducimus, fugit ipsam incidunt
          molestiae sunt accusamus nam! Lorem ipsum dolor sit amet consectetur,
          adipisicing elit. Deleniti, voluptatum a molestiae itaque natus amet?
          Deleniti esse, ipsum placeat, inventore omnis dolore ducimus, fugit
          ipsam incidunt molestiae sunt accusamus nam! Lorem ipsum dolor sit
          amet consectetur, adipisicing elit. Deleniti, voluptatum a molestiae
          itaque natus amet? Deleniti esse, ipsum placeat, inventore omnis
          dolore ducimus, fugit ipsam incidunt molestiae sunt accusamus nam!
        </p>
      </div>
    </section>
  )
}
