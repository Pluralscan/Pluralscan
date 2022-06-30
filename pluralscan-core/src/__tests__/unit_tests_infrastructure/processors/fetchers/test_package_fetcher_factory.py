from pluralscan.infrastructure.processor.fetchers.package_fetcher_factory import \
    PackageFetcherFactory


def test_detect_origin():
    factory = PackageFetcherFactory()
    origin = factory._detect_origin("https://github.com/AstunTechnology/python-basics.git")
    assert origin
