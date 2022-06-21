import { RestClient } from "../../src/RestClient";
import { RestClientOptions } from "../../src/RestClientOptions";

describe('RestClient.ts', () => {

    describe('constructor', () => {

        test('When options provided, except new rest client instance.', () => {
            const options = new RestClientOptions("");

            const client = new RestClient(options);

            expect(client).toBeInstanceOf(RestClient);
        });

    });

});