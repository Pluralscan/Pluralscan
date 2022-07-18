import * as dotenv from 'dotenv';

export function loadEnv(){
    const path = `${__dirname}\\unit-test.env`;
    dotenv.config({ path })
}