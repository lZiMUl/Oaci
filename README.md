## Oaci
### An OpenFrp auto-check-in interface package.

# Install
```text
npm install oaci --save
```

# Usage
```ts
import {info} from 'node:console';
import Oaci from 'oaci';

const oaci: Oaci = new Oaci('Username', 'Password');
const {session, authorization, cookie} = await oaci.getUserData;

info(await Oaci.Sgin(session, authorization, cookie));
```