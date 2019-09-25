import { LightStatus } from './models/light';
import { SmartHomeDatabase } from './database';

const lights = [{
    name: 'bedroom',
    status: LightStatus.ON,
    color: '#ffffff'
},
{
    name: 'bedroom2',
    status: LightStatus.ON,
    color: '#ffffff'
},
{
    name: 'livingroom',
    status: LightStatus.ON,
    color: '#ffffff'
},
{
    name: 'kitchen',
    status: LightStatus.ON,
    color: '#ffffff'
},
{
    name: 'bathroom',
    status: LightStatus.OFF,
    color: '#ffffff'
},]

const db = new SmartHomeDatabase();