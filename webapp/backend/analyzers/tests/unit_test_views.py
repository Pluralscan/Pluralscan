from cleansecpy.domain.analyzer.analyzer import Analyzer


class TestAnalyzersView:
    def test_returns_analyzers_serialized_and_200(self):

        pass

    class ScenarioMaker:
        def given_an_analyzer_one(self):
            self.analyzer_one = Analyzer()
            return self
