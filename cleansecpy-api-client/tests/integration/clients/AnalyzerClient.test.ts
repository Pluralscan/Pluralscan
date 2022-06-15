import assert from "assert";
import { AnalyzerClient } from "../../../src/clients/AnalyzerClient";
import { ApiClient } from "../../../src/http/ApiClient";
import { loadEnv } from "../../unit/TestHelpers";

describe('AnalyzerClient.ts', () => {

    describe('constructor', () => {

        test('When provide valid api url, except new anlyzer api client instance.', () => {
            // Prepare
            loadEnv();
            const apiUrl = process.env.API_URL!;
            const client = new ApiClient(apiUrl);

            // Act
            const analyzerClient = new AnalyzerClient(client);

            // Assert
            expect(analyzerClient).toBeInstanceOf(AnalyzerClient);
        });

    });

    describe('getAnalyzers', () => {

        test('On successfull request, except list of analyzers.', async () => {
            // Prepare
            loadEnv();
            const apiUrl = process.env.API_URL!;
            const client = new ApiClient(apiUrl);
            const analyzerClient = new AnalyzerClient(client);

            // Act
            const analyzers = await analyzerClient.getAnalyzers();

            // Assert
            expect(analyzers).not.toBeNull();
        });

    });

});