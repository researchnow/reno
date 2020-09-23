# Reno

The biggest little UI in the world.

## Requirements

Node and npm.

## Running locally

- To install dependencies:

      npm install

- To run a development/demo server:

      npm start

- To generate a static version of the demo website:

      npm run build

## Using

In order to use it on other projects:

- Upgrade Reno: `npm update reno`.

For local development, the simplest thing to do is linking instead of doing publishing cycles:

- Declare Reno as linkable:
  - Go to Reno.
  - Do: `npm link`.
- Use Reno as a link:
  - Go to other project.
  - Do: `npm link @researchnow/reno` (use its name from `package.json`).

## Publishing Reno

- Make sure it works.
- Build a distribution: `npm run build`.
- Bump the version in `package.json`.
  - For npm: `npm i`.
- If the documentation has changed (in `/pages`):
  - Run `npm run build` to regenerate `/docs`.
    - DO NOT EDIT `/docs` MANUALLY!
- Commit everything.
- Tag it. Example:
  - Mark it up: `git tag 1.0.9`.
  - Push tags up: `git push --tags`.
- Update the version in the dependency link.

## Designs

You may find the designs here: https://projects.invisionapp.com/d/main#/projects/prototypes/10491947
