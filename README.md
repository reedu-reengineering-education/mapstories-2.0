<div align="center">
  <h2 align="center">re:edu App</h2>

  <p align="center">
     🚀 Template for re:edu applications
    <br />
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

The re:edu App is a web based system to visualize the distribution process of teaching students.

Features:

- 🏎 Fast

### Built With

- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)

<!-- GETTING STARTED -->

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites

You will need to have Node.js and Yarn installed.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/reedu-reengineering-education/next-13-tailwind-starter.git
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
5. Run the App
   ```sh
   yarn dev
   ```

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## GitHub Actions

With GitHub Actions, we automatically build Docker images and push them to the GitHub package registry.

Docker images will be built on:

- Pull Requests to `main`
- Pushes to `main`
- Releasing new versions under a `v*.*.*` tag

<!-- CONTACT -->

## Contact

re:edu GmbH - [@reedu_de](https://twitter.com/reedu_de) - kontakt@reedu.de

Project Link: [https://github.com/reedu-reengineering-education/next-13-tailwind-starter](https://github.com/reedu-reengineering-education/next-13-tailwind-starter)
