<div align="center">
  <h1 align="center">📍MapStories</h1>

  <p align="center">
     Tell stories with maps! <br>
     <img src="assets/logos/logo_text_claim.png" alt="MapStories Logo"/>
  </p>
  
  <p align="center">
    <a href="https://www.mapstories.de">🌐 Visit the live site</a>
  </p>
</div>

---

## 🗺️ About The Project

MapStories is a web-based platform designed to visualize the process of distributing educational content and stories through interactive maps. It enables users to explore complex narratives and datasets in a visual and engaging way.

### 🔧 Built With

- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)

---

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### 🛠️ Installation

To get a local copy up and running, follow these steps:
tt

1. Clone the repository:
   ```sh
   git clone https://github.com/reedu-reengineering-education/mapstories-2.0.git
   ```
2. Install NPM packages
   ```sh
   yarn
   ```
3. start development DB
   ```sh
   docker compose up -d
   ```
4. migrate DB on first run
   ```sh
   npx prisma migrate dev
   ```
5. Seed database with themes
   ```sh
   npx prisma db seed
   ```
6. Run the App
   ```sh
   yarn dev
   ```

The separate MapStories admin interface is optional and excluded from the default
Docker Compose startup. To include it, authenticate with `docker login ghcr.io`
using an account and token with read access to the admin image, configure
`.adminenv`, and run:

```sh
docker compose --profile admin up -d
```

### Satellite maps

The satellite and satellite-with-labels views use MapTiler Cloud. Set
`NEXT_PUBLIC_MAPTILER_KEY` in `.env` before starting or building the app.
Street and light maps still use `NEXT_PUBLIC_MAPBOX_TOKEN`.

MapTiler's [Free plan](https://www.maptiler.com/cloud/pricing/) supports testing
and non-commercial use, with 100,000 API requests per month when using our
third-party map renderer. On the Free plan, access pauses at the quota rather
than incurring overage charges. Keep the MapTiler logo and source attribution
visible. No paid plan or account setting is changed by this integration.

## 🤝 Contributing

To contribute:

- Fork the repository
- Create a new feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## ⚙️ GitHub Actions

With GitHub Actions, Docker images are automatically built and pushed to the GitHub package registry on:

- Pull Requests to main
- Pushes to main
- Releasing new versions under a v*.*.\* tag

## 📧 Contact

kontakt@reedu.de
