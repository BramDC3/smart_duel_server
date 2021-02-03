# Smart Duel Server

Smart Duel Server is a Node.js application used for playing the popular TCG named Yu-Gi-Oh!. It's the bridge between the [Smart Duel Disk][Smart Duel Disk] (SDD) and the [Smart Duel Gazer][Smart Duel Gazer] (SDG).

## How does it work?

We use [socket.io][Socket.io website] to send events from from the SDD to the SDG.

Let's say you summon a Blue-Eyes White Dragon in the Smart Duel Disk (SDD). The SDD will then send an event to the Smart Duel Server (SDS) and then the SDS will send it to the the Smart Duel Gazer (SDG) to let it know that a BEWD has been summoned. The user performs the action using the SDD and the SDG will visualise this action.

The SDD runs on an Android/iOS device and is something you wear on your arm, like a duel disk. The SDG runs on AR glasses / an AR headset / Google Cardboard / ... which is something you wear on your head.

Currently the server has to be hosted locally but we intend to move it to the cloud when it's production ready.

## I'm a backend developer, can I help?

Yes! If you're interested in helping out, send me a message on [our Discord server][Discord link].

## Getting started

1. Download Docker at [docker.com][Docker download]
3. Run the app using the Docker composer
   ```sh
   docker-compose up
   ```

[Smart Duel Disk]: https://github.com/BramDC3/smart_duel_disk
[Smart Duel Gazer]: https://github.com/BramDC3/smart_duel_gazer
[Socket.io website]: https://socket.io/
[Discord link]: https://discord.gg/XCcfcbBcjE
[Docker download]: https://www.docker.com/get-started
